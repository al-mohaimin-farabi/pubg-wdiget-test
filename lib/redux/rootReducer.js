import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../services/api";
import { pcobApi } from "../services/pcob-api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [pcobApi.reducerPath]: pcobApi.reducer,
  // Add other reducers here
});

export default rootReducer;
