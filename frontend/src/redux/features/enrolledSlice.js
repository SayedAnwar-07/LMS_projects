// enrolledSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/utils/api";

// Async Thunks
export const fetchUserEnrollments = createAsyncThunk(
  "enrollments/fetchUserEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/enrollments/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkCourseEnrollment = createAsyncThunk(
  "enrollments/checkCourseEnrollment",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/enrollments/check/${courseId}/`);
      return { courseId, isEnrolled: response.data.is_enrolled };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
  enrollmentStatus: {}, 
  checkingEnrollment: false,
  enrollmentError: null,
};

const enrolledSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    clearEnrollmentErrors: (state) => {
      state.error = null;
      state.enrollmentError = null;
    },
    resetEnrollmentStatus: (state, action) => {
      const courseId = action.payload;
      delete state.enrollmentStatus[courseId];
    },
    addEnrollment: (state, action) => {
      state.enrollments.unshift(action.payload);
      state.enrollmentStatus[action.payload.course.id] = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Enrollments
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;

        // Update enrollment status for all enrolled courses
        action.payload.forEach((enrollment) => {
          state.enrollmentStatus[enrollment.course.id] = true;
        });
      })
      .addCase(fetchUserEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Course Enrollment
      .addCase(checkCourseEnrollment.pending, (state) => {
        state.checkingEnrollment = true;
        state.enrollmentError = null;
      })
      .addCase(checkCourseEnrollment.fulfilled, (state, action) => {
        state.checkingEnrollment = false;
        const { courseId, isEnrolled } = action.payload;
        state.enrollmentStatus[courseId] = isEnrolled;
      })
      .addCase(checkCourseEnrollment.rejected, (state, action) => {
        state.checkingEnrollment = false;
        state.enrollmentError = action.payload;
      });
  },
});

// Actions
export const { clearEnrollmentErrors, resetEnrollmentStatus, addEnrollment } =
  enrolledSlice.actions;

// Selectors
export const selectEnrollments = (state) => state.enrollments.enrollments;
export const selectEnrollmentsLoading = (state) => state.enrollments.loading;
export const selectEnrollmentsError = (state) => state.enrollments.error;
export const selectIsEnrolled = (state, courseId) =>
  state.enrollments.enrollmentStatus[courseId] || false;
export const selectCheckingEnrollment = (state) =>
  state.enrollments.checkingEnrollment;
export const selectEnrollmentError = (state) =>
  state.enrollments.enrollmentError;

export default enrolledSlice.reducer;
