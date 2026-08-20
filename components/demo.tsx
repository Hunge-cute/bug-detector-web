"use client";

import { Suspense, useState, useCallback } from "react";
import { TabEditor } from "./tab-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TabResult } from "./tab-result";
import { TabSanitized } from "./tab-sanitized";
import type { AnalysisEvent, BugType, ModelName } from "@/lib/types";

type TabId = "editor" | "results" | "sanitized";

export function BugAnalyzerDemo() {
  const [results, setResults] = useState<AnalysisEvent[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("editor");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [type, setType] = useState<BugType>("dbz");
  const [model, setModel] = useState<ModelName>("gpt-4.1-mini");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("snippet");
  const [sanitizedCode, setSanitizedCode] = useState("");

  const resetDemo = useCallback(() => {
    setResults([]);
    setCode("");
    setFile(null);
    setFileName("snippet");
    setSanitizedCode("");
    setIsAnalyzing(false);
    setActiveTab("editor");
  }, []);

  const appendResult = useCallback((event: AnalysisEvent) => {
    setResults((prev) => [
      ...prev,
      { ...event, timestamp: Date.now() },
    ]);
  }, []);

  return (
    <Tabs value={activeTab} className="w-full" onValueChange={(v) => setActiveTab(v as TabId)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editor">Code Analyzer</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="sanitized">Sanitized</TabsTrigger>
      </TabsList>
      <TabsContent value="editor" className="mt-4">
        <TabEditor
          file={file}
          code={code}
          language={language}
          model={model}
          type={type}
          isAnalyzing={isAnalyzing}
          onResultsChange={setResults}
          onAppendResult={appendResult}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onModelChange={setModel}
          onFileChange={setFile}
          onActiveTabChange={setActiveTab}
          onTypeChange={setType}
          onIsAnalyzingChange={setIsAnalyzing}
          onFileNameChange={setFileName}
          onSanitizedCodeChange={setSanitizedCode}
        />
      </TabsContent>
      <TabsContent value="results" className="mt-4">
        <TabResult
          type={type}
          model={model}
          fileName={fileName}
          results={results}
          isAnalyzing={isAnalyzing}
          onSanitizedCodeChange={setSanitizedCode}
          onActiveTabChange={setActiveTab}
        />
      </TabsContent>
      <TabsContent value="sanitized" className="mt-4">
        <Suspense fallback={null}>
          <TabSanitized code={sanitizedCode} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

export default BugAnalyzerDemo;