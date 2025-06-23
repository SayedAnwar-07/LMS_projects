"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Search, Menu, User, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  logout,
  verifyToken,
} from "@/redux/features/authSlice";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !isAuthenticated && !user) {
      dispatch(verifyToken());
    }
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white text-black shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Mobile Menu Button - Left Side */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            to="/"
            className="text-xl font-bold hover:text-gray-600 transition-colors"
          >
            BrandLogo
          </Link>
        </div>

        {/* Menu Items - Center - Hidden on mobile */}
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `hover:text-gray-600 transition-colors text-sm font-medium pb-1 ${
                  isActive ? "border-b border-gray-800" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Search and Login/User - Right Side */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 border-gray-300 text-black placeholder-gray-500 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          {loading ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-100 p-1"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Only show Dashboard if user is not a student */}
                {user?.role !== "student" && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile/me"
                    className="flex items-center w-full cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="bg-black hover:bg-gray-800 border-black text-white hover:text-gray-100 hidden sm:block"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu - Shows on small screens */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="py-2 hover:text-gray-600 transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="relative py-2">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 border-gray-300 text-black placeholder-gray-500 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
            </div>
            {isAuthenticated ? (
              <>
                {/* Only show Dashboard if user is not a student in mobile menu */}
                {user?.role !== "student" && (
                  <Link
                    to="/dashboard"
                    className="py-2 hover:text-gray-600 transition-colors text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="py-2 hover:text-gray-600 transition-colors text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="outline"
                  className="bg-black hover:bg-gray-800 border-black text-white w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="bg-black hover:bg-gray-800 border-black text-white w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
