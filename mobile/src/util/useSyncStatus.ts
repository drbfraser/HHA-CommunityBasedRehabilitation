import { useEffect, useState } from "react";
import {
    getSyncStatus,
    subscribeToSyncStatus,
    syncInProgress,
    SyncStatus,
} from "./syncState";

export const useSyncStatus = () => {
    const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

    useEffect(() => subscribeToSyncStatus(setStatus), []);

    return {
        status,
        isSyncing: syncInProgress(status),
    };
};
