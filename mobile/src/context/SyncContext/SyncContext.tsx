import { createContext } from "react";

export const SyncContext = createContext({
    unSyncedChanges: false,
    setUnSyncedChanges: (change) => {},
});
