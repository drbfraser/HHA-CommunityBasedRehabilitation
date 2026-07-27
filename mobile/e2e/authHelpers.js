const { element, by, waitFor } = require("detox");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

const AUTH_SCREEN_IDS = ["login-button"];
const HOME_TAB_ID = "tab-dashboard";

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

async function waitForHomeScreen(timeout = 60000) {
    try {
        await waitFor(element(by.id(HOME_TAB_ID)))
            .toBeVisible()
            .withTimeout(timeout);
    } catch {
        throw new Error(
            `App did not reach the home screen: expected ${HOME_TAB_ID} to be visible after launch/login`
        );
    }
}

/**
 * Wait until the app reaches the dashboard after login.
 */
async function waitUntilUnlocked(timeout = 30000) {
    await waitForHomeScreen(timeout);
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
async function ensureAppUnlocked({ requireHome = false, timeout = 60000 } = {}) {
    if (!(await isOnBlockingAuthScreen())) {
        if (requireHome) {
            await waitForHomeScreen(timeout);
        }
        return;
    }

    if (await isElementVisible("login-button", 2000)) {
        await loginAndUnlockApp();
        if (requireHome) {
            await waitForHomeScreen(timeout);
        }
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
    waitForHomeScreen,
    isOnBlockingAuthScreen,
};
