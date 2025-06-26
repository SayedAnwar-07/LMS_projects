import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, handleApiError } from "../../utils/api";

const setAuthTokens = (tokens) => {
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
};

const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("users/register/", userData);
      return response.data;
    } catch (error) {
      console.log("Full error response:", error.response);
      return rejectWithValue(
        error.response?.data || {
          message: "Registration failed. Please check your details.",
        }
      );
    }
  }
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("users/verify-otp/", { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || { message: "OTP verification failed" }
      );
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("users/resend-otp/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || { message: "Failed to resend OTP" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("users/login/", { email, password });
      const { data } = response.data;

      setAuthTokens(data.tokens);

      return {
        user: {
          email: data.email,
          username: data.username,
          role: data.role,
          is_verified: true,
        },
        tokens: data.tokens,
      };
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || {
          message: "Invalid username or password. Please try again",
        }
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("users/verify-token/");

      const profileResponse = await api.get("users/profile/");
      const userData = profileResponse.data.data;

      return {
        user: {
          email: userData.email,
          username: userData.username,
          role: userData.role,
          mobile_no: userData.mobile_no,
          is_verified: userData.is_verified,
        },
      };
    } catch (error) {
      clearAuthTokens();
      return rejectWithValue(
        handleApiError(error).data || { message: "Token verification failed" }
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("users/profile/");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || { message: "Failed to fetch profile" }
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await api.patch("users/profile/", updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || { message: "Failed to update profile" }
      );
    }
  }
);

// New Password Reset Thunks
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("users/password-reset/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || {
          message: "Password reset request failed",
        }
      );
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmPasswordReset",
  async (
    { email, otp, new_password, confirm_password },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("users/password-reset-confirm/", {
        email,
        otp,
        new_password,
        confirm_password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error).data || { message: "Password reset failed" }
      );
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  registrationSuccess: false,
  otpSent: false,
  otpVerified: false,
  passwordResetRequested: false,
  passwordResetSuccess: false,
  tokens: {
    access: localStorage.getItem("accessToken") || null,
    refresh: localStorage.getItem("refreshToken") || null,
  },
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAuthTokens();
      state.user = null;
      state.isAuthenticated = false;
      state.tokens = { access: null, refresh: null };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.registrationSuccess = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.passwordResetRequested = false;
      state.passwordResetSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed ";
      })

      // OTP Verify
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message;
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Password Reset Request
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetRequested = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // Password Reset Confirm
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.passwordResetRequested = false;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectPasswordResetRequested = (state) =>
  state.auth.passwordResetRequested;
export const selectPasswordResetSuccess = (state) =>
  state.auth.passwordResetSuccess;

export const { logout, clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
