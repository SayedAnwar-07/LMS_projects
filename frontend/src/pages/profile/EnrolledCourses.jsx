import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserEnrollments,
  selectEnrollments,
  selectEnrollmentsLoading,
  selectEnrollmentsError,
} from "@/redux/features/enrolledSlice";
import {
  checkEnrollmentStatus,
  selectEnrollmentChecking,
  selectIsEnrolled,
} from "@/redux/features/paymentSlice";
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  AlertCircle,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Curriculum from "@/components/details/Curriculum";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const enrollments = useSelector(selectEnrollments);
  const loading = useSelector(selectEnrollmentsLoading);
  const error = useSelector(selectEnrollmentsError);
  const isEnrolled = useSelector(selectIsEnrolled);
  const enrollmentChecking = useSelector(selectEnrollmentChecking);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    dispatch(fetchUserEnrollments());
  }, [dispatch]);

  const toggleCourseExpand = (courseId) => {
    if (!expandedCourse || expandedCourse !== courseId) {
      dispatch(checkEnrollmentStatus(courseId));
    }
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (loading || enrollmentChecking) {
    return (
      <div className="flex flex-col gap-4 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Error loading courses</h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Please try again later"}
        </p>
        <Button
          variant="outline"
          onClick={() => dispatch(fetchUserEnrollments())}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">No enrolled courses</h3>
        <p className="text-gray-600 mb-4">
          Get started by exploring our courses
        </p>
        <Link to="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

      <div className="grid grid-cols-1 gap-4">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="border rounded-lg overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Course Thumbnail */}
              <div className="relative w-full md:w-1/3 lg:w-1/4 h-48 bg-gray-100">
                {enrollment.course.banner && (
                  <img
                    src={`http://127.0.0.1:8000${enrollment.course.banner}`}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-12 h-12 bg-white/90 hover:bg-white"
                    asChild
                  >
                    <Link>
                      <Play className="w-5 h-5 text-blue-600 fill-blue-600" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      {enrollment.course.title}
                    </h2>
                    <div className="flex gap-2 mb-3">
                      <Badge
                        variant={enrollment.is_active ? "default" : "secondary"}
                      >
                        {enrollment.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge
                        variant={
                          enrollment.is_completed ? "default" : "secondary"
                        }
                      >
                        {enrollment.is_completed
                          ? "Completed"
                          : `${enrollment.progress}% Complete`}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCourseExpand(enrollment.course.id)}
                    className="text-gray-500"
                  >
                    {expandedCourse === enrollment.course.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <Progress
                    value={enrollment.progress}
                    className="h-2"
                    indicatorClassName={
                      enrollment.progress === 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }
                  />
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Enrolled{" "}
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{enrollment.course.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCourse === enrollment.course.id && (
              <div className="border-t p-4 bg-gray-50">
                {isEnrolled ? (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded mb-4">
                      <Check className="w-5 h-5" />
                      <span>You have full access to this course</span>
                    </div>
                    <Curriculum
                      curriculum={enrollment.course.curriculum}
                      duration={enrollment.course.duration}
                      lessons={enrollment.course.lessons_count}
                      enrollmentId={enrollment.id}
                      courseId={enrollment.course.id}
                    />
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mb-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                    <h4 className="font-medium mb-1">
                      Complete your enrollment
                    </h4>
                    <p className="text-gray-600 mb-3">
                      Access all course materials by completing your enrollment
                    </p>
                    <Button size="sm">Complete Enrollment</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
