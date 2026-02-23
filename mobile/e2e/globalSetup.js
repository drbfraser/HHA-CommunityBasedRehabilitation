const { execSync } = require("child_process");

/**
 * wait until the Android device has fully booted (sys.boot_completed=1).
 * Default timeout increased to 240000ms (4min). Override with DETOX_BOOT_TIMEOUT_MS (ms).
 */
function waitForBoot(timeoutMs = Number(process.env.DETOX_BOOT_TIMEOUT_MS) || 240000) {
    const start = Date.now();
    console.log(`adb wait-for-device (timeout=${timeoutMs}ms)`);
    execSync("adb wait-for-device", { timeout: timeoutMs });

    const perAttemptTimeout = 8000; // timeout for individual adb shell getprop calls
    const pauseSeconds = 2; // pause between retries

    while (Date.now() - start < timeoutMs) {
        try {
            const result = execSync("adb shell getprop sys.boot_completed", {
                timeout: perAttemptTimeout,
            })
                .toString()
                .trim();
            if (result === "1") {
                console.log(`Emulator booted in ${(Date.now() - start) / 1000}s`);
                return;
            }
        } catch (e) {
            // device may not be ready to accept shell commands yet — swallow and retry
        }
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, pauseSeconds * 1000); // ~2 s pause
    }
    throw new Error(`Device did not finish booting within ${timeoutMs / 1000}s`);
}

module.exports = async function () {
    // run Detox's default global setup (boots the emulator if needed)
    await require("detox/runners/jest/globalSetup")();

    // wait for the emulator to be fully booted, not just visible to ADB
    try {
        console.log("Waiting for emulator to fully boot...");
        waitForBoot();
        console.log("Emulator booted.");

        // dismiss the Recents / "no recent items" screen so the launcher is active
        execSync("adb shell input keyevent KEYCODE_HOME");

        // disable animations to reduce flakiness and GPU load
        execSync("adb shell settings put global window_animation_scale 0");
        execSync("adb shell settings put global transition_animation_scale 0");
        execSync("adb shell settings put global animator_duration_scale 0");

        // disable stylus features that can interfere with taps
        execSync("adb shell settings put secure stylus_handwriting_enabled 0");
        execSync("adb shell settings put secure show_stylus_pointer_icon 0");

        execSync("adb shell settings put secure anr_show_background 0");

        console.log("Emulator prepped: animations disabled, stylus disabled, ANR dialog hidden");
    } catch (e) {
        console.warn("Warning: Failed to prep emulator:", e.message);
    }
};
