import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authSlice";
import bookingReducer from "./reducers/bookingSlice";
import rolesReducer from "./reducers/rolesState";
import settingsReducer from "./reducers/settingsSlice";
import userReducer from "./reducers/userState";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    roles: rolesReducer,
    booking: bookingReducer,
    settings: settingsReducer,
  },
});
