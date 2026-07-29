import { useSyncExternalStore } from "react";

/**
 * App-global "read-only mode" flag.
 *
 * Read-only mode is entered only when the app can no longer save the user's work
 * to the server — i.e. the app's MAJOR version is incompatible with the server
 * (see startupVersionCheck.ts). While it is on, all local database writes are
 * blocked (enforced centrally in watermelonDatabase.ts) so the user can still
 * view their data but cannot make changes that would never sync and would be
 * lost. A minor/patch version difference still syncs fine, so it does NOT enter
 * read-only mode.
 *
 * This is a tiny standalone store rather than Redux so that the non-React
 * database-write guard can read it synchronously, while React components (e.g.
 * the dashboard banner) can subscribe to it via `useReadOnlyMode()`.
 */

/** Thrown by a blocked database write so callers don't record a false success. */
export class ReadOnlyModeError extends Error {
    constructor() {
        super("Write blocked: the app is in read-only mode.");
        this.name = "ReadOnlyModeError";
    }
}

let readOnly = false;
const listeners = new Set<() => void>();

/**
 * Write-bypass depth. The read-only guard is meant to block *user* edits, but the
 * sync engine itself must write to the local database to pull the server's data.
 * While a sync runs it wraps its work in `runWithWriteBypass()` so those writes
 * are allowed even though read-only mode is on. Reference-counted so
 * nested/overlapping writes are safe.
 */
let writeBypassDepth = 0;

export function isReadOnly(): boolean {
    return readOnly;
}

export function setReadOnly(value: boolean): void {
    if (readOnly === value) {
        return;
    }
    readOnly = value;
    listeners.forEach((notify) => notify());
}

/** True while a sync-initiated write should be allowed despite read-only mode. */
export function isWriteBypassed(): boolean {
    return writeBypassDepth > 0;
}

/** Run `fn` with the read-only write guard suspended (used by the sync engine). */
export async function runWithWriteBypass<T>(fn: () => Promise<T>): Promise<T> {
    writeBypassDepth += 1;
    try {
        return await fn();
    } finally {
        writeBypassDepth -= 1;
    }
}

function subscribe(notify: () => void): () => void {
    listeners.add(notify);
    return () => {
        listeners.delete(notify);
    };
}

/** React hook: re-renders the caller whenever read-only mode changes. */
export function useReadOnlyMode(): boolean {
    return useSyncExternalStore(subscribe, isReadOnly);
}
