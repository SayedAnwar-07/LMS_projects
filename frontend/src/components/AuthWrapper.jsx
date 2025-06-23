"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, fetchUserProfile } from "@/redux/features/authSlice";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, initialized } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !isAuthenticated) {
      dispatch(verifyToken())
        .unwrap()
        .then(() => {
          // Only fetch profile if user data isn't already available
          if (!user) {
            dispatch(fetchUserProfile());
          }
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        });
    } else if (!token) {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  if ((loading && !user) || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700" />
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
