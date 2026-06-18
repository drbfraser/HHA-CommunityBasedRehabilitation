const { element, by, waitFor } = require("detox");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

const AUTH_SCREEN_IDS = ["login-button"];

function assertE2eCredentials() {
    if (!E2E_USERNAME || !E2E_PASSWORD) {
        throw new Error(
            "E2E credentials not configured. Add E2E_USERNAME and E2E_PASSWORD to mobile/.env.e2e"
        );
    }
}

async function isElementVisible(testId, timeout = 500) {
    try {
        await waitFor(element(by.id(testId)))
            .toBeVisible()
            .withTimeout(timeout);
        return true;
    } catch {
        return false;
    }
}

/**
 * True when the login screen is showing.
 */
async function isOnBlockingAuthScreen() {
    for (const testId of AUTH_SCREEN_IDS) {
        if (await isElementVisible(testId, 500)) {
            return true;
        }
    }
    return false;
}

/**
 * Wait until no auth gate is blocking the app. Prefers seeing the dashboard
 * tab after login; on stack screens (e.g. Sync) tabs may be hidden, so we
 * also accept "no blocking auth screen visible".
 */
async function waitUntilUnlocked(timeout = 30000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        try {
            await waitFor(element(by.id("tab-dashboard")))
                .toBeVisible()
                .withTimeout(1000);
            return;
        } catch {}

        if (!(await isOnBlockingAuthScreen())) {
            return;
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error("Timed out waiting for app to unlock (still on login screen)");
}

/**
 * Fill login form and submit.
 */
async function loginWithCredentials() {
    assertE2eCredentials();

    // "Log in again" screen hides the username field; only password is required.
    if (await isElementVisible("login-username-input", 2000)) {
        await element(by.id("login-username-input")).tap();
        await element(by.id("login-username-input")).replaceText(E2E_USERNAME);
        await element(by.id("login-username-input")).tapReturnKey();
    }

    await element(by.id("login-password-input")).tap();
    await element(by.id("login-password-input")).replaceText(E2E_PASSWORD);
    await element(by.id("login-password-input")).tapReturnKey();

    await new Promise((r) => setTimeout(r, 1000));

    try {
        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(3000);
        await element(by.id("login-button")).tap();
    } catch {}

    await waitFor(element(by.id("login-button")))
        .not.toBeVisible()
        .withTimeout(30000);
}

/**
 * Log in with credentials and wait until the app is accessible.
 */
async function loginAndUnlockApp() {
    if (!(await isOnBlockingAuthScreen())) {
        return;
    }

    if (await isElementVisible("login-button", 2000)) {
        await loginWithCredentials();
    }

    await waitUntilUnlocked(120000);
}

/**
 * Recover from the login screen. Safe to call when already on stack screens
 * (e.g. Sync) where the tab bar is not visible.
 */
async function ensureAppUnlocked() {
    if (!(await isOnBlockingAuthScreen())) {
        return;
    }

    if (await isElementVisible("login-button", 2000)) {
        await loginAndUnlockApp();
        return;
    }

    if (await isOnBlockingAuthScreen()) {
        throw new Error("App is still on a login screen after recovery attempts");
    }
}

module.exports = {
    loginWithCredentials,
    loginAndUnlockApp,
    ensureAppUnlocked,
    waitUntilUnlocked,
    isOnBlockingAuthScreen,
};
