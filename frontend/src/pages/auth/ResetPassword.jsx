"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  confirmPasswordReset,
  resetAuthState,
} from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const [otpTimer, setOtpTimer] = useState(
    import.meta.env.VITE_OTP_EXPIRY_MINUTES * 60 || 900
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, passwordResetSuccess } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      otp: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [location, setValue]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const onSubmit = async (data) => {
    try {
      await dispatch(confirmPasswordReset(data)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToLogin = () => {
    dispatch(resetAuthState());
    navigate("/login");
  };

  if (passwordResetSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Password Reset Successful
            </h1>
            <p className="text-gray-600">
              Your password has been updated successfully
            </p>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              You can now login with your new password.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleBackToLogin}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md shadow-sm transition-colors"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter the OTP and your new password</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {typeof error === "string"
                ? error
                : error.message || "An error occurred during password reset"}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                className="pl-10 w-full"
                placeholder="you@example.com"
                disabled={loading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Email is invalid",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP Code
              </label>
              {otpTimer > 0 ? (
                <span className="text-sm text-gray-500">
                  Expires in: {Math.floor(otpTimer / 60)}:
                  {String(otpTimer % 60).padStart(2, "0")}
                </span>
              ) : (
                <span className="text-sm text-red-600">OTP expired</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="otp"
                className="pl-10 w-full"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={loading || otpTimer <= 0}
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                })}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="new_password"
                type="password"
                className="pl-10 w-full"
                placeholder="At least 8 characters"
                disabled={loading}
                {...register("new_password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
            </div>
            {errors.new_password && (
              <p className="text-sm text-red-600">
                {errors.new_password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirm_password"
                type="password"
                className="pl-10 w-full"
                placeholder="Confirm your password"
                disabled={loading}
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("new_password") || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirm_password && (
              <p className="text-sm text-red-600">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md shadow-sm transition-colors"
            disabled={loading || otpTimer <= 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:underline"
              onClick={handleBackToLogin}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
