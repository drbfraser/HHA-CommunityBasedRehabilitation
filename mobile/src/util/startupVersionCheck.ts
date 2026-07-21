import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common";
import {
    lastVersionSyncedIsCurrentVersion,
    mobileApiVersion,
    noPreviousSyncsPerformed,
} from "./syncHandler";
import { setReadOnly } from "./readOnlyMode";

/**
 * Startup version check (see docs/DESIGN-mobile-version-check-and-readonly.md §4,
 * steps 1 & 3). Runs once the user is logged in and decides whether the app must
 * run in read-only mode:
 *
 *   1. MAJOR mismatch with the server  -> read-only, reason "mandatoryUpdate".
 *      The app can never sync on this version, so writes would be lost forever.
 *   3. Majors match but local data was last synced under a different app version
 *      -> read-only, reason "resyncRequired". The data is stale and a resync will
 *      wipe it, so we protect unsynced work until the user resyncs.
 *
 * Best-effort: if the check itself can't complete (e.g. offline) we leave writes
 * enabled rather than trapping the user in read-only mode.
 */
export async function runStartupVersionCheck(): Promise<void> {
    try {
        if (!(await isServerMajorCompatible())) {
            setReadOnly(true, "mandatoryUpdate");
            return;
        }

        // Skip on a fresh install (no prior sync) — there is no local data to
        // protect, so read-only would only get in the user's way.
        const versionDrift =
            !(await lastVersionSyncedIsCurrentVersion()) && !(await noPreviousSyncsPerformed());

        setReadOnly(versionDrift, versionDrift ? "resyncRequired" : null);
    } catch (e) {
        console.log("[VersionCheck] Startup version check skipped:", e);
        setReadOnly(false);
    }
}

/**
 * Ask the server whether our major version is still compatible. Returns true on
 * 200, false on a 403 (incompatible). Any other failure (network, etc.) is
 * rethrown so the caller can treat it as "couldn't determine".
 */
async function isServerMajorCompatible(): Promise<boolean> {
    const init: RequestInit = {
        method: "POST",
        body: JSON.stringify({ api_version: mobileApiVersion }),
    };

    try {
        const response = await apiFetch(Endpoint.VERSION_CHECK, "", init);
        return response.ok;
    } catch (e) {
        if (e instanceof APIFetchFailError && e.status === 403) {
            return false;
        }
        throw e;
    }
}
