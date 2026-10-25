import { MutableRefObject, useEffect } from "react";

/*
    Temporary timing logs for measuring screen load performance (navigation speed-up work).
    Every line starts with "[PERF]"; read them with: adb logcat -s ReactNativeJS | grep PERF
*/

export const logPerf = (screen: string, step: string, startMs: number, detail?: string) => {
    const suffix = detail ? ` (${detail})` : "";
    console.log(`[PERF] ${screen} ${step}: ${Date.now() - startMs} ms${suffix}`);
};

const renderCounts: Record<string, number> = {};
let renderLogTimer: ReturnType<typeof setInterval> | null = null;

/*
    Call at the top of a component's render. Every 2 s, logs how many times each counted component
    rendered in that period (only components that rendered), to spot render loops and unexpected
    re-renders of hidden screens.
*/
export const countRender = (component: string) => {
    renderCounts[component] = (renderCounts[component] ?? 0) + 1;
    if (!renderLogTimer) {
        renderLogTimer = setInterval(() => {
            const counted = Object.entries(renderCounts).filter(([, count]) => count > 0);
            if (counted.length > 0) {
                const summary = counted.map(([name, count]) => `${name}=${count}`).join(" ");
                console.log(`[PERF] renders in last 2 s: ${summary}`);
                counted.forEach(([name]) => (renderCounts[name] = 0));
            }
        }, 2000);
    }
};

export type RenderTiming = { loadStart: number; renderStart: number };

/*
    Call after setting state with the loaded data: logs how long React took to commit the update
    ("render") and when the next frame ran ("frame"), both from renderStart, plus the total since
    loadStart. The ref is cleared so later re-renders are not logged.
*/
export const useLogRenderTiming = (
    screen: string,
    timingRef: MutableRefObject<RenderTiming | null>,
    deps: unknown[]
) => {
    useEffect(() => {
        const timing = timingRef.current;
        if (!timing) {
            return;
        }
        timingRef.current = null;
        logPerf(screen, "render", timing.renderStart);
        requestAnimationFrame(() => {
            logPerf(screen, "frame", timing.renderStart);
            logPerf(screen, "total", timing.loadStart);
        });
    }, deps);
};
