const { device, element, by, expect } = require("detox");
const { execSync } = require("child_process");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

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
        if (!E2E_USERNAME || !E2E_PASSWORD) {
            throw new Error(
                "E2E credentials not set. Please set E2E_USERNAME and E2E_PASSWORD environment variables in .env.e2e"
            );
        }

        await element(by.id("login-username-input")).replaceText(E2E_USERNAME);
        await element(by.id("login-password-input")).replaceText(E2E_PASSWORD);

        await element(by.id("login-button")).tap();

        await waitFor(element(by.id("login-button")))
            .not.toBeVisible()
            .withTimeout(60000);
    });
});
