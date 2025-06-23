import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/api";

export const fetchTeacherDashboard = createAsyncThunk(
  "dashboard/fetchTeacherDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/teacher-dashboard/");
      return response.data.data; // Access the nested data property
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch teacher dashboard data"
      );
    }
  }
);

const initialState = {
  teacher: {
    id: null,
    name: "",
    email: "",
    avatar: null,
  },
  total_courses: 0,
  active_courses: 0,
  total_students: 0,
  courses: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload.teacher || initialState.teacher;
        state.total_courses = action.payload.stats?.total_courses || 0;
        state.active_courses = action.payload.stats?.active_courses || 0;
        state.total_students = action.payload.stats?.total_students || 0;
        state.courses = action.payload.courses || [];
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTeacherData = (state) => ({
  teacher: state.dashboard.teacher,
  total_courses: state.dashboard.total_courses,
  active_courses: state.dashboard.active_courses,
  total_students: state.dashboard.total_students,
  courses: state.dashboard.courses,
});

export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
