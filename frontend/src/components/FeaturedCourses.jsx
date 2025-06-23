import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  selectAllCourses,
  selectCourseLoading,
  selectCourseError,
} from "../redux/features/courseSlice";
import CourseCard from "../components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedCourses = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);

  useEffect(() => {
    dispatch(
      fetchCourses({
        is_featured: true,
        limit: 4,
      })
    );
  }, [dispatch]);

  if (error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          Error loading courses: {error.message || "Please try again later"}
        </div>
      </div>
    );

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Courses
            </h2>
            <p className="text-gray-600">
              Start learning with our most popular courses
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses" className="flex items-center">
              View all courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses?.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">No featured courses available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
