"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  CircleDot,
  CircleEllipsis,
  Code2,
  Loader2,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import type { AnalysisEvent, BugType } from "@/lib/types";

interface TabResultProps {
  type: BugType;
  model: string;
  fileName: string;
  results: AnalysisEvent[];
  isAnalyzing: boolean;
  onSanitizedCodeChange: (code: string) => void;
  onActiveTabChange: (tab: "editor" | "results" | "sanitized") => void;
}

const BUG_TYPE_DISPLAY: Record<BugType, string> = {
  dbz: "Divide by Zero",
  npd: "NULL Pointer Dereference",
  xss: "Cross-Site Scripting (XSS)",
  ci: "OS Command Injection",
  apt: "Absolute Path Traversal",
};

function humanizeStage(stage: string) {
  return stage
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function stageIcon(result: AnalysisEvent) {
  switch (result.stage) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "started":
      return <CircleDot className="h-5 w-5 text-green-500" />;
    case "detection":
      return <Circle className="h-5 w-5 text-amber-500" />;
    case "trace_result":
      return <CircleEllipsis className="h-5 w-5" />;
    default:
      if (result.result === true) {
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      }
      if (result.result === false) {
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      }
      return <Circle className="h-5 w-5 text-blue-500" />;
  }
}

export function TabResult({
  type,
  model,
  fileName,
  results,
  isAnalyzing,
  onSanitizedCodeChange,
  onActiveTabChange,
}: TabResultProps) {
  const [isGeneratingFixes, setIsGeneratingFixes] = useState(false);

  const handleGenerateFixes = async () => {
    if (isGeneratingFixes) return;
    if (results.length === 0) {
      toast.error("Please analyze code first");
      return;
    }

    setIsGeneratingFixes(true);

    try {
      const response = await fetch(
        `/api/sanitize?file_name=${fileName}&model_name=${model}&bug_type=${type}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sanitized code");
      }

      onSanitizedCodeChange(await response.text());
      onActiveTabChange("sanitized");
      toast.success("Generated fixes for detected bugs");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate fixes");
    } finally {
      setIsGeneratingFixes(false);
    }
  };

  const completed = results.find((r) => r.stage === "completed");
  const summary = completed?.final_result;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bug Detection Results</CardTitle>
        <CardDescription>
          Live log of detected bugs and sanitization checks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stageIcon(result)}
                    <span className="font-medium">
                      {humanizeStage(result.stage)}
                    </span>
                    {result.stage === "detection" && (
                      <Badge variant="outline" className="ml-2">
                        {BUG_TYPE_DISPLAY[type]}
                      </Badge>
                    )}
                  </div>
                  {result.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {result.message && (
                  <p className="text-sm text-muted-foreground ml-7">
                    {result.message}
                  </p>
                )}

                {Array.isArray(result.trace) && (
                  <div className="ml-7 mt-2 p-3 bg-primary/5 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Trace Details:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.trace.map(([line, variable], idx) => (
                        <li key={idx}>
                          Line {line}: Variable{" "}
                          <code className="bg-background px-1 rounded">
                            {variable}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(result.output) && (
                  <div className="ml-7 mt-2 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Detection Results:</h4>
                    <p className="mb-2">
                      Found {String(result.output[0] ?? 0)} potential bug(s)
                    </p>
                    <div className="space-y-3">
                      {Array.isArray(result.output[2]) &&
                        result.output[2].map((text: unknown, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 bg-background rounded border"
                          >
                            {String(text)}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {result.stage === "trace_result" &&
                  typeof result.result === "object" &&
                  result.result && (
                  <div className="ml-7 mt-2 p-3 bg-muted rounded-md text-sm">
                    <div className="grid grid-cols-2 gap-2 font-medium sm:flex sm:justify-between">
                      <div>
                        Type Sanitize: {result.result.type_sanitize}
                      </div>
                      <div>
                        Functionality Sanitize:{" "}
                        {result.result.functionality_sanitize}
                      </div>
                      <div>Order Sanitize: {result.result.order_sanitize}</div>
                      <div>
                        Reachability Sanitize:{" "}
                        {result.result.reachability_sanitize}
                      </div>
                    </div>
                  </div>
                )}

                {result.reason?.wrong_flow_response && (
                  <div className="ml-7 mt-2 p-3 bg-destructive/5 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Analysis Details:</h4>
                    <p className="whitespace-pre-line">
                      {result.reason.wrong_flow_response}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {summary && summary.total > 0 && (
              <div className="mt-6 p-4 border rounded-lg bg-background">
                <h3 className="text-lg font-medium mb-3">Analysis Summary</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type Sanitize:</span>
                      <Badge
                        variant={
                          summary.type_sanitize > 0 ? "default" : "destructive"
                        }
                      >
                        {summary.type_sanitize}/{summary.total}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Functionality Sanitize:</span>
                      <Badge
                        variant={
                          summary.functionality_sanitize > 0
                            ? "default"
                            : "destructive"
                        }
                      >
                        {summary.functionality_sanitize}/{summary.total}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Order Sanitize:</span>
                      <Badge
                        variant={
                          summary.order_sanitize > 0 ? "default" : "destructive"
                        }
                      >
                        {summary.order_sanitize}/{summary.total}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Reachability Sanitize:</span>
                      <Badge
                        variant={
                          summary.reachability_sanitize > 0
                            ? "default"
                            : "destructive"
                        }
                      >
                        {summary.reachability_sanitize}/{summary.total}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <Badge variant="default">{summary.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Final:</span>
                    <Badge
                      variant={
                        summary.final > 0 ? "default" : "destructive"
                      }
                    >
                      {summary.final}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={handleGenerateFixes}
                    className="w-full"
                    disabled={isGeneratingFixes}
                  >
                    {isGeneratingFixes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Fixes...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Fixes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Analyzing...</span>
              </div>
            )}
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Code2 className={cn("h-12 w-12 mb-4")} />
            <p>No analysis results yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}