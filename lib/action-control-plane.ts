import {isVerifiedReceipt, type ActionInvocation, type ActionReceipt} from "@/lib/action-contract";
import {discoverAction} from "@/lib/action-registry";

export function beginAction(input: {
  actionId?: string;
  name: string;
  area: string;
  screen: string;
}): ActionInvocation {
  const contract = discoverAction(input);
  const invocationId = `${contract.actionId}:${Date.now().toString(36)}:${crypto.randomUUID().slice(0, 8)}`;
  if (contract.status !== "active") {
    return {
      invocationId,
      actionId: contract.actionId,
      startedAt: new Date().toISOString(),
      state: "gated",
      reason: contract.preconditions.join(",") || "action-not-active",
    };
  }
  return {
    invocationId,
    actionId: contract.actionId,
    startedAt: new Date().toISOString(),
    state: "pending",
  };
}

export function settleAction(invocation: ActionInvocation, receipt?: ActionReceipt): ActionInvocation {
  if (!receipt) return {...invocation, state: "pending", reason: "missing-receipt"};
  if (!isVerifiedReceipt(receipt, invocation.actionId)) {
    return {...invocation, state: receipt.state === "gated" ? "gated" : "failed", receipt, reason: "invalid-receipt"};
  }
  return {...invocation, state: "success", receipt, reason: undefined};
}
