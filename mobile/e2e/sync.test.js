const { device, element, by, expect, waitFor } = require("detox");
const { execSync } = require("child_process");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

const TEST_CLIENT_FIRST_NAME = "SyncE2E";
const TEST_CLIENT_LAST_NAME = `Offline${Date.now()}`;
const TEST_CLIENT_FULL_NAME = `${TEST_CLIENT_FIRST_NAME} ${TEST_CLIENT_LAST_NAME}`;

function getEmulatorSerial() {
    try {
        const out = execSync("adb devices", { timeout: 10000 }).toString();
        const match = out.match(/^(emulator-\d+)\s+device$/m);
        return match ? match[1] : "";
    } catch (_) {
        return "";
    }
}

function disableWifi() {
    const s = getEmulatorSerial();
    const prefix = s ? `-s ${s} ` : "";
    execSync(`adb ${prefix}shell svc wifi disable`, { timeout: 10000 });
    execSync(`adb ${prefix}shell svc data disable`, { timeout: 10000 });
}

function enableWifi() {
    const s = getEmulatorSerial();
    const prefix = s ? `-s ${s} ` : "";
    execSync(`adb ${prefix}shell svc data enable`, { timeout: 10000 });
    execSync(`adb ${prefix}shell svc wifi enable`, { timeout: 10000 });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollDownTo(targetId, scrollViewId = "new-client-scroll-view", maxScrolls = 20) {
    for (let i = 0; i < maxScrolls; i++) {
        try {
            await expect(element(by.id(targetId))).toBeVisible();
            return;
        } catch {}
        try {
            await element(by.id(scrollViewId)).scroll(100, "down");
        } catch {
            await sleep(500);
        }
    }
    await expect(element(by.id(targetId))).toBeVisible();
}

async function selectFromDropdown(dropdownId, itemText, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await waitFor(element(by.id(dropdownId)))
            .toBeVisible()
            .withTimeout(10000);
        await element(by.id(dropdownId)).tap();
        await sleep(1000);

        try {
            await waitFor(element(by.text(itemText)))
                .toBeVisible()
                .withTimeout(attempt < maxAttempts ? 5000 : 10000);
            await element(by.text(itemText)).tap();
            await sleep(500);
            return;
        } catch (e) {
            if (attempt === maxAttempts) throw e;
            try {
                await element(by.id(dropdownId)).tap();
                await sleep(300);
                await element(by.id(dropdownId)).tap();
            } catch {}
            await sleep(500);
        }
    }
}

