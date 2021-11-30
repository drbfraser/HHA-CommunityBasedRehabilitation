import { ConnectionChangeType, AddConflictsType, ClearConflictsType } from './actions';
import { SET_CONNECTION, ADD_CONFLICTS, CLEAR_CONFLICTS } from './actionTypes';

export const initialConnectionState = {
    isOnline: false as boolean,
}

export const initialConflictsState = {
    cleared: true as boolean,
    clientConflicts: {} as Object,
    userConflicts: {} as Object,
}

/*
    clientConflicts: {
        id: {
            name: string
            rejected: [
                {
                    columns: string,
                    rejectedChange: string,
                },
                {
                    columns: string,
                    rejectedChange: string,
                },
                {
                    columns: string,
                    rejectedChange: string,
                }
            ],
        }
    }

    I think we should also just include referral 
    outcome w client conflicts if possible
*/

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
            const clientConflicts = action.payload.clientConflicts;
            const userConflicts = action.payload.userConflicts;

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
                clientConflicts: {},
                userConflicts: {},
            });

            return state;
        }
        default:
            return state;
    }
}
