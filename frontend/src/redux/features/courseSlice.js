import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, handleApiError } from "@/utils/api";

// Async Thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get("courses/", {
        params: {
          search: params.search,
          category: params.category,
          level: params.level,
          is_featured: params.is_featured,
          page: params.page,
          limit: params.limit,
        },
      });
      return {
        results: response.data.results || response.data,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "courses/fetchCategories",
  async (params, thunkAPI) => {
    try {
      const response = await api.get("categories/", {
        params: {
          page: params?.page,
          limit: params?.limit,
        },
      });
      return {
        results: response.data.results || response.data,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`courses/${id}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.post("courses/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Course creation error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(
        error.response?.data || handleApiError(error)
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`courses/${id}/update/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update course" }
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await api.delete(`courses/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCourseCurriculum = createAsyncThunk(
  "courses/fetchCurriculum",
  async (courseId, thunkAPI) => {
    try {
      const response = await api.get(`courses/${courseId}/`);
      return {
        courseId,
        curriculum: response.data.curriculum,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCourseMaterials = createAsyncThunk(
  "courses/fetchMaterials",
  async (courseId, thunkAPI) => {
    try {
      const response = await api.get("materials/", {
        params: { course: courseId },
      });
      return {
        courseId,
        materials: response.data.results || response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

export const createCategory = createAsyncThunk(
  "courses/createCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await api.post("categories/", categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleApiError(error));
    }
  }
);

// Initial State
const initialState = {
  courses: [],
  categories: [],
  selectedCourse: null,
  curriculum: {},
  materials: {},
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

// Slice
const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    resetCourseState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.results || action.payload;
        if (action.payload.count !== undefined) {
          state.pagination = {
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          };
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.map((course) =>
          course.id === action.payload.id ? action.payload : course
        );
        if (state.selectedCourse?.id === action.payload.id) {
          state.selectedCourse = action.payload;
        }
      })

      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course.id !== action.payload
        );
        if (state.selectedCourse?.id === action.payload) {
          state.selectedCourse = null;
        }
      })
      // Fetch Curriculum
      .addCase(fetchCourseCurriculum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseCurriculum.fulfilled, (state, action) => {
        state.loading = false;
        state.curriculum[action.payload.courseId] = action.payload.curriculum;
      })
      .addCase(fetchCourseCurriculum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Materials
      .addCase(fetchCourseMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials[action.payload.courseId] = action.payload.materials;
      })
      .addCase(fetchCourseMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.results || action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedCourse, resetCourseState } = courseSlice.actions;

// Selectors
export const selectAllCourses = (state) => state.courses.courses;
export const selectCourseById = (state, courseId) =>
  state.courses.courses.find((course) => course.id === courseId) ||
  (state.courses.selectedCourse?.id === courseId
    ? state.courses.selectedCourse
    : null);
export const selectCourseLoading = (state) => state.courses.loading;
export const selectCourseError = (state) => state.courses.error;
export const selectCourseCurriculum = (state, courseId) =>
  state.courses.curriculum[courseId] || [];
export const selectCourseMaterials = (state, courseId) =>
  state.courses.materials[courseId] || [];
export const selectCoursePagination = (state) => state.courses.pagination;
export const selectAllCategories = (state) => state.courses.categories;
export const selectCategoryById = (state, categoryId) =>
  state.courses.categories.find((category) => category.id === categoryId);

export default courseSlice.reducer;
