import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  fetchCategories,
  selectAllCourses,
  selectAllCategories,
  selectCourseLoading,
  selectCourseError,
} from "@/redux/features/courseSlice";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/BackButton";

const CoursesPage = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);

  const levels = [
    { id: "all", name: "All Levels" },
    { id: "Beginner", name: "Beginner" },
    { id: "Intermediate", name: "Intermediate" },
    { id: "Advanced", name: "Advanced" },
  ];

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch courses when filters change
  useEffect(() => {
    const params = {
      search: searchTerm,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      level: selectedLevel !== "all" ? selectedLevel : undefined,
    };
    dispatch(fetchCourses(params));
  }, [dispatch, searchTerm, selectedCategory, selectedLevel]);

  // Format categories for dropdown
  const formattedCategories = [
    { id: "all", name: "All Categories" },
    ...(categories?.map((cat) => ({ id: String(cat.id), name: cat.name })) ||
      []),
  ];

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse Our Courses
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the perfect course to advance your skills and career. Choose
          from our wide range of topics and levels.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-1">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {formattedCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-500 mb-2">
            Error loading courses
          </h3>
          <p className="text-gray-500">
            {error.message || "Please try again later"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => dispatch(fetchCourses())}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && (
        <>
          {courses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;
