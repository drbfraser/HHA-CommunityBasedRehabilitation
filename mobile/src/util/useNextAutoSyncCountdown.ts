import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SyncSettings } from "../screens/Sync/PrefConstants";
import { SyncDatabaseTask } from "../tasks/SyncDatabaseTask";

const TICK_MS = 1000;

const parseTimestamp = (value: string | null): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

export const useNextAutoSyncCountdown = (autoSyncEnabled: boolean) => {
    const [nextAutoSyncAt, setNextAutoSyncAt] = useState<number | null>(null);
    const [, setNow] = useState<number>(Date.now());

    const loadNextAutoSync = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem(SyncSettings.NextAutoSyncAt);
            setNextAutoSyncAt(parseTimestamp(stored));
        } catch (e) {
            setNextAutoSyncAt(null);
        }
    }, []);

    useEffect(() => {
        loadNextAutoSync();
    }, [loadNextAutoSync, autoSyncEnabled]);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), TICK_MS);
        return () => clearInterval(interval);
    }, []);

    const remainingMs =
        autoSyncEnabled && nextAutoSyncAt ? Math.max(nextAutoSyncAt - Date.now(), 0) : null;

    useEffect(() => {
        if (remainingMs !== null && remainingMs <= 0) {
            // Try to predict the next interval immediately so the UI never stays at 0s
            setNextAutoSyncAt(Date.now() + SyncDatabaseTask.SYNC_INTERVAL_MILLISECONDS);
            const timeout = setTimeout(() => loadNextAutoSync(), 500);
            return () => clearTimeout(timeout);
        }
    }, [remainingMs, loadNextAutoSync]);

    return {
        nextAutoSyncAt,
        remainingMs,
        reload: loadNextAutoSync,
    };
};
