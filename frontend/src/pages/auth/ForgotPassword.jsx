"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPasswordReset,
  resetAuthState,
} from "@/redux/features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, passwordResetRequested } = useSelector(
    (state) => state.auth
  );

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(requestPasswordReset(email));
  };

  const handleBackToLogin = () => {
    dispatch(resetAuthState());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">
            {passwordResetRequested
              ? "We've sent a password reset OTP to your email"
              : "Enter your email to receive a password reset OTP"}
          </p>
        </div>

        {(error || errors.message) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || errors.message}</AlertDescription>
          </Alert>
        )}

        {passwordResetRequested ? (
          <div className="space-y-6">
            <Alert className="mb-6">
              <AlertTitle>Check your email!</AlertTitle>
              <AlertDescription>
                We've sent a password reset OTP to {email}. The OTP will expire
                in {import.meta.env.VITE_OTP_EXPIRY_MINUTES || 15} minutes.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => navigate("/reset-password")}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md shadow-sm transition-colors"
            >
              Proceed to Reset Password
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md shadow-sm transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send Reset OTP"
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
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
