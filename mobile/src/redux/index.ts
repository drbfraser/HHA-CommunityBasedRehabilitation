import { combineReducers } from 'redux';
import { connectionReducer, conflictsReducer } from './reducers';

const rootReducer = combineReducers({
    connection: connectionReducer,
    conflicts: conflictsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>
