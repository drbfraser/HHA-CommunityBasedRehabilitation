import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common";
import { mobileApiVersion } from "./syncHandler";
import { setReadOnly } from "./readOnlyMode";

/**
 * Startup version check. Runs once the user is logged in and decides whether the
 * app must run in read-only mode.
 *
 * Read-only mode is entered ONLY on a MAJOR version incompatibility with the
 * server: on that version the app can never sync, so any local change would be
 * lost. We block further local edits and show the user a banner. A minor/patch
 * difference still syncs, so the app stays in normal read/write mode.
 *
 * Best-effort: if the check itself can't complete (e.g. offline) we leave writes
 * enabled rather than trapping the user in read-only mode.
 */
export async function runStartupVersionCheck(): Promise<void> {
    try {
        setReadOnly(!(await isServerMajorCompatible()));
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
