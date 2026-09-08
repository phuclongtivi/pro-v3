export type ActionSurface = "mobi" | "tv" | "pro";
export type ActionOwnerCore = "eventspace" | "connect" | "scene" | "flash-pixel" | "media" | "ai";
export type ActionStatus = "active" | "gated" | "planned" | "deprecated";
export type ActionExecutor = "api" | "adapter" | "job" | "navigation";
export type ActionResultState = "success" | "failed" | "pending" | "gated";

export type ActionContract = {
  actionId: string;
  name: string;
  surface: ActionSurface;
  screen: string;
  ownerCore: ActionOwnerCore;
  status: ActionStatus;
  permissions: string[];
  preconditions: string[];
  inputSchema: string;
  executor: ActionExecutor;
  receiptSchema: string;
  resultStates: ["success", "failed", "pending", "gated"];
  fallback: "show-gated" | "retry" | "manual-safe-step";
  telemetry: string;
  lastReviewedAt: string;
};

export type ActionReceipt = {
  receiptId: string;
  actionId: string;
  state: ActionResultState;
  issuedAt: string;
  source: "api" | "adapter" | "job" | "navigation";
  artifactId?: string;
  message?: string;
};

export type ActionInvocation = {
  invocationId: string;
  actionId: string;
  startedAt: string;
  state: ActionResultState;
  receipt?: ActionReceipt;
  reason?: string;
};

export const ACTION_RESULT_STATES = ["success", "failed", "pending", "gated"] as const;

export function isVerifiedReceipt(receipt: ActionReceipt | undefined, actionId: string): boolean {
  return !!receipt
    && receipt.actionId === actionId
    && receipt.state === "success"
    && receipt.receiptId.trim().length > 0
    && receipt.issuedAt.trim().length > 0;
}

export function safeActionId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 120) || "unnamed";
}
