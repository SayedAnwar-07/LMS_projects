// src/redux/features/paymentSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

// Async Thunks
export const fetchPaymentDetails = createAsyncThunk(
  "payment/fetchDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payment/${courseId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const processCoursePayment = createAsyncThunk(
  "payment/process",
  async ({ courseId, payment_intent_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment/process/", {
        course_id: courseId,
        payment_intent_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkEnrollmentStatus = createAsyncThunk(
  "payment/checkEnrollment",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/enrollments/check/${courseId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/historyPaginated",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/history/?page=${page}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  courseDetails: null,
  loading: false,
  error: null,
  paymentProcessing: false,
  paymentSuccess: false,
  enrollment: null,
  paymentError: null,
  isEnrolled: false,
  enrollmentChecking: false,
  paymentHistory: [],
  paymentHistoryLoading: false,
  paymentHistoryError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.paymentProcessing = false;
      state.paymentSuccess = false;
      state.paymentError = null;
      state.enrollment = null;
    },
    clearPaymentErrors: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    setEnrollmentStatus: (state, action) => {
      state.isEnrolled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payment Details
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload;
        // Update enrollment status if already enrolled
        if (action.payload.already_enrolled) {
          state.isEnrolled = true;
        }
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Process Payment
      .addCase(processCoursePayment.pending, (state) => {
        state.paymentProcessing = true;
        state.paymentError = null;
        state.paymentSuccess = false;
      })
      .addCase(processCoursePayment.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.paymentSuccess = true;
        state.isEnrolled = true;
        state.enrollment = action.payload.enrollment;
        // Update course details with new student count
        if (state.courseDetails) {
          state.courseDetails = {
            ...state.courseDetails,
            students: state.courseDetails.students + 1,
          };
        }
      })
      .addCase(processCoursePayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.paymentError = action.payload;
      })

      // Check Enrollment Status
      .addCase(checkEnrollmentStatus.pending, (state) => {
        state.enrollmentChecking = true;
      })
      .addCase(checkEnrollmentStatus.fulfilled, (state, action) => {
        state.enrollmentChecking = false;
        state.isEnrolled = action.payload.is_enrolled;
      })
      .addCase(checkEnrollmentStatus.rejected, (state, action) => {
        state.enrollmentChecking = false;
        state.error = action.payload;
      });

    // payment history
    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.paymentHistoryLoading = true;
        state.paymentHistoryError = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistoryLoading = false;
        state.paymentHistory = {
          results: action.payload.results,
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.paymentHistoryLoading = false;
        state.paymentHistoryError = action.payload;
      });
  },
});

export const { resetPaymentState, clearPaymentErrors, setEnrollmentStatus } =
  paymentSlice.actions;

// Selectors
// Add to your selectors
export const selectPaymentHistory = (state) => state.payment.paymentHistory;
export const selectPaymentHistoryLoading = (state) =>
  state.payment.paymentHistoryLoading;
export const selectPaymentHistoryError = (state) =>
  state.payment.paymentHistoryError;
export const selectCourseDetails = (state) => state.payment.courseDetails;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectPaymentProcessing = (state) =>
  state.payment.paymentProcessing;
export const selectPaymentSuccess = (state) => state.payment.paymentSuccess;
export const selectEnrollment = (state) => state.payment.enrollment;
export const selectPaymentErrorMsg = (state) => state.payment.paymentError;
export const selectIsEnrolled = (state) => state.payment.isEnrolled;
export const selectEnrollmentChecking = (state) =>
  state.payment.enrollmentChecking;

export default paymentSlice.reducer;
