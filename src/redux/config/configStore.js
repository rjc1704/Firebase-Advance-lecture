import member from "redux/modules/memberSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  member,
});

const store = configureStore({
  reducer: rootReducer,
});

const getStore = () => store;
export default getStore;
