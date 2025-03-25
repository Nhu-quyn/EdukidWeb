import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import gameSlice from "./gameSlice.js";
import activitySlice from "./activitySlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameSlice,
    activity: activitySlice,
  },
});
