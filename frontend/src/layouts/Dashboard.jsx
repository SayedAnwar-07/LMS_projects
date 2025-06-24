import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Home,
  PlusSquare,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  logout,
  verifyToken,
} from "@/redux/features/authSlice";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/dashboard",
  },
  {
    name: "Home",
    icon: <Home className="h-5 w-5" />,
    path: "/",
  },
  {
    name: "Create Course",
    icon: <PlusSquare className="h-5 w-5" />,
    path: "/dashboard/create",
    show: (user) => user?.role === "teacher",
  },
  {
    name: "Profile",
    icon: <User className="h-5 w-5" />,
    path: "/profile/me",
  },
];

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !isAuthenticated && !user) {
      dispatch(verifyToken());
    }
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.show || item.show(user)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // or redirect to login
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-40 flex flex-col h-full bg-black transition-all duration-300
          ${collapsed ? "w-16" : isMobile ? "w-64" : "w-64"}
        `}
      >
        <div className="flex flex-col h-full p-2">
          {/* Logo & Toggle */}
          <div className="items-center justify-between mb-6 hidden md:flex">
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">The Medhakosh</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300 border border-gray-600 transition-transform duration-300"
              onClick={toggleSidebar}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* User */}
          <div
            className={`flex items-center gap-2 p-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Avatar>
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-gray-600 text-white">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div>
                <h3 className="font-medium text-white">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-300">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-gray-700 my-2" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors w-full ${
                    collapsed ? "justify-center" : "px-3 py-3"
                  } ${
                    isActive
                      ? "bg-white text-gray-900"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                  title={collapsed ? item.name : ""}
                >
                  {item.icon}
                  {!collapsed && item.name}
                </button>
              );
            })}
          </nav>

          <Separator className="bg-gray-700 my-2" />

          {/* Logout */}
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
            title={collapsed ? "Logout" : ""}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Mobile Toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-300 shadow-sm"
          onClick={toggleSidebar}
          style={{
            left: collapsed ? "1rem" : "calc(64px + 1rem)",
            transition: "left 0.3s ease",
          }}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isMobile
            ? collapsed
              ? "ml-16"
              : "ml-64"
            : collapsed
            ? "md:ml-16"
            : "md:ml-64"
        }`}
      >
        <main className="flex-1 p-6">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
