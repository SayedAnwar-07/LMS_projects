import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import courseReducer from "./features/courseSlice";
import dashboardReducer from "./features/dashboardSlice";
import curriculumReducer from "./features/curriculumSlice";
import paymentReducer from "./features/paymentSlice";
import enrolledReducer from "./features/enrolledSlice";
import progressReducer from "./features/progressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    dashboard: dashboardReducer,
    curriculum: curriculumReducer,
    payment: paymentReducer,
    enrollments: enrolledReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
