import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Star,
  Users,
  BookOpen,
  Calendar,
  Check,
  Play,
  Download,
  Share2,
  Bookmark,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Curriculum from "@/components/details/Curriculum";
import Reviews from "@/components/details/Reviews";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseById,
  clearSelectedCourse,
} from "@/redux/features/courseSlice";
import {
  checkEnrollmentStatus,
  selectEnrollmentChecking,
  selectIsEnrolled,
} from "@/redux/features/paymentSlice";
import { BackButton } from "@/components/BackButton";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();

  // Get course data from Redux store
  const { selectedCourse, loading, error } = useSelector(
    (state) => state.courses
  );

  const isEnrolled = useSelector(selectIsEnrolled);
  const enrollmentChecking = useSelector(selectEnrollmentChecking);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
    dispatch(checkEnrollmentStatus(courseId));
    return () => {
      dispatch(clearSelectedCourse());
    };
  }, [courseId, dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="lg:w-1/3 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading course: {error}
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Course not found
        </div>
        <Link to="/courses">
          <Button className="mt-4">Browse Courses</Button>
        </Link>
      </div>
    );
  }
  console.log(`http://127.0.0.1:8000${selectedCourse.banner}`);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Main content */}
          <div className="lg:w-2/3">
            {/* Course title and rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCourse.title}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-medium">
                    {selectedCourse.rating} ({selectedCourse.reviews_count}{" "}
                    reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="ml-1">
                    {selectedCourse.enrollments_count?.toLocaleString() || 0}{" "}
                    students
                  </span>
                </div>
                {selectedCourse.is_featured && (
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Video preview */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
              {selectedCourse.banner && (
                <img
                  src={`http://127.0.0.1:8000${selectedCourse.banner}`}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
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

            {/* Instructor section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6 p-6">
              <h3 className="font-bold mb-4">Instructor</h3>
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12 border border-gray-400">
                  {selectedCourse.instructor?.avatar ? (
                    <AvatarImage
                      src={`${import.meta.env.VITE_API_URL}/${
                        selectedCourse.instructor.avatar
                      }`}
                      alt={selectedCourse.instructor.full_name}
                    />
                  ) : (
                    <AvatarFallback>
                      {selectedCourse.instructor?.full_name?.charAt(0) || "I"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {selectedCourse.instructor?.full_name || "Instructor"}
                  </h4>
                  {selectedCourse.instructor?.mobile_no && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedCourse.instructor.mobile_no}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full my-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-3">Description</h2>
                    <p className="text-gray-700">
                      {selectedCourse.description}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3">
                      What You'll Learn
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCourse.what_you_will_learn?.map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {selectedCourse.requirements?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="mt-6">
                <Curriculum
                  curriculum={selectedCourse.curriculum}
                  duration={selectedCourse.duration}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Reviews
                  rating={selectedCourse.rating}
                  reviewsCount={selectedCourse.reviews_count}
                  courseId={selectedCourse.id}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-8">
              <div className="relative rounded-lg">
                <img
                  src={`http://127.0.0.1:8000/${selectedCourse.banner}`}
                  alt={selectedCourse.title}
                  className="w-full h-56 object-cover"
                />
                {selectedCourse.is_featured && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    {/* Featured */}
                  </div>
                )}
              </div>
              {/* Price and enrollment */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {selectedCourse.discount_price ? (
                      <>
                        <span className="text-gray-400 line-through text-lg mr-2">
                          ${selectedCourse.price}
                        </span>
                        <span className="font-bold text-black">
                          ${selectedCourse.discount_price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-black text-lg">
                        ${selectedCourse.price}
                      </span>
                    )}
                  </div>
                </div>

                {enrollmentChecking ? (
                  <Button className="w-full" disabled>
                    Checking enrollment...
                  </Button>
                ) : isEnrolled ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Already Enrolled
                  </Button>
                ) : (
                  <Link to={`/payments/${selectedCourse.id}`}>
                    <Button className="w-full bg-black hover:bg-gray-800">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </div>

              {/* Course details */}
              <div className="p-6 border-b">
                <h3 className="font-bold mb-3">This Course Includes</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Play className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{selectedCourse.duration} on-demand video</span>
                  </li>
                  <li className="flex items-center">
                    <Download className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* Share options */}
              <div className="p-6">
                <h3 className="font-bold mb-3">Share this course</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;
