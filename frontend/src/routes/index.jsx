import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CoursesPage from "../pages/CoursesPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import CourseDetailPage from "../pages/CourseDetailPage";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResendOTP from "../pages/auth/ResendOTP";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import { CreateCourse } from "../components/CreateCourse";
import { UpdateCourse } from "../components/UpdateCourse";
import Unauthorized from "../components/Unauthorized";
import ErrorPage from "../pages/NotFoundPage";
import { Dashboard } from "../layouts/Dashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import PaymentPage from "../pages/PaymentPage";
import CourseCurriculum from "../components/dashboard/modules/CourseCurriculum";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const AppRoutes = () => (
  <Routes>
    {/* Public Pages */}
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />

      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/profile/me" element={<ProfilePage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/resend-otp" element={<ResendOTP />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/payments/:courseId" element={<PaymentPage />} />
    </Route>

    {/* Protected Dashboard Routes */}
    <Route path="/dashboard" element={<Dashboard />}>
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="create" element={<CreateCourse />} />
        <Route path="courses/:courseId/edit" element={<UpdateCourse />} />

        <Route
          path="courses/:courseId/curriculum"
          element={<CourseCurriculum />}
        />
      </Route>
    </Route>

    {/* Fallback Routes */}
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default AppRoutes;
