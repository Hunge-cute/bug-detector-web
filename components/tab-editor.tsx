"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisEvent, BugType, ModelName } from "@/lib/types";
import { BUG_TYPE_LABELS, MODEL_LABELS } from "@/lib/types";

interface TabEditorProps {
  file: File | null;
  code: string;
  language: string;
  model: ModelName;
  type: BugType;
  isAnalyzing: boolean;
  onResultsChange: (results: AnalysisEvent[]) => void;
  onAppendResult: (event: AnalysisEvent) => void;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onModelChange: (model: ModelName) => void;
  onFileChange: (file: File | null) => void;
  onActiveTabChange: (tab: "editor" | "results" | "sanitized") => void;
  onTypeChange: (type: BugType) => void;
  onIsAnalyzingChange: (value: boolean) => void;
  onFileNameChange: (name: string) => void;
  onSanitizedCodeChange: (code: string) => void;
}

export function TabEditor({
  file,
  code,
  language,
  model,
  type,
  isAnalyzing,
  onResultsChange,
  onAppendResult,
  onCodeChange,
  onLanguageChange,
  onModelChange,
  onFileChange,
  onActiveTabChange,
  onTypeChange,
  onIsAnalyzingChange,
  onFileNameChange,
  onSanitizedCodeChange,
}: TabEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileChange(selected);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          onCodeChange(event.target.result);
        }
      };
      reader.readAsText(selected);
    }
    onResultsChange([]);
    onSanitizedCodeChange("");
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (isAnalyzing || !code.trim()) return;

    onIsAnalyzingChange(true);
    onResultsChange([]);
    onActiveTabChange("results");

    try {
      const form = new FormData();

      if (file) {
        form.append("file", file);
        onFileNameChange(file.name.replace(/\.[^.]+$/, ""));
      } else {
        const blob = new Blob([code], { type: "text/plain" });
        form.append("file", blob, `snippet.${language}`);
        onFileNameChange("snippet");
      }

      const res = await fetch(
        `/api/analysis?model_name=${model}&bug_type=${type}`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok || !res.body) {
        throw new Error(`Analysis failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            onAppendResult(JSON.parse(line) as AnalysisEvent);
          } catch {
            // Skip malformed lines from the stream
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message ?? "Failed to start analysis");
    } finally {
      onIsAnalyzingChange(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Code Analyzer</CardTitle>
        <CardDescription>
          Paste your code or upload a file to analyze it for potential bugs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={onModelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MODEL_LABELS) as ModelName[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {MODEL_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Bug type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(BUG_TYPE_LABELS) as BugType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {BUG_TYPE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".java,.py,.js,.ts,.cs,.txt"
              onChange={handleFileChange}
            />
          </div>
          <Textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Paste your code here..."
            className="font-mono min-h-[300px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            onCodeChange("");
            onResultsChange([]);
            onFileChange(null);
            onFileNameChange("snippet");
            onSanitizedCodeChange("");
            onActiveTabChange("editor");
            onIsAnalyzingChange(false);
          }}
        >
          Clear
        </Button>
        <Button disabled={isAnalyzing || !code.trim()} onClick={handleAnalyze}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Code"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}