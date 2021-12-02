import { ConnectionChangeType, AddConflictsType, ClearConflictsType } from './actions';
import { SET_CONNECTION, ADD_CONFLICTS, CLEAR_CONFLICTS } from './actionTypes';
import { SyncConflict } from '../util/syncConflictConstants';

export const initialConnectionState = {
    isOnline: false as boolean,
}

export const initialConflictsState = {
    cleared: true as boolean,
    clientConflicts: new Map() as Map<string, SyncConflict>,
    userConflicts: new Map() as Map<string, SyncConflict>,
}


export function connectionReducer(
    state = initialConnectionState, 
    action: ReturnType<ConnectionChangeType>
) {
    switch (action.type) {
        case SET_CONNECTION: {
            return {
                ...state,
                isOnline: action.payload.isOnline,
            }
        }
        default:
            return state;
    }
}

export function conflictsReducer(
    state = initialConflictsState, 
    action: ReturnType<AddConflictsType> | ReturnType<ClearConflictsType>
) {
    switch (action.type) {
        case ADD_CONFLICTS: {
            let oldClientConflicts = state.clientConflicts;
            let oldUserConflicts = state.userConflicts;
            let clientConflicts = action.payload.clientConflicts;
            let userConflicts = action.payload.userConflicts;

            if (!state.cleared) {
                /* Consolidate rejected columns for conflicts in Client & Referral table
                   where both changes pertain to the same client. Otherwise, previous 
                   state changes are overwritten. */
                [...clientConflicts.keys()].forEach((id) => {
                    if (oldClientConflicts.has(id)) {
                        clientConflicts.get(id).rejected = [...oldClientConflicts.get(id)!.rejected, ...clientConflicts.get(id).rejected];
                    }
                });

                clientConflicts = new Map([...oldClientConflicts, ...clientConflicts]);
                userConflicts = new Map([...oldUserConflicts, ...userConflicts]);
            }

            state = Object.assign({}, {
                ...state,
                cleared: false,
                clientConflicts,
                userConflicts,
            });

            return state;
        }
        case CLEAR_CONFLICTS: {
            state = Object.assign({}, state, {
                ...state,
                cleared: true,
                clientConflicts: new Map(),
                userConflicts: new Map(),
            });

            return state;
        }
        default:
            return state;
    }
}
