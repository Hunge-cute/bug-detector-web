export type BugType = "dbz" | "npd" | "xss" | "ci" | "apt";

export type ModelName = "gpt-4.1-mini" | "gpt-4o-mini";

export type AnalysisStage =
  | "started"
  | "detection"
  | "trace_result"
  | "completed";

export interface TraceStep {
  line: number;
  variable: string;
}

export interface AnalysisEvent {
  stage: AnalysisStage;
  message?: string;
  trace?: [number, string][];
  output?: unknown[];
  result?: boolean | Record<string, number>;
  reason?: {
    wrong_flow_response?: string;
  };
  final_result?: {
    total: number;
    final: number;
    type_sanitize: number;
    functionality_sanitize: number;
    order_sanitize: number;
    reachability_sanitize: number;
  };
  timestamp?: number;
}

export const BUG_TYPE_LABELS: Record<BugType, string> = {
  dbz: "Divide_by_Zero",
  npd: "NULL_Pointer_Dereference",
  xss: "XSS",
  ci: "OS_Command_Injection",
  apt: "Absolute_Path_Traversal",
};

export const MODEL_LABELS: Record<ModelName, string> = {
  "gpt-4.1-mini": "GPT-4.1 mini",
  "gpt-4o-mini": "GPT-4o mini",
};