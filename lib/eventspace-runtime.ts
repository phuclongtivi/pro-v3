export type RuntimeCoreId =
  | "long-scene"
  | "flash-flow"
  | "eventspace"
  | "media"
  | "long-ai"
  | "connection";

export type RuntimeStatus =
  | "planned"
  | "ready"
  | "needs-input"
  | "needs-confirmation"
  | "unavailable"
  | "error";

export type RuntimeCostClass = "local" | "cloud-low" | "cloud";

export type DeviceCapability = {
  width: number;
  height: number;
  deviceMemoryGb: number;
  cpuCores: number;
  networkMbps: number;
  batteryLevel: number;
  thermal: "cool" | "warm" | "hot";
  prefersReducedMotion: boolean;
};

export type PixelExecutionPlan = {
  version: "FPG-1.0";
  domain: "pixel";
  transportUnit: "frame";
  target: "720p" | "1080p";
  width: number;
  height: number;
  pixelBudget: number;
  fps: 24 | 30 | 60;
  bitrateKbps: number;
  codecProfile: "h264-balanced" | "vp9-efficient" | "av1-efficient";
  roiPriority: Array<"face" | "text" | "product" | "foreground">;
  tileSize: 16 | 32 | 64;
  effectBudget: "low" | "balanced" | "high";
  execution: "local-gpu" | "local-cpu";
  fallback: "reduce-effects" | "720p-safe" | "hold-last-good-plan";
  enhancedLabel?: "4K Enhanced" | "8K Enhanced";
  reason: string[];
};

export type EventSpaceCommand = {
  id: string;
  area: string;
  action: string;
  label: string;
  intent?: string;
  inputs?: Record<string, unknown>;
  confirmed?: boolean;
  receiptVerified?: boolean;
  source?: "ui" | "event" | "ai" | "device";
};

export type CoreExecution = {
  core: RuntimeCoreId;
  operation: string;
  mode: "active" | "pass-through";
};

export type RuntimeMeasurements = {
  taskSuccess: 0 | 1;
  userActions: number;
  automationRate: number;
  latencyMs: number;
  qualityScore: number;
  pixelEfficiency: number;
  costClass: RuntimeCostClass;
};

export type FlashArtifact = {
  id: string;
  kind: "event-flash" | "flash-flow-preview" | "flash-flow-output-preview";
  state: "draft" | "preview-ready" | "published";
  createdAt: string;
  source: "event-assets" | "device-assets";
  title: string;
  durationSeconds: number;
  sceneCount: number;
  pixelPlan: PixelExecutionPlan;
};

export type RuntimeResult = {
  commandId: string;
  status: RuntimeStatus;
  message: string;
  resultCode: string;
  coreTrace: CoreExecution[];
  measurements: RuntimeMeasurements;
  pixelPlan?: PixelExecutionPlan;
  flashArtifact?: FlashArtifact;
  requiresConfirmation?: boolean;
};

const riskyAction = /(take-live|payment|checkout|publish|delete|refund|leave|go-live|open-sale|xóa|đăng xuất|thanh toán|hoàn tiền|bắt đầu live)/i;
const mediaAction = /(flash|video|camera|preview|render|record|replay|output|screen|led|image|media|avatar|graphic|effect)/i;
const aiAction = /(^|[-:])(ai|suggest|auto-map|auto-fit)([-:]|$)|ai\s/i;
const eventFlashAction = /(home\.events|event-notice).*(create|publish|save|editor|notice)|event-notice-editor/i;

export function detectDeviceCapability(): DeviceCapability {
  if (typeof window === "undefined") {
    return {width: 1280, height: 720, deviceMemoryGb: 4, cpuCores: 4, networkMbps: 10, batteryLevel: 1, thermal: "cool", prefersReducedMotion: false};
  }
  const nav = navigator as Navigator & {deviceMemory?: number; connection?: {downlink?: number}};
  return {
    width: Math.max(320, window.screen?.width || window.innerWidth || 1280),
    height: Math.max(568, window.screen?.height || window.innerHeight || 720),
    deviceMemoryGb: nav.deviceMemory || 4,
    cpuCores: navigator.hardwareConcurrency || 4,
    networkMbps: nav.connection?.downlink || 10,
    batteryLevel: 1,
    thermal: "cool",
    prefersReducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false,
  };
}

