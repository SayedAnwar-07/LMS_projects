import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  fetchCategories,
  selectAllCourses,
  selectAllCategories,
  selectCourseLoading,
  selectCourseError,
  selectCoursePagination,
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
import { BackButton } from "@/components/BackButton";
import { Loader2 } from "lucide-react";

const CoursesPage = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);
  const pagination = useSelector(selectCoursePagination);

  const levels = [
    { id: "all", name: "All Levels" },
    { id: "Beginner", name: "Beginner" },
    { id: "Intermediate", name: "Intermediate" },
    { id: "Advanced", name: "Advanced" },
  ];

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const params = {
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        level: selectedLevel !== "all" ? selectedLevel : undefined,
        page: currentPage,
        limit: 16,
      };
      dispatch(fetchCourses(params));
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm, selectedCategory, selectedLevel, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedLevel]);

  const formattedCategories = [
    { id: "all", name: "All Categories" },
    ...(categories?.map((cat) => ({ id: String(cat.id), name: cat.name })) ||
      []),
  ];

  // Handle search with debounce
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <BackButton className="mb-6 hover:bg-gray-100 transition-colors duration-200" />

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
          <div className="md:col-span-1 relative">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-white transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="transition-all hover:border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="animate-pop-in">
                {formattedCategories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="transition-all hover:border-gray-300">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="animate-pop-in">
                {levels.map((level) => (
                  <SelectItem
                    key={level.id}
                    value={level.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
              className="w-full transition-all hover:bg-gray-50 hover:shadow-sm"
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
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 animate-fade-in">
          <h3 className="text-lg font-medium text-red-500 mb-2">
            Error loading courses
          </h3>
          <p className="text-gray-500 mb-4">
            {error.message || "Please try again later"}
          </p>
          <Button
            variant="outline"
            className="mt-4 transition-all hover:bg-gray-50 hover:shadow-sm"
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    className="transition-all hover:scale-[1.02] hover:shadow-md"
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex justify-center mt-8 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="transition-all hover:bg-gray-50 hover:shadow-sm"
                    >
                      Previous
                    </Button>

                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.total_pages - 2) {
                          pageNum = pagination.total_pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            onClick={() => handlePageChange(pageNum)}
                            className="transition-all hover:shadow-sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}

                    <Button
                      variant="outline"
                      disabled={currentPage === pagination.total_pages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="transition-all hover:bg-gray-50 hover:shadow-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                className="transition-all hover:bg-gray-50 hover:shadow-sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;
