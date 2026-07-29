import { useSyncExternalStore } from "react";

/**
 * App-global "read-only mode" flag.
 *
 * See docs/DESIGN-mobile-version-check-and-readonly.md §5. When read-only mode is
 * on, all local database writes are blocked (enforced centrally in
 * watermelonDatabase.ts) so the user can still view their data but cannot make
 * changes that would never sync to the server.
 *
 * This is a tiny standalone store rather than Redux so that the non-React
 * database-write guard can read it synchronously, while React components (e.g.
 * the dashboard banner) can subscribe to it via `useReadOnlyMode()`.
 */

/** Why the app entered read-only mode, used to pick the banner/dialog wording. */
export type ReadOnlyReason = "mandatoryUpdate" | "resyncRequired";

export interface ReadOnlyState {
    readOnly: boolean;
    reason: ReadOnlyReason | null;
}

/** Thrown by a blocked database write so callers don't record a false success. */
export class ReadOnlyModeError extends Error {
    constructor() {
        super("Write blocked: the app is in read-only mode.");
        this.name = "ReadOnlyModeError";
    }
}

let state: ReadOnlyState = { readOnly: false, reason: null };
const listeners = new Set<() => void>();

/**
 * Write-bypass depth. The read-only guard is meant to block *user* edits, but the
 * sync engine itself must write to the local database to pull the server's data
 * and mark records as synced — and running a sync is exactly how the user leaves
 * "resyncRequired" read-only mode. Without this bypass the guard would reject the
 * sync's own writes, so the resync could never complete and the app would be
 * trapped in read-only mode. While a sync (or its pre-sync reset) runs it wraps
 * its work in `runWithWriteBypass()` so those writes are allowed even though
 * read-only mode is still on. Reference-counted so nested/overlapping writes are
 * safe.
 */
let writeBypassDepth = 0;

export function isReadOnly(): boolean {
    return state.readOnly;
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

export function getReadOnlyState(): ReadOnlyState {
    return state;
}

export function setReadOnly(readOnly: boolean, reason: ReadOnlyReason | null = null): void {
    if (state.readOnly === readOnly && state.reason === reason) {
        return;
    }
    state = { readOnly, reason: readOnly ? reason : null };
    listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
    listeners.add(notify);
    return () => {
        listeners.delete(notify);
    };
}

/** React hook: re-renders the caller whenever read-only mode changes. */
export function useReadOnlyMode(): ReadOnlyState {
    return useSyncExternalStore(subscribe, getReadOnlyState);
}