export function createPixelExecutionPlan(capability: DeviceCapability, requested?: string): PixelExecutionPlan {
  const constrained = capability.thermal === "hot" || capability.networkMbps < 5 || capability.deviceMemoryGb < 4 || capability.cpuCores < 4;
  const target = constrained ? "720p" : "1080p";
  const dimensions = target === "720p" ? {width: 1280, height: 720} : {width: 1920, height: 1080};
  const wants8K = /8k/i.test(requested || "");
  const wants4K = /4k/i.test(requested || "");
  const fps: 24 | 30 | 60 = constrained ? 24 : capability.networkMbps >= 25 && capability.cpuCores >= 8 ? 60 : 30;
  const reason = [
    `${target} selected from device/network capability`,
    "ROI order: face → text → product → foreground",
    "Media Engine keeps frame timing; Flash Flow governs pixel-domain quality",
  ];
  if (constrained) reason.push("Safe profile protects thermal, battery and continuity");
  if (wants4K || wants8K) reason.push("Requested output is reconstructed locally and must be labelled Enhanced");
  return {
    version: "FPG-1.0",
    domain: "pixel",
    transportUnit: "frame",
    target,
    ...dimensions,
    pixelBudget: dimensions.width * dimensions.height,
    fps,
    bitrateKbps: target === "720p" ? 2200 : 4200,
    codecProfile: capability.cpuCores >= 8 ? "av1-efficient" : capability.cpuCores >= 6 ? "vp9-efficient" : "h264-balanced",
    roiPriority: ["face", "text", "product", "foreground"],
    tileSize: constrained ? 64 : 32,
    effectBudget: constrained ? "low" : "balanced",
    execution: capability.cpuCores >= 4 ? "local-gpu" : "local-cpu",
    fallback: constrained ? "720p-safe" : "reduce-effects",
    enhancedLabel: wants8K ? "8K Enhanced" : wants4K ? "4K Enhanced" : undefined,
    reason,
  };
}

function coreTrace(command: EventSpaceCommand, hasPixelPlan: boolean): CoreExecution[] {
  const visual = mediaAction.test(`${command.area}:${command.action}:${command.intent || ""}:${command.label}`) || eventFlashAction.test(`${command.area}:${command.action}:${command.intent || ""}`);
  const usesAI = aiAction.test(`${command.action}:${command.intent || ""}:${command.label}`);
  return [
    {core: "eventspace", operation: "Resolve event, role, object and lifecycle context", mode: "active"},
    {core: "connection", operation: "Resolve device, network, permission and adapter capability", mode: visual ? "active" : "pass-through"},
    {core: "long-ai", operation: usesAI ? "Prepare a bounded structured recommendation" : "Apply policy without a model call", mode: usesAI ? "active" : "pass-through"},
    {core: "long-scene", operation: visual ? "Resolve LSL scene, identity and ROI map" : "Preserve task context", mode: visual ? "active" : "pass-through"},
    {core: "flash-flow", operation: hasPixelPlan ? "Issue Pixel Execution Plan" : "Route the shortest approved workflow", mode: "active"},
    {core: "media", operation: visual ? "Preview/render/transport using the pixel plan" : "No media output required", mode: visual ? "active" : "pass-through"},
  ];
}

