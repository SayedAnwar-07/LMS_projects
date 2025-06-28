import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

// Async Thunks
export const fetchCourseReviews = createAsyncThunk(
  "reviews/fetchCourseReviews",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/reviews/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ courseId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/reviews/create/`,
        reviewData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/reviews/${reviewId}/update/`,
        reviewData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}/delete/`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createReviewResponse = createAsyncThunk(
  "reviews/createReviewResponse",
  async ({ reviewId, responseData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/reviews/${reviewId}/response/`,
        responseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const voteReview = createAsyncThunk(
  "reviews/voteReview",
  async ({ reviewId, isHelpful }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/vote/`, {
        is_helpful: isHelpful,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchReviewResponse = createAsyncThunk(
  "reviews/fetchReviewResponse",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/${reviewId}/response/view/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  reviews: [],
  currentReview: null,
  reviewResponse: null,
  loading: false,
  error: null,
  success: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Course Reviews
      .addCase(fetchCourseReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchCourseReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews = state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        );
        if (state.currentReview?.id === action.payload.id) {
          state.currentReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
        if (state.currentReview?.id === action.payload) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Review Response
      .addCase(createReviewResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReviewResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reviewResponse = action.payload;
      })
      .addCase(createReviewResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Vote Review
      .addCase(voteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.map((review) => {
          if (review.id === action.meta.arg.reviewId) {
            // Update helpful counts based on the vote
            if (action.meta.arg.isHelpful) {
              return {
                ...review,
                helpful_count: review.helpful_count + 1,
              };
            } else {
              return {
                ...review,
                not_helpful_count: review.not_helpful_count + 1,
              };
            }
          }
          return review;
        });
      })
      .addCase(voteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Review Response
      .addCase(fetchReviewResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewResponse = action.payload;
      })
      .addCase(fetchReviewResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState, clearCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
