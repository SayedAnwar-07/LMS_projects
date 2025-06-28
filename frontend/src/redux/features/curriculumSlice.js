import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { api } from "../../utils/api";

// Initial state
const initialState = {
  sections: [],
  lessons: [],
  status: {
    sections: "idle",
    lessons: "idle",
  },
  error: null,
  currentItem: null,
};

const ensureArray = (data) => (Array.isArray(data) ? data : []);

export const fetchCourse = createAsyncThunk(
  "curriculum/fetchCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSections = createAsyncThunk(
  "curriculum/fetchSections",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sections/?course=${courseId}`);
      return ensureArray(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSection = createAsyncThunk(
  "curriculum/createSection",
  async (sectionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sections/", sectionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  "curriculum/updateSection",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sections/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSection = createAsyncThunk(
  "curriculum/deleteSection",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sections/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLessons = createAsyncThunk(
  "curriculum/fetchLessons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/lessons/");
      return Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createLesson = createAsyncThunk(
  "curriculum/createLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await api.post("/lessons/", lessonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  "curriculum/updateLesson",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/lessons/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "curriculum/deleteLesson",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/lessons/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const curriculumSlice = createSlice({
  name: "curriculum",
  initialState,
  reducers: {
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    resetCurriculumState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.course = action.payload;
        state.status = "succeeded";
      })
      // Sections
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
        state.status = "succeeded";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((s) => s.id !== action.payload);
        state.status = "succeeded";
      })

      // lessons
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.lessons = action.payload;
        state.status = "succeeded";
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
        state.status = "succeeded";
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter((l) => l.id !== action.payload);
        state.status = "succeeded";
      })

      // Status handling
      .addMatcher(
        (action) =>
          action.type.startsWith("curriculum/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("curriculum/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

// Selectors with proper null checks
export const selectCourse = (state) => state.curriculum.course;

export const selectAllSections = (state) => state.curriculum.sections || [];
export const selectAllLessons = (state) => state.curriculum.lessons || [];
export const selectCurriculumStatus = (state) => state.curriculum.status;
export const selectCurriculumError = (state) => state.curriculum.error;
export const selectCurrentItem = (state) => state.curriculum.currentItem;

export const selectSectionById = (id) => (state) =>
  (state.curriculum.sections || []).find((section) => section.id === id);

export const selectLessonById = (id) => (state) =>
  (state.curriculum.lessons || []).find((lesson) => lesson.id === id);

export const selectLessonsBySectionId = (sectionId) => (state) =>
  (state.curriculum.lessons || []).filter(
    (lesson) => lesson.section == sectionId
  );

export const selectLessonsByCourseId = (courseId) => (state) =>
  (state.curriculum.lessons || []).filter(
    (lesson) => lesson.course === courseId
  );

export const selectSectionsWithLessons = createSelector(
  [selectAllSections, selectAllLessons],
  (sections, lessons) => {
    return sections.map((section) => ({
      ...section,
      lectures: lessons.filter((lesson) => lesson.section === section.id),
    }));
  }
);
export const { setCurrentItem, clearCurrentItem, resetCurriculumState } =
  curriculumSlice.actions;

export default curriculumSlice.reducer;