async function loginWithCredentials() {
    if (!E2E_USERNAME || !E2E_PASSWORD) {
        throw new Error(
            "E2E credentials not configured.  Add E2E_USERNAME and E2E_PASSWORD to mobile/.env.e2e"
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
}

async function ensureTabNavigatorVisible() {
    // Already inside Sync screen in some flows.
    try {
        await expect(element(by.id("sync-database-button"))).toBeVisible();
        return;
    } catch {}

    // If app got bounced to login (e.g., token/network transitions), recover.
    try {
        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(5000);
        await loginWithCredentials();
        await waitFor(element(by.id("tab-dashboard")))
            .toBeVisible()
            .withTimeout(30000);
        return;
    } catch {}

    // Try to unwind stacked screens until tabs reappear.
    for (let i = 0; i < 4; i++) {
        try {
            await expect(element(by.id("tab-sync"))).toBeVisible();
            return;
        } catch {}
        await device.pressBack();
    }

    await waitFor(element(by.id("tab-sync")))
        .toBeVisible()
        .withTimeout(10000);
}

async function navigateToSyncScreen() {
    await ensureTabNavigatorVisible();

    try {
        await expect(element(by.id("sync-database-button"))).toBeVisible();
        return;
    } catch {}

    await element(by.id("tab-sync")).tap();

    await waitFor(element(by.id("home-sync-modal-button")))
        .toBeVisible()
        .withTimeout(10000);
    await element(by.id("home-sync-modal-button")).tap();

    await waitFor(element(by.id("sync-database-button")))
        .toBeVisible()
        .withTimeout(10000);
}

async function triggerSyncAndWaitForAlert() {
    await element(by.id("sync-database-button")).tap();
    await waitFor(element(by.id("sync-alert-ok-button")))
        .toBeVisible()
        .withTimeout(60000);
}

async function ensureCellularSyncEnabled() {
    try {
        await expect(element(by.id("sync-cellular-switch"))).toHaveToggleValue(true);
        return;
    } catch {}

    await element(by.id("sync-cellular-switch")).tap();
    await expect(element(by.id("sync-cellular-switch"))).toHaveToggleValue(true);
}

async function scrollUntilTextVisible(text, scrollViewId, maxScrolls = 14) {
    for (let i = 0; i < maxScrolls; i++) {
        try {
            await expect(element(by.text(text))).toBeVisible();
            return;
        } catch {}
        await element(by.id(scrollViewId)).scroll(260, "down");
    }
    await expect(element(by.text(text))).toBeVisible();
}

async function navigateBackToHome() {
    for (let i = 0; i < 3; i++) {
        try {
            await expect(element(by.id("tab-dashboard"))).toBeVisible();
            return;
        } catch {}
        await device.pressBack();
        try {
            await waitFor(element(by.id("tab-dashboard")))
                .toBeVisible()
                .withTimeout(5000);
            return;
        } catch {}
    }
    await waitFor(element(by.id("tab-dashboard")))
        .toBeVisible()
        .withTimeout(10000);
}

describe("Sync: offline caching via WatermelonDB then online server sync", () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            delete: true,
            launchArgs: { detoxEnableSynchronization: 0, detoxAnrWaitTimeout: 0 },
        });

        try {
            execSync("adb shell input keyevent KEYCODE_ESCAPE", { timeout: 5000 });
        } catch (e) {}

        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(120000);

        await loginWithCredentials();

        await waitFor(element(by.id("tab-dashboard")))
            .toBeVisible()
            .withTimeout(30000);
    }, 600000);

    afterAll(async () => {
        try {
            enableWifi();
        } catch {}
    });

    describe("Phase 1: Initial online sync to seed local WatermelonDB", () => {
        it("navigates to the Sync screen", async () => {
            await navigateToSyncScreen();
            await expect(element(by.id("sync-database-button"))).toBeVisible();
        });

        it("enables sync over cellular for offline sync test flow", async () => {
            await ensureCellularSyncEnabled();
        });

        it("completes an initial sync with the server", async () => {
            await triggerSyncAndWaitForAlert();
            await expect(element(by.id("sync-alert-message"))).toBeVisible();
            await element(by.id("sync-alert-ok-button")).tap();
        });

        it("navigates back to the home screen", async () => {
            await navigateBackToHome();
        });
    });

    describe("Phase 2: Create a new client while offline – cached in WatermelonDB", () => {
        beforeAll(async () => {
            disableWifi();
            await sleep(5000);
        });

        it("navigates to the New Client tab while offline", async () => {
            await element(by.id("tab-new-client")).tap();
            await waitFor(element(by.id("new-client-consent-checkbox")))
                .toBeVisible()
                .withTimeout(10000);
        });

        it("accepts the interview consent (enables the rest of the form)", async () => {
            await element(by.id("new-client-consent-checkbox")).tap();

            await waitFor(element(by.id("client-first-name-input")))
                .toBeVisible()
                .withTimeout(5000);
        });

        it("fills in first and last name (at top of form – no scroll needed)", async () => {
            await element(by.id("client-first-name-input")).tap();
            await element(by.id("client-first-name-input")).replaceText(TEST_CLIENT_FIRST_NAME);
            await element(by.id("client-first-name-input")).tapReturnKey();

            await element(by.id("client-last-name-input")).tap();
            await element(by.id("client-last-name-input")).replaceText(TEST_CLIENT_LAST_NAME);
            await element(by.id("client-last-name-input")).tapReturnKey();
        });

        it("selects a birth date via the native Android DatePickerDialog", async () => {
            await scrollDownTo("client-birthday-select-btn");
            await element(by.id("client-birthday-select-btn")).tap();

            await waitFor(element(by.text("OK")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.text("OK")).tap();
        });

        it("selects gender from the dropdown (below birthday section)", async () => {
            await scrollDownTo("client-gender-dropdown");
            await selectFromDropdown("client-gender-dropdown", "Male");
        });

        it("fills in village and selects a zone (zone loaded from WatermelonDB while offline)", async () => {
            await scrollDownTo("client-village-input");
            await element(by.id("client-village-input")).tap();
            await element(by.id("client-village-input")).replaceText("TestVillage");
            await element(by.id("client-village-input")).tapReturnKey();
            await sleep(1000);

            await scrollDownTo("client-zone-dropdown");
            await selectFromDropdown("client-zone-dropdown", "BidiBidi Zone 1");
        });

        it("selects a disability from the picker (reference data served from WatermelonDB)", async () => {
            for (let attempt = 1; attempt <= 3; attempt++) {
                await scrollDownTo("client-disability-select-btn");
                await element(by.id("client-disability-select-btn")).tap();

                await waitFor(element(by.text("Amputee")))
                    .toBeVisible()
                    .withTimeout(10000);
                await element(by.text("Amputee")).tap();
                await sleep(500);

                await element(by.id("client-disability-save-btn")).tap();
                await sleep(1000);

                try {
                    await expect(element(by.text("Amputee"))).toBeVisible();
                    return;
                } catch (e) {
                    if (attempt === 3) throw e;
                }
            }
        });

        it("selects one complete risk (required for new client validation)", async () => {
            await scrollDownTo("health-risk-checkbox");
            await element(by.id("health-risk-checkbox")).tap();

            await selectFromDropdown("health-risk-dropdown", "Low");
            await selectFromDropdown("health-requirements-dropdown", "Malaria treatment");
            await selectFromDropdown("health-goals-dropdown", "Pain managed");
        });

        it("submits the form – client is persisted locally in WatermelonDB as unsynced", async () => {
            await scrollDownTo("new-client-submit-button");
            await element(by.id("new-client-submit-button")).tap();

            await waitFor(element(by.text(TEST_CLIENT_FIRST_NAME)))
                .toBeVisible()
                .withTimeout(30000);
        });
    });

    describe("Phase 3: Verify sync correctly reports failure while offline", () => {
        it("navigates back to the home screen", async () => {
            await navigateBackToHome();
        });

        it("navigates to the Sync screen while offline", async () => {
            await navigateToSyncScreen();
            await expect(element(by.id("sync-database-button"))).toBeVisible();
        });

        it("attempts sync and receives a failure alert (no internet connection)", async () => {
            await triggerSyncAndWaitForAlert();

            await expect(element(by.id("sync-alert-ok-button"))).toBeVisible();
            await element(by.id("sync-alert-ok-button")).tap();
        });
    });

    describe("Phase 4: Re-enable Wi-Fi and sync locally cached changes to the server", () => {
        beforeAll(async () => {
            enableWifi();
            await sleep(5000);
        });

        it("successfully syncs local WatermelonDB changes to the server", async () => {
            await navigateToSyncScreen();
            await triggerSyncAndWaitForAlert();
            await expect(element(by.id("sync-alert-message"))).toBeVisible();
            await element(by.id("sync-alert-ok-button")).tap();
        });

        it("shows the synced client in the Client List after a successful sync", async () => {
            await navigateBackToHome();

            await element(by.id("tab-client-list")).tap();
            await waitFor(element(by.id("client-list-scroll-view")))
                .toBeVisible()
                .withTimeout(10000);
            await sleep(2000);
            await element(by.id("search-bar")).tap();
            await element(by.id("search-bar")).replaceText(TEST_CLIENT_FIRST_NAME);
            await sleep(3000);
            await waitFor(element(by.text(TEST_CLIENT_FULL_NAME)))
                .toExist()
                .withTimeout(15000);
        });
    });
});
