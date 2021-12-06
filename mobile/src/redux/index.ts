import { combineReducers } from "redux";
import { conflictsReducer, syncScheduledReducer } from "./reducers";

const rootReducer = combineReducers({
    syncScheduled: syncScheduledReducer,
    conflicts: conflictsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
