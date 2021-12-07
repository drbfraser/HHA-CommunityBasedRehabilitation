import { combineReducers } from "redux";
import { conflictsReducer } from "./reducers";

const rootReducer = combineReducers({
    conflicts: conflictsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
