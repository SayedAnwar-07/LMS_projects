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
  Star,
  Bookmark,
  Award,
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
import { BackButton } from "../BackButton";
import { Progress } from "@/components/ui/progress";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (token && !user) {
      dispatch(verifyToken())
        .unwrap()
        .then(() => dispatch(fetchUserProfile()))
        .catch(() => {
          navigate("/login");
        });
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role !== "teacher") {
        navigate("/unauthorized");
        return;
      }
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

  const prepareFeaturedData = () => {
    if (!data) return [];

    return [
      { name: "Featured", value: data.total_featured_courses || 0 },
      {
        name: "Regular",
        value: (data.total_courses || 0) - (data.total_featured_courses || 0),
      },
    ];
  };

  if (authLoading || (!user && isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
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
    total_students = 0,
    total_featured_courses = 0,
  } = data;

  const chartData = prepareChartData();
  const featuredData = prepareFeaturedData();
  const featuredPercentage =
    total_courses > 0
      ? Math.round((total_featured_courses / total_courses) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 pb-8 space-y-6">
      <BackButton />

      {/* Header Section with Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={teacher?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white">
              Teacher
            </Badge>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {teacher?.full_name || "Teacher"}!
            </h1>
            <p className="text-muted-foreground">{teacher?.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total_courses}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={100} className="h-2" />
              <span className="text-xs text-muted-foreground">All courses</span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            You're teaching {total_courses} courses
          </CardFooter>
        </Card>

        {/* Total Students Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total_students}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress
                value={Math.min(100, total_students)}
                className="h-2"
                indicatorColor="bg-green-500"
              />
              <span className="text-xs text-muted-foreground">
                Across all courses
              </span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Average:{" "}
            {total_courses > 0 ? Math.round(total_students / total_courses) : 0}{" "}
            students per course
          </CardFooter>
        </Card>

        {/* Featured Courses Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Courses
            </CardTitle>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total_featured_courses}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress
                value={featuredPercentage}
                className="h-2"
                indicatorColor="bg-yellow-500"
              />
              <span className="text-xs text-muted-foreground">
                {featuredPercentage}% of total
              </span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            {total_featured_courses > 0
              ? "Great job!"
              : "Consider featuring some courses"}
          </CardFooter>
        </Card>

        {/* Engagement Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Score
            </CardTitle>
            <Award className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {total_courses > 0
                ? Math.round((total_students / (total_courses * 50)) * 100)
                : 0}
              /100
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress
                value={
                  total_courses > 0
                    ? Math.round((total_students / (total_courses * 50)) * 100)
                    : 0
                }
                className="h-2"
                indicatorColor="bg-purple-500"
              />
              <span className="text-xs text-muted-foreground">
                Based on student enrollment
              </span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            {total_students > 50 ? "Excellent engagement!" : "Keep growing!"}
          </CardFooter>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students per Course Bar Chart */}
        <Card className="h-[350px] border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Students per Course</CardTitle>
                <CardDescription>
                  Distribution of students across your courses
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {total_students} total
              </Badge>
            </div>
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
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="students"
                  fill="#4f46e5"
                  name="Students"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Featured vs Regular Pie Chart */}
        <Card className="h-[350px] border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Course Types</CardTitle>
                <CardDescription>
                  Featured vs regular courses breakdown
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {total_featured_courses} featured
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featuredData}
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
                  {featuredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} courses`, "Count"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2"
        >
          <BookOpen className="h-6 w-6" />
          <span>Create Course</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2"
        >
          <Users className="h-6 w-6" />
          <span>Manage Students</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2"
        >
          <Star className="h-6 w-6" />
          <span>Feature Course</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2"
        >
          <Award className="h-6 w-6" />
          <span>View Analytics</span>
        </Button>
      </div>

      {/* Courses List */}
      <AllStudentsTable courses={allCourses} />
    </div>
  );
};

export default TeacherDashboard;
