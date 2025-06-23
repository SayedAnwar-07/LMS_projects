"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, Key } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "@/redux/features/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get email from location state or fallback to empty string
  const email = location.state?.email || "";

  // Get auth state from Redux
  const { loading, error, otpVerified } = useSelector((state) => state.auth);

  // Redirect if OTP is already verified
  useEffect(() => {
    if (otpVerified) {
      navigate("/login", { state: { email } });
    }
  }, [otpVerified, navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
    } catch (error) {
      setErrors({ message: error.message || "OTP verification failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {email || "your email"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display (read-only) */}
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
                <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  value={email}
                  readOnly
                />
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <div className="flex flex-col items-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setErrors({});
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <p className="text-sm text-red-600 mt-2">{errors.otp}</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Didn't receive a code?{" "}
              <Button
                variant="link"
                className="text-sm p-0 h-auto"
                onClick={() => navigate("/resend-otp", { state: { email } })}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
