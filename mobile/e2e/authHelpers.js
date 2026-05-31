const { element, by, waitFor } = require("detox");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
const E2E_PIN = process.env.E2E_PIN || "1234";

const AUTH_SCREEN_IDS = ["pin-entry-input", "pin-setup-new", "login-button"];

function assertE2eCredentials() {
    if (!E2E_USERNAME || !E2E_PASSWORD) {
        throw new Error(
            "E2E credentials not configured. Add E2E_USERNAME and E2E_PASSWORD to mobile/.env.e2e"
        );
    }
}

function assertE2ePin() {
    if (!/^\d{4,6}$/.test(E2E_PIN)) {
        throw new Error(
            "E2E_PIN must be 4-6 digits. Set E2E_PIN in mobile/.env.e2e (default is 1234)."
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
 * True when login, PIN setup, or PIN entry is showing.
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
 * Wait until no auth/PIN gate is blocking the app. Does not require the tab bar
 * (e.g. Sync is a stack screen where tabs are hidden).
 */
async function waitUntilUnlocked(timeout = 30000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        if (!(await isOnBlockingAuthScreen())) {
            return;
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error("Timed out waiting for app to unlock (still on login/PIN screen)");
}

/**
 * Fill login form and submit. Does not handle PIN setup or PIN entry.
 */
async function loginWithCredentials() {
    assertE2eCredentials();

    await element(by.id("login-username-input")).tap();
    await element(by.id("login-username-input")).replaceText(E2E_USERNAME);
    await element(by.id("login-username-input")).tapReturnKey();

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
 * Complete first-time PIN setup when the PinSetup screen is shown.
 * @returns {Promise<boolean>} true if setup was performed
 */
async function completePinSetupIfNeeded(timeout = 15000) {
    try {
        await waitFor(element(by.id("pin-setup-new")))
            .toBeVisible()
            .withTimeout(timeout);
    } catch {
        return false;
    }

    assertE2ePin();

    await element(by.id("pin-setup-new")).tap();
    await element(by.id("pin-setup-new")).replaceText(E2E_PIN);
    await element(by.id("pin-setup-confirm")).tap();
    await element(by.id("pin-setup-confirm")).replaceText(E2E_PIN);
    await element(by.id("pin-setup-submit")).tap();

    await waitUntilUnlocked(30000);
    return true;
}

/**
 * Enter PIN when the app is locked (PinEntry screen).
 * @returns {Promise<boolean>} true if PIN entry was performed
 */
async function enterPinIfLocked(timeout = 15000) {
    try {
        await waitFor(element(by.id("pin-entry-input")))
            .toBeVisible()
            .withTimeout(timeout);
    } catch {
        return false;
    }

    assertE2ePin();

    await element(by.id("pin-entry-input")).tap();
    await element(by.id("pin-entry-input")).replaceText(E2E_PIN);
    await element(by.id("pin-entry-submit")).tap();

    await waitUntilUnlocked(30000);
    return true;
}

/**
 * Log in with credentials, then complete PIN setup or PIN entry as needed.
 */
async function loginAndUnlockApp() {
    await loginWithCredentials();
    const didSetup = await completePinSetupIfNeeded();
    if (!didSetup) {
        await enterPinIfLocked(10000);
    }
    await waitUntilUnlocked(30000);
}

/**
 * Recover from login, PIN setup, or PIN lock. Safe to call when already on
 * stack screens (e.g. Sync) where the tab bar is not visible.
 */
async function ensureAppUnlocked() {
    if (await enterPinIfLocked(15000)) {
        return;
    }
    if (await completePinSetupIfNeeded(10000)) {
        return;
    }

    try {
        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(3000);
        await loginAndUnlockApp();
        return;
    } catch {}

    if (await isOnBlockingAuthScreen()) {
        if (await enterPinIfLocked(15000)) {
            return;
        }
        throw new Error("App is still on a login/PIN screen after recovery attempts");
    }
}

module.exports = {
    E2E_PIN,
    loginWithCredentials,
    completePinSetupIfNeeded,
    enterPinIfLocked,
    loginAndUnlockApp,
    ensureAppUnlocked,
    waitUntilUnlocked,
    isOnBlockingAuthScreen,
};
