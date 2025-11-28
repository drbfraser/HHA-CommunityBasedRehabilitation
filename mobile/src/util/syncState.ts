export type SyncSource = "manual" | "auto" | "background";

export type SyncPhase =
    | "idle"
    | "preparing"
    | "pulling"
    | "pushing"
    | "finalizing"
    | "success"
    | "error";

export interface SyncStatus {
    phase: SyncPhase;
    source: SyncSource | null;
    startedAt: number | null;
    completedAt: number | null;
    error?: string;
}

type SyncStatusListener = (status: SyncStatus) => void;

const listeners: SyncStatusListener[] = [];

let currentStatus: SyncStatus = {
    phase: "idle",
    source: null,
    startedAt: null,
    completedAt: null,
};

const emitStatus = () => {
    listeners.forEach((listener) => listener(currentStatus));
};

const updateStatus = (next: Partial<SyncStatus>) => {
    currentStatus = { ...currentStatus, ...next };
    emitStatus();
};

export const subscribeToSyncStatus = (listener: SyncStatusListener) => {
    listeners.push(listener);
    listener(currentStatus);

    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

export const getSyncStatus = () => currentStatus;

export const syncInProgress = (status: SyncStatus = currentStatus) => {
    return (
        status.phase === "preparing" ||
        status.phase === "pulling" ||
        status.phase === "pushing" ||
        status.phase === "finalizing"
    );
};

export const markSyncStart = (source: SyncSource) => {
    updateStatus({
        phase: "preparing",
        source,
        startedAt: Date.now(),
        completedAt: null,
        error: undefined,
    });
};

export const markSyncPhase = (phase: SyncPhase) => updateStatus({ phase });

export const markSyncSuccess = () =>
    updateStatus({
        phase: "success",
        completedAt: Date.now(),
        error: undefined,
    });

export const markSyncError = (error?: string) =>
    updateStatus({
        phase: "error",
        completedAt: Date.now(),
        error,
    });
