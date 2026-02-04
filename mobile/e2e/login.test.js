const { device, element, by, expect } = require("detox");

/**
 * E2E test credentials are loaded from environment variables.
 * Set E2E_USERNAME and E2E_PASSWORD before running tests.
 *
 * Run Example:
 *  npx detox test -c android.emu.debug
 */
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

describe("Login", () => {
    beforeAll(async () => {
        await device.launchApp({ newInstance: true });
    });

    beforeEach(async () => {
        await device.reloadReactNative();
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

        await element(by.id("login-username-input")).tap();
        await element(by.id("login-username-input")).typeText(E2E_USERNAME);

        await element(by.id("login-password-input")).tap();
        await element(by.id("login-password-input")).typeText(E2E_PASSWORD);

        await device.pressBack();

        await element(by.id("login-button")).tap();

        await waitFor(element(by.id("login-button")))
            .not.toBeVisible()
            .withTimeout(15000);
    });
});
