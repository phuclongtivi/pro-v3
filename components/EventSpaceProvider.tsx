"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
  executeEventSpaceCommand,
  type EventSpaceCommand,
  type RuntimeCostClass,
  type RuntimeResult,
} from "@/lib/eventspace-runtime";

type EvolutionMetric = {
  ts: number;
  area: string;
  action: string;
  result: string;
  costClass: RuntimeCostClass;
  ok: boolean;
  latencyMs?: number;
  qualityScore?: number;
  pixelEfficiency?: number;
};

type EventSpaceState = {
  generation: string;
  metrics: EvolutionMetric[];
  results: RuntimeResult[];
  lastResult: RuntimeResult | null;
  record: (metric: Omit<EvolutionMetric, "ts">) => void;
  dispatch: (command: EventSpaceCommand) => RuntimeResult;
  clearResult: () => void;
  score: {results: number; evolution: number; economy: number};
};

const Ctx = createContext<EventSpaceState | null>(null);
const METRIC_KEY = "long-eventspace-evolution-v2";
const RESULT_KEY = "long-eventspace-runtime-results-v1";

function loadList<T>(key: string, max: number): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.slice(-max) : [];
  } catch {
    return [];
  }
}

function RuntimeResultToast({result, onClose, onConfirm}: {result: RuntimeResult; onClose: () => void; onConfirm?: () => void}) {
  const plan = result.pixelPlan;
  return <aside className={`runtimeResultToast state-${result.status}`} role="status" aria-live="polite">
    <button type="button" className="runtimeToastClose" onClick={onClose} aria-label="Đóng" data-runtime-ignore="true">×</button>
    <small>EventSpace Runtime Lab · {result.resultCode}</small>
    <b>{result.message}</b>
    {plan && <span>{plan.target} · {plan.fps} FPS · {plan.codecProfile}{plan.enhancedLabel ? ` · ${plan.enhancedLabel}` : ""}</span>}
    <span>6 lõi đã liên kết · {result.coreTrace.filter(step => step.mode === "active").length} lõi thực thi · {result.measurements.costClass}</span>
    {result.status === "needs-confirmation" && onConfirm && <button type="button" className="runtimeToastConfirm" onClick={onConfirm} data-runtime-ignore="true">Xác nhận</button>}
  </aside>;
}

export function EventSpaceProvider({children}: {children: React.ReactNode}) {
  const [metrics, setMetrics] = useState<EvolutionMetric[]>(() => loadList(METRIC_KEY, 240));
  const [results, setResults] = useState<RuntimeResult[]>(() => loadList(RESULT_KEY, 80));
  const [lastResult, setLastResult] = useState<RuntimeResult | null>(null);
  const [pendingCommand, setPendingCommand] = useState<EventSpaceCommand | null>(null);

  const record = useCallback((metric: Omit<EvolutionMetric, "ts">) => {
    setMetrics(previous => {
      const next = [...previous, {...metric, ts: Date.now()}].slice(-240);
      try { localStorage.setItem(METRIC_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const dispatch = useCallback((command: EventSpaceCommand) => {
    const result = executeEventSpaceCommand(command);
    setPendingCommand(result.status === "needs-confirmation" ? command : null);
    setLastResult(result);
    setResults(previous => {
      const next = [...previous, result].slice(-80);
      try { localStorage.setItem(RESULT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    record({
      area: command.area,
      action: command.action,
      result: result.resultCode,
      costClass: result.measurements.costClass,
      ok: result.status === "ready",
      latencyMs: result.measurements.latencyMs,
      qualityScore: result.measurements.qualityScore,
      pixelEfficiency: result.measurements.pixelEfficiency,
    });
    return result;
  }, [record]);

  const confirmPending = useCallback(() => {
    if (!pendingCommand) return;
    dispatch({...pendingCommand, id: `${pendingCommand.id}:confirmed`, confirmed: true});
  }, [dispatch, pendingCommand]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button || button.disabled || button.dataset.runtimeIgnore === "true") return;
      const areaNode = button.closest<HTMLElement>("[data-runtime-area]");
      const area = button.dataset.runtimeArea || areaNode?.dataset.runtimeArea || "app";
      const action = button.dataset.runtimeAction || button.getAttribute("name") || button.id || button.textContent?.trim() || "button";
      const label = button.textContent?.trim() || action;
      const contentAction = !!button.closest(".contentSurface,.semanticWorkspace,.completionPanel,.studioWorkflowPanel,.endWorkPanel,.aiFlashWorkspace");
      // A content tool owns its result lifecycle. Generic clicks must not
      // manufacture RESULT_READY before the tool produces an artifact.
      if (contentAction) return;
      const result = dispatch({
        id: `${area}:${action}:${Date.now().toString(36)}`,
        area,
        action,
        label,
        intent: button.dataset.runtimeIntent,
        source: "ui",
        confirmed: button.dataset.runtimeConfirmed === "true",
      });
      if (contentAction) {
        button.dataset.runtimeState = result.status;
        button.classList.add("runtimeHandled");
      }
      if (!contentAction && result.status === "ready") setLastResult(null);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [dispatch]);

  const score = useMemo(() => {
    if (!metrics.length) return {results: 100, evolution: 100, economy: 100};
    const ok = metrics.filter(metric => metric.ok).length / metrics.length;
    const local = metrics.filter(metric => metric.costClass === "local").length / metrics.length;
    const diversity = new Set(metrics.map(metric => `${metric.area}:${metric.action}`)).size / Math.max(1, metrics.length);
    return {
      results: Math.round(ok * 100),
      evolution: Math.round(Math.min(1, 0.72 + diversity) * 100),
      economy: Math.round((0.72 + 0.28 * local) * 100),
    };
  }, [metrics]);

  const value = useMemo<EventSpaceState>(() => ({
    generation: "R4B4-FPG1",
    metrics,
    results,
    lastResult,
    record,
    dispatch,
    clearResult: () => {setLastResult(null); setPendingCommand(null);},
    score,
  }), [metrics, results, lastResult, record, dispatch, score]);

  return <Ctx.Provider value={value}>
    {children}
    {lastResult && <RuntimeResultToast result={lastResult} onClose={() => {setLastResult(null); setPendingCommand(null);}} onConfirm={pendingCommand ? confirmPending : undefined} />}
  </Ctx.Provider>;
}

export function useEventSpace() {
  const value = useContext(Ctx);
  if (!value) throw new Error("EventSpaceProvider missing");
  return value;
}
