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
                  src={selectedCourse.banner}
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
                      src={selectedCourse.instructor.avatar}
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
                  src={selectedCourse.banner}
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
              {/* Share options */}
              <div className="p-6 border-t">
                <h3 className="font-bold mb-3">Share this course</h3>
                <div className="flex space-x-2">
                  {/* WhatsApp */}
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://wa.me/?text=Check out this course: ${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-green-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#25D366"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </Button>

                  {/* Facebook */}
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-blue-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#1877F2"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                  </Button>

                  {/* Twitter */}
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=Check out this course: ${encodeURIComponent(
                        selectedCourse.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-blue-50"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#1DA1F2"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </Button>

                  {/* LinkedIn */}
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-blue-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="#0077B5"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </Button>

                  {/* Email */}
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`mailto:?subject=Check out this course: ${encodeURIComponent(
                        selectedCourse.title
                      )}&body=I thought you might be interested in this course: ${encodeURIComponent(
                        window.location.href
                      )}`}
                      className="hover:bg-gray-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                      </svg>
                    </a>
                  </Button>

                  {/* Copy link */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      // You can add a toast notification here
                    }}
                    className="hover:bg-gray-100"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
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
