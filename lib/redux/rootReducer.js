import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../services/api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  // Add other reducers here
});

export default rootReducer;
