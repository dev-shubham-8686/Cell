import { thunk } from "redux-thunk";
import { configureStore, Tuple } from '@reduxjs/toolkit'

import rootReducer from "./reducers";

const initalState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(thunk),
  preloadedState: initalState
})

export default store;
