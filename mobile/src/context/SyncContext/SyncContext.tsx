import { createContext } from "react";

export const SyncContext = createContext({
    unSyncedChanges: false,
    setUnSyncedChanges: (change) => {},
    autoSync: true,
    setAutoSync: (change) => {},
    cellularSync: false,
    setCellularSync: (change) => {},
});
