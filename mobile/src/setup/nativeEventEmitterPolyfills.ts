// Ensure all NativeModules used with NativeEventEmitter expose addListener/removeListeners
// Some third-party modules on RN 0.79+ emit warnings otherwise.
try {
    // Using require to avoid any ESM interop surprises in Metro
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { NativeModules } = require("react-native");
    if (NativeModules && typeof NativeModules === "object") {
        Object.keys(NativeModules).forEach((k) => {
            const mod = (NativeModules as any)[k];
            if (mod && typeof mod === "object") {
                if (typeof mod.addListener !== "function") {
                    mod.addListener = () => {};
                }
                if (typeof mod.removeListeners !== "function") {
                    mod.removeListeners = () => {};
                }
            }
        });
    }
} catch (_) {
    // Best-effort; ignore if NativeModules is unavailable in this context
}

