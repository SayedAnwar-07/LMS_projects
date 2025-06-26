"use client";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Phone,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState } from "@/redux/features/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters"),
    full_name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    mobile_no: z
      .string()
      .min(10, "Mobile number must be at least 11 digits")
      .max(15, "Mobile number must be less than 15 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    password2: z.string(),
    role: z.enum(["student", "teacher"]),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      mobile_no: "",
      password: "",
      password2: "",
      role: "student",
      avatar: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [imgURL, setImgURL] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const imgbbApiKey = "7d08988bd7149e734475cafb1b06041c";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { loading, error, registrationSuccess } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (registrationSuccess) {
      navigate("/verify-otp", { state: { email: watch("email") } });
    }
  }, [registrationSuccess, navigate, watch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgbb = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploadingImage(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      setImgURL(res.data.data.url);
      setValue("avatar", res.data.data.url);
      return res.data.data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("root", {
        type: "server",
        message: "Failed to upload profile picture",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadToImgbb();
        if (!imageUrl) return;
      } else {
        imageUrl =
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
      }

      const payload = {
        ...data,
        avatar: imageUrl,
      };

      
      await dispatch(registerUser(payload)).unwrap();
    } catch (error) {
      if (error?.errors) {
        Object.keys(error.errors).forEach((key) => {
          setError(key, {
            type: "server",
            message: error.errors[key],
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: error?.message || "Registration failed",
        });
      }
    }
  };
  return (
    <div className="bg-white flex items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join us to start learning</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture (optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">
                  Choose File
                </span>
                <input
                  type="file"
                  name="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {uploadingImage && (
              <p className="text-sm text-gray-500">Uploading image...</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="full_name"
                {...register("full_name")}
                type="text"
                placeholder="John Doe"
                className="pl-10 w-full"
              />
            </div>
            {errors.full_name && (
              <p className="text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="username"
                {...register("username")}
                type="text"
                placeholder="johndoe"
                className="pl-10 w-full"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
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
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="pl-10 w-full"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label
              htmlFor="mobile_no"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="mobile_no"
                {...register("mobile_no")}
                type="tel"
                placeholder="+1234567890"
                className="pl-10 w-full"
              />
            </div>
            {errors.mobile_no && (
              <p className="text-sm text-red-600">{errors.mobile_no.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              I am a
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                {...register("role")}
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password2"
                {...register("password2")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password2 && (
              <p className="text-sm text-red-600">{errors.password2.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md shadow-sm transition-colors mt-4"
            disabled={loading || uploadingImage}
          >
            {loading || uploadingImage
              ? uploadingImage
                ? "Uploading image..."
                : "Creating account..."
              : "Create Account"}
          </Button>

          {(error || errors.root) && (
            <div className="text-sm text-red-600 text-center">
              {error || errors.root.message}
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
