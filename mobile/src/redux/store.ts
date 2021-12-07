import { createStore, Store } from "redux";
import rootReducer from "./index";

export const store: Store = createStore(rootReducer);
