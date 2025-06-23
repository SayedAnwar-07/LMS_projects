import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/utils/api";

const initialState = {
  currentCourseProgress: null,
  allEnrollments: [],
  loading: false,
  error: null,
  markingStatus: "idle",
};

// Async Thunks
export const fetchCourseProgress = createAsyncThunk(
  "progress/fetchCourseProgress",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/progress/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markLessonCompleted = createAsyncThunk(
  "progress/markLessonCompleted",
  async ({ enrollmentId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/enrollments/${enrollmentId}/lessons/${lessonId}/complete/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markLessonIncomplete = createAsyncThunk(
  "progress/markLessonIncomplete",
  async ({ enrollmentId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/enrollments/${enrollmentId}/lessons/${lessonId}/incomplete/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllEnrollments = createAsyncThunk(
  "progress/fetchAllEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/enrollments/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Progress Slice
const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    resetProgressState: (state) => {
      state.currentCourseProgress = null;
      state.loading = false;
      state.error = null;
      state.markingStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Course Progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourseProgress = action.payload;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch progress";
      })

      // Mark Lesson Completed
      .addCase(markLessonCompleted.pending, (state) => {
        state.markingStatus = "marking";
      })
      .addCase(markLessonCompleted.fulfilled, (state, action) => {
        state.markingStatus = "succeeded";
        if (state.currentCourseProgress) {
          // Update the current course progress in state
          const lessonId = action.meta.arg.lessonId;
          const lessonIndex = state.currentCourseProgress.lessons.findIndex(
            (lesson) => lesson.id === lessonId
          );

          if (lessonIndex !== -1) {
            state.currentCourseProgress.lessons[
              lessonIndex
            ].is_completed = true;
            state.currentCourseProgress.completed_lessons =
              action.payload.completed_lessons;
            state.currentCourseProgress.progress_percentage =
              action.payload.progress;
            state.currentCourseProgress.is_course_completed =
              action.payload.is_course_completed;
          }
        }
      })
      .addCase(markLessonCompleted.rejected, (state, action) => {
        state.markingStatus = "failed";
        state.error =
          action.payload?.message || "Failed to mark lesson completed";
      })

      // Mark Lesson Incomplete
      .addCase(markLessonIncomplete.pending, (state) => {
        state.markingStatus = "marking";
      })
      .addCase(markLessonIncomplete.fulfilled, (state, action) => {
        state.markingStatus = "succeeded";
        if (state.currentCourseProgress) {
          // Update the current course progress in state
          const lessonId = action.meta.arg.lessonId;
          const lessonIndex = state.currentCourseProgress.lessons.findIndex(
            (lesson) => lesson.id === lessonId
          );

          if (lessonIndex !== -1) {
            state.currentCourseProgress.lessons[
              lessonIndex
            ].is_completed = false;
            state.currentCourseProgress.completed_lessons =
              action.payload.completed_lessons;
            state.currentCourseProgress.progress_percentage =
              action.payload.progress;
            state.currentCourseProgress.is_course_completed =
              action.payload.is_course_completed;
          }
        }
      })
      .addCase(markLessonIncomplete.rejected, (state, action) => {
        state.markingStatus = "failed";
        state.error =
          action.payload?.message || "Failed to mark lesson incomplete";
      })

      // Fetch All Enrollments
      .addCase(fetchAllEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.allEnrollments = action.payload;
      })
      .addCase(fetchAllEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch enrollments";
      });
  },
});

// Selectors
export const selectCurrentCourseProgress = (state) =>
  state.progress.currentCourseProgress;
export const selectAllEnrollments = (state) => state.progress.allEnrollments;
export const selectProgressLoading = (state) => state.progress.loading;
export const selectProgressError = (state) => state.progress.error;
export const selectMarkingStatus = (state) => state.progress.markingStatus;

// Actions
export const { resetProgressState } = progressSlice.actions;

export default progressSlice.reducer;
