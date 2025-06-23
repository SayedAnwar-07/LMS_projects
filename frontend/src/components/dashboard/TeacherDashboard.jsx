import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTeacherDashboard,
  selectTeacherData,
  selectDashboardLoading,
  selectDashboardError,
} from "@/redux/features/dashboardSlice";
import {
  verifyToken,
  fetchUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/redux/features/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Loader2,
  BookOpen,
  Users,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AllStudentsTable from "./AllStudentsTable";
import { fetchCourses, selectAllCourses } from "@/redux/features/courseSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth state
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);

  // Dashboard state
  const data = useSelector(selectTeacherData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  const allCourses = useSelector(selectAllCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Check authentication and fetch dashboard data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    // If we have a token but no user data, verify token and fetch profile
    if (token && !user) {
      dispatch(verifyToken())
        .unwrap()
        .then(() => dispatch(fetchUserProfile()))
        .catch(() => {
          navigate("/login");
        });
    }
  }, [dispatch, user, navigate]);

  // Once authenticated, check role and fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect if not teacher
      if (user.role !== "teacher") {
        navigate("/unauthorized");
        return;
      }

      // Fetch dashboard data for teacher
      dispatch(fetchTeacherDashboard());
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  // Prepare chart data
  const prepareChartData = () => {
    if (!data || !data.courses) return [];

    return data.courses.map((course) => ({
      name:
        course.title.length > 10
          ? `${course.title.substring(0, 10)}...`
          : course.title,
      students: course.students || 0,
      assignments: course.assignments || 0,
    }));
  };

  // Prepare pie chart data
  const preparePieData = () => {
    if (!data) return [];

    return [
      { name: "Active Courses", value: data.active_courses || 0 },
      {
        name: "Inactive Courses",
        value: (data.total_courses || 0) - (data.active_courses || 0),
      },
    ];
  };

  // Show loading state while verifying auth
  if (authLoading || (!user && isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Show error if dashboard data fails to load
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => dispatch(fetchTeacherDashboard())}
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show skeleton loading for dashboard data
  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={`stats-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={`courses-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const {
    teacher,
    // eslint-disable-next-line no-unused-vars
    courses = [],
    total_courses = 0,
    active_courses = 0,
    total_students = 0,
  } = data;

  const chartData = prepareChartData();
  const pieData = preparePieData();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {teacher?.full_name || "Teacher"}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_courses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {active_courses} active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_students}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{active_courses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((active_courses / total_courses) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Students per Course</CardTitle>
            <CardDescription>
              Distribution of students across your courses
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#8884d8" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Course Status</CardTitle>
            <CardDescription>Active vs Inactive courses</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex space-x-4">
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Courses List */}
      <AllStudentsTable courses={allCourses} />
    </div>
  );
};

export default TeacherDashboard;
