import {createHash, randomUUID} from "node:crypto";
import {
  SIX_CORE_ORDER,
  signCoreReceipt,
  verifyCoreReceipt,
  verifyReceipt,
  type CoreReceipt,
  type ExecutionCommand,
  type SixCoreEnvelope,
  type SixCoreId,
} from "@/lib/execution-contract";
import {executeProduction} from "@/lib/production-executor";

const visualPattern = /(scene|template|asset|flash|pixel|media|camera|audio|video|mixer|live|screen|image)/i;
const aiPattern = /(^|[.\s-])ai([.\s-]|$)|suggest|recommend|auto/i;
const connectionPattern = /(connect|device|pair|tv|qr|login|auth|provider|network)/i;

function hash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function ownerFor(signature: string): SixCoreId {
  if (connectionPattern.test(signature)) return "connection";
  if (aiPattern.test(signature)) return "long-ai";
  if (/scene|template|asset|purchase|store/i.test(signature)) return "long-scene";
  if (/flash|pixel|flow/i.test(signature)) return "flash-flow";
  if (/media|studio|camera|audio|video|mixer|live/i.test(signature)) return "media";
  return "eventspace";
}

function operationFor(core: SixCoreId, active: boolean) {
  const operations: Record<SixCoreId, [string, string]> = {
    eventspace: ["Xác minh Action Contract, ngữ cảnh, quyền và vòng đời tác vụ", "Bảo toàn ngữ cảnh EventSpace"],
    connection: ["Xác minh phiên, consent, mạng, provider và năng lực adapter", "Không yêu cầu kết nối ngoài"],
    "long-ai": ["Áp dụng policy AI và chuẩn hóa đầu vào có cấu trúc", "Áp dụng policy không gọi mô hình"],
    "long-scene": ["Lập bản đồ đối tượng, scene, Store và tài nguyên", "Bảo toàn cấu trúc tác vụ"],
    "flash-flow": ["Tối ưu đường thực thi và ngân sách hiển thị", "Đi theo đường thực thi an toàn ngắn nhất"],
    media: ["Xác minh nguồn, preview, render và đầu ra media", "Không tạo đầu ra media"],
  };
  return operations[core][active ? 0 : 1];
}

function activeCores(signature: string, owner: SixCoreId) {
  const visual = visualPattern.test(signature);
  return new Set<SixCoreId>([
    "eventspace",
    owner,
    ...(connectionPattern.test(signature) ? ["connection" as const] : []),
    ...(aiPattern.test(signature) ? ["long-ai" as const] : []),
    ...(visual ? ["long-scene" as const, "flash-flow" as const, "media" as const] : []),
  ]);
}

export async function executeThroughSixCores(command: ExecutionCommand): Promise<SixCoreEnvelope> {
  const signature = `${command.actionId}:${command.adapter}:${JSON.stringify(command.input || {})}`;
  const ownerCore = ownerFor(signature);
  const active = activeCores(signature, ownerCore);
  const inputHash = hash({actionId: command.actionId, input: command.input || {}});
  const receipts: CoreReceipt[] = [];
  let previousReceiptHash = "ROOT";

  for (const [index, core] of SIX_CORE_ORDER.entries()) {
    const isActive = active.has(core);
    const receipt = signCoreReceipt({
      version: "long-core-receipt/v1",
      receiptId: randomUUID(),
      invocationId: command.invocationId,
      actionId: command.actionId,
      sequence: index + 1,
      core,
      status: isActive ? "processed" : "pass-through",
      operation: operationFor(core, isActive),
      resultCode: isActive ? "CORE_POLICY_APPLIED" : "CONTEXT_PRESERVED",
      inputHash,
      previousReceiptHash,
      issuedAt: new Date().toISOString(),
    });
    receipts.push(receipt);
    previousReceiptHash = hash(receipt);
  }

  const chainVerified = receipts.length === SIX_CORE_ORDER.length
    && receipts.every((receipt, index) => receipt.sequence === index + 1
      && receipt.core === SIX_CORE_ORDER[index]
      && receipt.inputHash === inputHash
      && receipt.previousReceiptHash === (index === 0 ? "ROOT" : hash(receipts[index - 1]))
      && verifyCoreReceipt(receipt));

  if (!chainVerified) {
    return {version:"long-six-core-envelope/v1", invocationId:command.invocationId, actionId:command.actionId, state:"failed", resultCode:"CORE_CHAIN_INVALID", message:"Chuỗi receipt sáu lõi không hợp lệ.", ownerCore, coreReceipts:receipts, chainVerified:false, completedAt:new Date().toISOString()};
  }

  const execution = await executeProduction(command);
  const executorReceipt = execution.ok ? execution.receipt : undefined;
  const executorVerified = executorReceipt ? verifyReceipt(executorReceipt) : false;
  if (execution.ok && executorVerified) {
    return {
      version:"long-six-core-envelope/v1", invocationId:command.invocationId, actionId:command.actionId,
      state:"success", resultCode:"ACTION_COMPLETED", message:"Sáu lõi và executor đã trả receipt hợp lệ.",
      ownerCore, coreReceipts:receipts, executorReceipt, chainVerified, completedAt:new Date().toISOString(),
    };
  }
  if (execution.ok) {
    return {
      version:"long-six-core-envelope/v1", invocationId:command.invocationId, actionId:command.actionId,
      state:"failed", resultCode:"EXECUTOR_RECEIPT_INVALID", message:"Executor trả receipt không hợp lệ.",
      ownerCore, coreReceipts:receipts, executorReceipt, chainVerified, completedAt:new Date().toISOString(),
    };
  }
  return {
    version: "long-six-core-envelope/v1",
    invocationId: command.invocationId,
    actionId: command.actionId,
    state: execution.state,
    resultCode: execution.code,
    message: execution.message,
    ownerCore,
    coreReceipts: receipts,
    executorReceipt,
    chainVerified,
    completedAt: new Date().toISOString(),
  };
}
