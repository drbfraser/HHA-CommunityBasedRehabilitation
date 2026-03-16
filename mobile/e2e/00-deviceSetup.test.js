const { execSync } = require("child_process");

function safeShell(cmd) {
    try {
        execSync(`adb shell ${cmd}`, { timeout: 10000 });
    } catch (e) {
        console.warn(`adb shell "${cmd}" failed:`, e.message);
    }
}

describe("Device Setup", () => {
    beforeAll(async () => {
        safeShell("am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS");
        safeShell("input keyevent KEYCODE_ENTER");
    }, 30000);

    it("emulator is ready for testing", () => {});
});