function createFlashArtifact(command: EventSpaceCommand, plan: PixelExecutionPlan): FlashArtifact {
  const signature = `${command.area}:${command.action}:${command.intent || ""}`;
  const outputPreview = /flash-flow.*output|output.*flash-flow/i.test(signature);
  const studioPreview = /flash-flow/i.test(signature);
  return {
    id: `flash-${Date.now().toString(36)}`,
    kind: outputPreview ? "flash-flow-output-preview" : studioPreview ? "flash-flow-preview" : "event-flash",
    state: "preview-ready",
    createdAt: new Date().toISOString(),
    source: command.source === "device" ? "device-assets" : "event-assets",
    title: command.label || "Event Flash",
    durationSeconds: 12,
    sceneCount: 4,
    pixelPlan: plan,
  };
}

export function executeEventSpaceCommand(command: EventSpaceCommand, capability = detectDeviceCapability()): RuntimeResult {
  const started = typeof performance !== "undefined" ? performance.now() : Date.now();
  const signature = `${command.area}:${command.action}:${command.intent || ""}:${command.label}`;
  const visual = mediaAction.test(signature) || eventFlashAction.test(signature);
  const plan = visual ? createPixelExecutionPlan(capability, signature) : undefined;
  const needsInput = /(input|name|quantity|code|url|title|width|height)/i.test(command.intent || "") && !Object.keys(command.inputs || {}).length;
  const requiresConfirmation = riskyAction.test(signature) && !command.confirmed;
  const status: RuntimeStatus = needsInput ? "needs-input" : requiresConfirmation ? "needs-confirmation" : command.receiptVerified ? "ready" : "planned";
  const isFlash = /(event.*flash|flash.*event|flash-idle|watch-flash|create-flash|flash-flow)/i.test(signature) || eventFlashAction.test(signature);
  const flashArtifact = isFlash && plan && status === "ready" ? createFlashArtifact(command, plan) : undefined;
  const outcome = String(command.inputs?.outcome || "");
  const elapsed = Math.max(1, Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - started));
  const message = status === "planned"
    ? "Kế hoạch xử lý qua sáu lõi đã được tạo; đang chờ executor và receipt xác minh."
    : status === "needs-input"
    ? "Cần bổ sung dữ liệu bắt buộc để tiếp tục."
    : status === "needs-confirmation"
      ? "Đã chuẩn bị kết quả. Cần xác nhận trước hành động quan trọng."
      : flashArtifact
        ? flashArtifact.kind === "flash-flow-output-preview"
          ? `Bản xem trước đầu ra Flash Flow đã sẵn sàng ở ${plan?.target}.`
          : flashArtifact.kind === "flash-flow-preview"
            ? `Nguồn thật đã được dựng xem trước ở ${plan?.target}.`
            : `Flash sự kiện đã sẵn sàng xem trước ở ${plan?.target}.`
        : outcome === "source-ready"
          ? "Nguồn media thật đã sẵn sàng."
          : outcome === "output-ready"
            ? "Đầu ra media đã sẵn sàng hiển thị."
            : "EventSpace đã tiếp nhận lệnh. Chưa có đầu ra để hiển thị.";
  return {
    commandId: command.id,
    status,
    message,
    resultCode: flashArtifact
      ? flashArtifact.kind === "flash-flow-output-preview" ? "OUTPUT_PREVIEW_READY" : "FLASH_PREVIEW_READY"
      : status === "ready"
        ? outcome === "source-ready" ? "SOURCE_READY" : outcome === "output-ready" ? "OUTPUT_READY" : "COMMAND_ACCEPTED"
        : status.toUpperCase().replaceAll("-", "_"),
    coreTrace: coreTrace(command, !!plan),
    pixelPlan: plan,
    flashArtifact,
    requiresConfirmation,
    measurements: {
      taskSuccess: status === "ready" ? 1 : 0,
      userActions: 1,
      automationRate: status === "ready" ? 1 : 0.75,
      latencyMs: elapsed,
      qualityScore: plan?.target === "1080p" ? 92 : plan ? 84 : 100,
      pixelEfficiency: plan ? (plan.target === "1080p" ? 0.91 : 0.96) : 1,
      costClass: aiAction.test(signature) ? "cloud-low" : "local",
    },
  };
}
