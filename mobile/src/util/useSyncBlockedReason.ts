import { useContext } from "react";
import { NetInfoStateType, useNetInfo } from "@react-native-community/netinfo";
import { SyncContext } from "../context/SyncContext/SyncContext";

export type SyncBlockedReason = "no_internet" | "cellular_disabled" | null;

// Why the current network connection prevents syncing, or null if it doesn't. While NetInfo is
// still checking reachability (isInternetReachable === null), assume the connection works so the
// app doesn't briefly claim to be offline at startup.
export const useSyncBlockedReason = (): SyncBlockedReason => {
    const netInfo = useNetInfo();
    const { cellularSync } = useContext(SyncContext);

    if (netInfo.isConnected === false || netInfo.isInternetReachable === false) {
        return "no_internet";
    }
    if (netInfo.type === NetInfoStateType.cellular && !cellularSync) {
        return "cellular_disabled";
    }
    return null;
};
