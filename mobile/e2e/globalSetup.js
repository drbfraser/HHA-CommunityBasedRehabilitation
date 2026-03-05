const { execSync, spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function findEmulatorBin() {
    const candidates = [
        process.env.ANDROID_HOME,
        process.env.ANDROID_SDK_ROOT,
        path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk"),
    ];
    for (const sdk of candidates) {
        if (!sdk) continue;
        const bin = path.join(sdk, "emulator", "emulator.exe");
        if (fs.existsSync(bin)) return `"${bin}"`;
    }
    return "emulator";
}

function prewarmBundle() {
    const BUNDLE_URL =
        "http://localhost:8081/.expo/.virtual-metro-entry.bundle" +
        "?platform=android&dev=true&lazy=true&minify=false" +
        "&app=org.hopehealthaction.cbrapp" +
        "&modulesOnly=false&runModule=true" +
        "&excludeSource=true&sourcePaths=url-server";
    const TIMEOUT = 300000;
    const RETRY_INTERVAL = 3000;
    const MAX_500_RETRIES = 3;

    return new Promise((resolve, reject) => {
        const deadline = Date.now() + TIMEOUT;
        let consecutive500s = 0;

        function attempt() {
            if (Date.now() > deadline) {
                return reject(new Error("[globalSetup] Metro bundle pre-warm timed out."));
            }

            const req = http.get(BUNDLE_URL, (res) => {
                const chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                res.on("end", () => {
                    const body = Buffer.concat(chunks);
                    if (res.statusCode === 200) {
                        console.log(
                            `[globalSetup] Metro bundle pre-warmed (${(
                                body.length /
                                1024 /
                                1024
                            ).toFixed(1)} MB).`
                        );
                        resolve();
                    } else if (res.statusCode === 500) {
                        consecutive500s++;
                        const errText = body.toString("utf8").slice(0, 2000);
                        console.error(
                            `[globalSetup] Metro compile error (attempt ${consecutive500s}/${MAX_500_RETRIES}):\n${errText}`
                        );
                        if (consecutive500s >= MAX_500_RETRIES) {
                            return reject(
                                new Error(
                                    "[globalSetup] Metro bundle has a compilation error — fix the import above and retry."
                                )
                            );
                        }
                        setTimeout(attempt, RETRY_INTERVAL);
                    } else {
                        consecutive500s = 0;
                        console.warn(
                            `[globalSetup] Metro returned status ${res.statusCode}, retrying...`
                        );
                        setTimeout(attempt, RETRY_INTERVAL);
                    }
                });
            });
            req.on("error", () => {
                consecutive500s = 0;
                setTimeout(attempt, RETRY_INTERVAL);
            });
            req.setTimeout(TIMEOUT, () => {
                req.destroy();
                setTimeout(attempt, RETRY_INTERVAL);
            });
        }

        attempt();
    });
}

function safeShell(cmd) {
    try {
        execSync(`adb shell ${cmd}`, { timeout: 10000 });
    } catch (e) {
        console.warn(`  adb shell "${cmd}" failed: ${e.message}`);
    }
}

module.exports = async function () {
    const avdName = process.env.DETOX_AVD_NAME || "Medium_Phone_API_36.1";

    let alreadyRunning = false;
    try {
        const devices = execSync("adb devices", { timeout: 5000 }).toString();
        alreadyRunning = /emulator-\d+\s+device/.test(devices);
    } catch (_) {}

    if (!alreadyRunning) {
        console.log(`[globalSetup] Starting emulator: ${avdName}`);
        const emulatorBin = findEmulatorBin();
        console.log(`[globalSetup] Using emulator binary: ${emulatorBin}`);
        spawn(
            emulatorBin,
            [`@${avdName}`, "-no-audio", "-no-boot-anim", "-gpu", "swiftshader_indirect"],
            {
                detached: true,
                stdio: "ignore",
                shell: true,
            }
        ).unref();
    } else {
        console.log("[globalSetup] Emulator already running — reusing.");
    }

    console.log("[globalSetup] Waiting for boot_completed...");
    const bootStart = Date.now();
    const bootTimeout = 180000;
    while (Date.now() - bootStart < bootTimeout) {
        try {
            const out = execSync("adb shell getprop sys.boot_completed", {
                timeout: 5000,
            })
                .toString()
                .trim();
            if (out === "1") {
                console.log("[globalSetup] boot_completed = 1");
                break;
            }
        } catch (_) {}
        await sleep(3000);
    }

    console.log("[globalSetup] Waiting for System UI...");
    const uiStart = Date.now();
    const uiTimeout = 60000;
    while (Date.now() - uiStart < uiTimeout) {
        try {
            const out = execSync(
                'adb shell "dumpsys activity services com.android.systemui/.SystemUIService"',
                { timeout: 5000 }
            ).toString();
            if (out.includes("ServiceRecord") || out.includes("app=ProcessRecord")) {
                console.log("[globalSetup] System UI is running.");
                break;
            }
        } catch (_) {}
        await sleep(2000);
    }
    await sleep(2000);

    console.log("[globalSetup] Dismissing ANR dialogs...");
    safeShell("am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS");
    safeShell("input keyevent KEYCODE_ENTER");
    safeShell("input keyevent KEYCODE_DPAD_RIGHT");
    safeShell("input keyevent KEYCODE_ENTER");
    await sleep(1000);

    console.log("[globalSetup] Configuring device settings...");
    safeShell("input keyevent KEYCODE_WAKEUP");
    safeShell("settings put global stay_on_while_plugged_in 3");
    safeShell("input keyevent KEYCODE_MENU");
    safeShell("wm dismiss-keyguard");
    safeShell("input keyevent KEYCODE_BACK");
    safeShell("am start -a android.intent.action.MAIN -c android.intent.category.HOME");
    await sleep(1000);

    safeShell("am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS");
    safeShell("settings put global background_activity_starts_enabled 1");
    safeShell("settings put global hidden_api_policy 1");
    safeShell("settings put global window_animation_scale 0");
    safeShell("settings put global transition_animation_scale 0");
    safeShell("settings put global animator_duration_scale 0");
    safeShell("settings put secure stylus_handwriting_enabled 0");
    safeShell("settings put secure show_stylus_pointer_icon 0");
    safeShell("settings put secure anr_show_background 0");

    try {
        execSync("adb reverse tcp:8000 tcp:8000", { timeout: 5000 });
        console.log("[globalSetup] adb reverse tcp:8000 (Django API) OK.");
    } catch (e) {
        console.warn("[globalSetup] adb reverse tcp:8000 failed:", e.message);
    }

    try {
        const e2eEnvPath = path.resolve(__dirname, "..", ".env.e2e");
        const dotenvPath = path.resolve(__dirname, "..", ".env");
        if (fs.existsSync(e2eEnvPath)) {
            const APP_KEYS = ["APP_ENV", "LOCAL_URL"];
            const lines = fs.readFileSync(e2eEnvPath, "utf8").split(/\r?\n/);
            const appLines = lines.filter((l) => APP_KEYS.some((k) => l.startsWith(k + "=")));
            if (appLines.length) {
                fs.writeFileSync(dotenvPath, appLines.join("\n") + "\n");
                console.log(`[globalSetup] Wrote .env from .env.e2e: ${appLines.join(", ")}`);
            }
        }
    } catch (e) {
        console.warn("[globalSetup] Failed to generate .env:", e.message);
    }

    console.log("[globalSetup] Warming up Django API...");
    try {
        await new Promise((resolve) => {
            const warmReq = http.get("http://localhost:8000/api/", (res) => {
                res.resume();
                res.on("end", resolve);
            });
            warmReq.on("error", resolve);
            warmReq.setTimeout(15000, () => {
                warmReq.destroy();
                resolve();
            });
        });
        console.log("[globalSetup] Django warm-up done.");
    } catch (_) {}

    console.log("[globalSetup] Emulator ready — pre-warming Metro bundle...");

    try {
        await prewarmBundle();
    } catch (err) {
        console.warn("[globalSetup] Bundle pre-warm failed:", err.message);
        console.warn("  Tests will proceed but app launch may be slow.");
    }

    console.log("[globalSetup] Handing off to Detox.");

    await require("detox/runners/jest/globalSetup")();
};
