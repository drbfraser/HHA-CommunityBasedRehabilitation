import { MutableRefObject, useEffect } from "react";

/*
    Temporary timing logs for measuring screen load performance (navigation speed-up work).
    Every line starts with "[PERF]"; read them with: adb logcat -s ReactNativeJS | grep PERF
*/

export const logPerf = (screen: string, step: string, startMs: number, detail?: string) => {
    const suffix = detail ? ` (${detail})` : "";
    console.log(`[PERF] ${screen} ${step}: ${Date.now() - startMs} ms${suffix}`);
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
