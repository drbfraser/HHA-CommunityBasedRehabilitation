export const addSyncConflicts = (clientConflicts, userConflicts) => ({
    type: "ADD_CONFLICTS",
    payload: {
        clientConflicts,
        userConflicts,
    },
});

export const clearSyncConflicts = () => ({
    type: "CLEAR_CONFLICTS",
    payload: {
        clientConflicts: null,
        userConflicts: null,
    },
});

export const setAutoSyncScheduled = (scheduled) => ({
    type: "SCHEDULE_AUTO_SYNC",
    payload: {
        scheduled,
    },
});

export type AddConflictsType = typeof addSyncConflicts;
export type ClearConflictsType = typeof clearSyncConflicts;
export type AutoSyncScheduledType = typeof setAutoSyncScheduled;
