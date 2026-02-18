const { device, element, by, expect } = require("detox");

/**
 * E2E test credentials are loaded from .env.e2e
 */
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

describe("Login", () => {
    beforeAll(async () => {
        await device.launchApp({ newInstance: true });
        // wait for the app to finish bundling and render the login screen
        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(120000);
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
        await element(by.id("login-username-input")).replaceText(E2E_USERNAME);
        await element(by.id("login-username-input")).tapReturnKey();

        await element(by.id("login-password-input")).tap();
        await element(by.id("login-password-input")).replaceText(E2E_PASSWORD);
        await element(by.id("login-password-input")).tapReturnKey();

        await waitFor(element(by.id("login-button")))
            .not.toBeVisible()
            .withTimeout(30000);
    });
});
