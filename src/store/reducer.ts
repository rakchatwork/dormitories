import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import dormitoryReducer from "./slices/dormitorySlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dormitory: dormitoryReducer,
  user: userReducer,
});

export default rootReducer;
