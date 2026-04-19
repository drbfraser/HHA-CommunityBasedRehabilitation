const { execSync } = require("child_process");

module.exports = async function () {
    await require("detox/runners/jest/globalSetup")();

    // Disable all system-level animations on the emulator to prevent
    // "connectAnimatedNodes: Animated node with tag (parent) does not exist" crash.
    // See: https://github.com/facebook/react-native/issues/33375
    const cmds = [
        "adb shell settings put global window_animation_scale 0",
        "adb shell settings put global transition_animation_scale 0",
        "adb shell settings put global animator_duration_scale 0",
    ];
    for (const cmd of cmds) {
        try {
            execSync(cmd, { timeout: 10000 });
        } catch (_) {}
    }
};
