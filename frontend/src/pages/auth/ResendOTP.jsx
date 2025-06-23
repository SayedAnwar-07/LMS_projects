"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resendOTP } from "@/redux/features/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResendOTP = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get auth state from Redux
  // eslint-disable-next-line no-unused-vars
  const { loading, error, otpSent } = useSelector((state) => state.auth);

  // Set email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      const result = await dispatch(resendOTP(email)).unwrap();
      setSuccessMessage(result.message || "OTP resent successfully");
      setErrors({});
    } catch (error) {
      setErrors({ message: error.message || "Failed to resend OTP" });
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Resend Verification Code
          </CardTitle>
          <CardDescription>
            Enter your email to receive a new verification code
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 w-full"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <Alert>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Resend Code"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remembered your code?{" "}
              <Button
                variant="link"
                className="text-sm p-0 h-auto"
                onClick={() => navigate("/verify-otp", { state: { email } })}
              >
                Verify now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResendOTP;
