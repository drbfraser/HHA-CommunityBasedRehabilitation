const { device, element, by, expect, waitFor } = require("detox");
const { execSync } = require("child_process");

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

/**
 * A unique last name per test run so the test client can be identified in the Client List
 * even when previous test runs left records in the database.
 */
const TEST_CLIENT_FIRST_NAME = "SyncE2E";
const TEST_CLIENT_LAST_NAME = `Offline${Date.now()}`;

function disableWifi() {
    execSync("adb shell svc wifi disable");
}

function enableWifi() {
    execSync("adb shell svc wifi enable");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

/**
 * Open the Sync bottom-sheet that appears when the Sync tab is tapped,
 * then tap the "Sync" navigation button to go to the full Sync screen.
 */
async function navigateToSyncScreen() {
    await element(by.text("Sync")).tap();

    await waitFor(element(by.id("home-sync-modal-button")))
        .toBeVisible()
        .withTimeout(10000);
    await element(by.id("home-sync-modal-button")).tap();

    await waitFor(element(by.id("sync-database-button")))
        .toBeVisible()
        .withTimeout(10000);
}

/**
 * Press the "Sync to Server" button and wait until the result alert is shown.
 * The alert id ("sync-alert-ok-button") is present for both success and failure.
 */
async function triggerSyncAndWaitForAlert() {
    await element(by.id("sync-database-button")).tap();
    await waitFor(element(by.id("sync-alert-ok-button")))
        .toBeVisible()
        .withTimeout(60000);
}

/**
 * Navigate back to the home tab bar from any pushed stack screen.
 * Uses up to three Back presses so the test is not brittle if the
 * navigation depth is slightly different.
 */
async function navigateBackToHome() {
    for (let i = 0; i < 3; i++) {
        try {
            // If the Dashboard tab is already visible we are done
            await expect(element(by.text("Dashboard"))).toBeVisible();
            return;
        } catch {}
        await device.pressBack();
        await sleep(500);
    }
    await waitFor(element(by.text("Dashboard")))
        .toBeVisible()
        .withTimeout(10000);
}

describe("Sync: offline caching via WatermelonDB then online server sync", () => {
    beforeAll(async () => {
        // Cold-start the app so each run begins from a clean app state.
        await device.launchApp({ newInstance: true });

        await waitFor(element(by.id("login-button")))
            .toBeVisible()
            .withTimeout(120000);

        await loginWithCredentials();

        // Wait for the home / dashboard screen to be rendered.
        await waitFor(element(by.text("Dashboard")))
            .toBeVisible()
            .withTimeout(30000);
    });

    afterAll(async () => {
        // Always restore Wi-Fi so the emulator is not left in an offline state.
        try {
            enableWifi();
        } catch {}
    });

    describe("Phase 1: Initial online sync to seed local WatermelonDB", () => {
        it("navigates to the Sync screen", async () => {
            await navigateToSyncScreen();
            await expect(element(by.id("sync-database-button"))).toBeVisible();
        });

        it("completes an initial sync with the server", async () => {
            await triggerSyncAndWaitForAlert();

            // Both success and failure alerts show the message element;
            // here we know we are online so we expect a success alert.
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
            // Give React Native's NetInfo a moment to register the offline state.
            await sleep(2000);
        });

        it("navigates to the New Client tab while offline", async () => {
            await element(by.text("New Client")).tap();
            await waitFor(element(by.id("new-client-consent-checkbox")))
                .toBeVisible()
                .withTimeout(10000);
        });

        it("accepts the interview consent (enables the rest of the form)", async () => {
            await element(by.id("new-client-consent-checkbox")).tap();

            // Consenting enables the form fields – first name should become accessible.
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
            // Birthday section is below the name fields – scroll down to reveal it.
            await element(by.id("new-client-scroll-view")).scroll(200, "down");

            await waitFor(element(by.id("client-birthday-select-btn")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("client-birthday-select-btn")).tap();

            // The Android DatePickerDialog opens; press OK to accept the default date.
            // The form only rejects future dates, so today is always valid.
            await waitFor(element(by.text("OK")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.text("OK")).tap();
        });

        it("selects gender from the dropdown (below birthday section)", async () => {
            // Scroll further to reveal the gender dropdown.
            await element(by.id("new-client-scroll-view")).scroll(200, "down");

            await waitFor(element(by.id("client-gender-dropdown")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("client-gender-dropdown")).tap();

            await waitFor(element(by.text("Male")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.text("Male")).tap();
        });

        it("fills in village and selects a zone (zone loaded from WatermelonDB while offline)", async () => {
            // Village and zone are below gender – scroll to reveal them.
            await element(by.id("new-client-scroll-view")).scroll(250, "down");

            await waitFor(element(by.id("client-village-input")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("client-village-input")).tap();
            await element(by.id("client-village-input")).replaceText("TestVillage");
            await element(by.id("client-village-input")).tapReturnKey();

            await waitFor(element(by.id("client-zone-dropdown")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("client-zone-dropdown")).tap();

            // "BidiBidi Zone 1" is the first zone seeded by seedzones.py.
            await waitFor(element(by.text("BidiBidi Zone 1")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.text("BidiBidi Zone 1")).tap();
        });

        it("selects a disability from the picker (reference data served from WatermelonDB)", async () => {
            // The disability section is further down – scroll to reveal the select button.
            await element(by.id("new-client-scroll-view")).scroll(300, "down");

            await waitFor(element(by.id("client-disability-select-btn")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("client-disability-select-btn")).tap();

            // "Amputee" is the first entry created by the seeddisabilities management command.
            await waitFor(element(by.text("Amputee")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.text("Amputee")).tap();

            // Save the selection and close the modal.
            await element(by.id("client-disability-save-btn")).tap();
        });

        it("submits the form – client is persisted locally in WatermelonDB as unsynced", async () => {
            // Submit button is at the very bottom of the form – scroll down to reveal it.
            await element(by.id("new-client-scroll-view")).scroll(500, "down");

            await waitFor(element(by.id("new-client-submit-button")))
                .toBeVisible()
                .withTimeout(5000);
            await element(by.id("new-client-submit-button")).tap();

            // Successful submission navigates to the Client Details screen which shows the name.
            await waitFor(element(by.text(TEST_CLIENT_FIRST_NAME)))
                .toBeVisible()
                .withTimeout(15000);
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

            // When offline, the sync attempt will fail and show a failure alert.
            // We verify the alert is dismissible.
            await expect(element(by.id("sync-alert-ok-button"))).toBeVisible();
            await element(by.id("sync-alert-ok-button")).tap();
        });
    });

    describe("Phase 4: Re-enable Wi-Fi and sync locally cached changes to the server", () => {
        beforeAll(async () => {
            enableWifi();
            // Allow a few seconds for the emulator to reconnect before syncing.
            await sleep(5000);
        });

        it("successfully syncs local WatermelonDB changes to the server", async () => {
            // We are still on the Sync screen from Phase 3.
            await triggerSyncAndWaitForAlert();

            // A success alert should now be shown because the server is reachable.
            await expect(element(by.id("sync-alert-message"))).toBeVisible();
            await element(by.id("sync-alert-ok-button")).tap();
        });

        it("shows the synced client in the Client List after a successful sync", async () => {
            // Navigate back to the home screen then switch to the Client List tab.
            await navigateBackToHome();

            await element(by.text("Client List")).tap();

            // The previously offline-created client should now appear in the list
            // because the sync pushed it to the server and re-pulled the confirmed record.
            await waitFor(element(by.text(TEST_CLIENT_FIRST_NAME)))
                .toBeVisible()
                .withTimeout(15000);
        });
    });
});
