const { execSync } = require("child_process");

function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * wait until the Android device has fully booted (sys.boot_completed=1).
 * Default timeout increased to 360000ms (6min). Override with DETOX_BOOT_TIMEOUT_MS (ms).
 */
function waitForBoot(timeoutMs = Number(process.env.DETOX_BOOT_TIMEOUT_MS) || 360000) {
    const start = Date.now();
    console.log(`Waiting for emulator to boot (timeout=${timeoutMs / 1000}s)...`);

    const perAttemptTimeout = 5000;
    const pauseSeconds = 3;

    while (Date.now() - start < timeoutMs) {
        try {
            const result = execSync("adb shell getprop sys.boot_completed", {
                timeout: perAttemptTimeout,
            })
                .toString()
                .trim();
            if (result === "1") {
                console.log(
                    `Boot complete in ${((Date.now() - start) / 1000).toFixed(
                        1
                    )}s. Waiting for launcher...`
                );
                // give the launcher extra time to finish initializing after boot_completed
                sleep(5000);
                return;
            }
        } catch (e) {
            // device not yet visible to ADB or not ready — swallow and retry
        }
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, pauseSeconds * 1000);
    }
    throw new Error(`Device did not finish booting within ${timeoutMs / 1000}s`);
}

function dismissRecentsScreen() {
    // Press HOME twice with a pause — first press dismisses Recents, second confirms we're on the launcher
    execSync("adb shell input keyevent KEYCODE_HOME");
    sleep(1500);
    execSync("adb shell input keyevent KEYCODE_HOME");
    sleep(1000);
    console.log("Dismissed Recents screen.");
}

module.exports = async function () {
    // run Detox's default global setup (boots the emulator if needed)
    await require("detox/runners/jest/globalSetup")();

    // wait for the emulator to be fully booted — this MUST succeed before tests run
    console.log("Waiting for emulator to fully boot...");
    waitForBoot(); // throws if it times out, which will fail globalSetup and abort the run
    console.log("Emulator booted.");

    // optional prep — failures here are non-fatal
    try {
        dismissRecentsScreen();

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
        console.warn("Warning: Failed to prep emulator (non-fatal):", e.message);
    }
};
