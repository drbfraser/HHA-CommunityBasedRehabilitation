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

export type AddConflictsType = typeof addSyncConflicts;
export type ClearConflictsType = typeof clearSyncConflicts;
