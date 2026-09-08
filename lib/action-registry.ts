import {
  ACTION_RESULT_STATES,
  safeActionId,
  type ActionContract,
  type ActionExecutor,
  type ActionOwnerCore,
  type ActionSurface,
} from "@/lib/action-contract";

const registry = new Map<string, ActionContract>();

function inferOwner(area: string): ActionOwnerCore {
  if (/scene|purchase|store/i.test(area)) return "scene";
  if (/flash|pixel/i.test(area)) return "flash-pixel";
  if (/media|studio|camera|audio|video/i.test(area)) return "media";
  if (/ai/i.test(area)) return "ai";
  if (/connect|device|tv|pair/i.test(area)) return "connect";
  return "eventspace";
}

function inferExecutor(action: string): ActionExecutor {
  if (/back|open|close|select|choose|tab|menu|theme|language/i.test(action)) return "navigation";
  if (/render|export|generate|publish|create|save|pay|order|send|login|logout/i.test(action)) return "api";
  if (/camera|micro|device|pair|connect|scan|cast/i.test(action)) return "adapter";
  return "job";
}

export function registerAction(contract: ActionContract) {
  const current = registry.get(contract.actionId);
  if (current && JSON.stringify(current) !== JSON.stringify(contract)) {
    throw new Error(`Duplicate actionId with conflicting contract: ${contract.actionId}`);
  }
  registry.set(contract.actionId, contract);
  return contract;
}

export function discoverAction(input: {
  actionId?: string;
  name: string;
  area: string;
  screen: string;
  surface?: ActionSurface;
}): ActionContract {
  const actionId = input.actionId || `${safeActionId(input.surface || "pro")}.${safeActionId(input.area)}.${safeActionId(input.name)}`;
  const existing = registry.get(actionId);
  if (existing) return existing;
  const executor = inferExecutor(input.name);
  return registerAction({
    actionId,
    name: input.name,
    surface: input.surface || "pro",
    screen: input.screen,
    ownerCore: inferOwner(input.area),
    // Discovered actions are visible to the control plane, but mutations remain
    // gated until an explicit contract and verified receipt are wired.
    status: executor === "navigation" ? "active" : "gated",
    permissions: [],
    preconditions: executor === "navigation" ? [] : ["explicit-contract-required"],
    inputSchema: "none",
    executor,
    receiptSchema: executor === "navigation" ? "navigation-receipt/v1" : "unconfigured",
    resultStates: [...ACTION_RESULT_STATES],
    fallback: executor === "navigation" ? "manual-safe-step" : "show-gated",
    telemetry: "action-ledger/v1",
    lastReviewedAt: "2026-09-08",
  });
}

export function actionRegistrySnapshot() {
  return [...registry.values()].sort((a, b) => a.actionId.localeCompare(b.actionId));
}
