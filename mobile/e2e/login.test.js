const { device, element, by, expect } = require("detox");
const { execSync } = require("child_process");
const {
    loginAndUnlockApp,
    loginWithCredentials,
    completePinSetupIfNeeded,
} = require("./authHelpers");

describe("Login", () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            delete: true,
            launchArgs: { detoxEnableSynchronization: 0, detoxAnrWaitTimeout: 0 },
        });

        for (let i = 0; i < 5; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            try {
                execSync("adb shell input keyevent KEYCODE_ESCAPE", { timeout: 5000 });
            } catch (e) {}
        }

        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(60000);
    });

    it("should show login screen on app launch", async () => {
        await expect(element(by.id("login-username-input"))).toBeVisible();
        await expect(element(by.id("login-password-input"))).toBeVisible();
        await expect(element(by.id("login-button"))).toBeVisible();
    });

    it("should login successfully with valid credentials", async () => {
        await loginWithCredentials();

        await waitFor(element(by.id("pin-setup-new")))
            .toBeVisible()
            .withTimeout(30000);
    });

    it("should complete PIN setup and reach the dashboard", async () => {
        await completePinSetupIfNeeded(30000, true);

        await waitFor(element(by.id("tab-dashboard")))
            .toBeVisible()
            .withTimeout(30000);
    });
});

describe("Login (fresh session)", () => {
    it("should login, set PIN, and reach the dashboard in one flow", async () => {
        await device.launchApp({
            newInstance: true,
            delete: true,
            launchArgs: { detoxEnableSynchronization: 0, detoxAnrWaitTimeout: 0 },
        });

        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(120000);

        await loginAndUnlockApp();

        await waitFor(element(by.id("tab-dashboard")))
            .toBeVisible()
            .withTimeout(30000);
    });
});
