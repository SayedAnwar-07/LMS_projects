import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseReviews } from "@/redux/features/reviewSlice";
import {
  checkEnrollmentStatus,
  selectEnrollmentChecking,
  selectIsEnrolled,
} from "@/redux/features/paymentSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Check, Pencil, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ReviewForm from "./ReviewForm";

const ReviewList = ({ courseId }) => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  const isEnrolled = useSelector(selectIsEnrolled);
  const enrollmentChecking = useSelector(selectEnrollmentChecking);

  useEffect(() => {
    dispatch(fetchCourseReviews(courseId));
    dispatch(checkEnrollmentStatus(courseId));
  }, [courseId, dispatch]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingDistribution[review.rating - 1]++;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 pt-4 border-t">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h3 className="text-lg font-medium">Failed to load reviews</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchCourseReviews(courseId))}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Student Reviews</CardTitle>
              <CardDescription className="mt-2">
                {reviews.length} reviews • Average: {averageRating.toFixed(1)}{" "}
                <Star className="inline h-4 w-4 fill-yellow-400 text-yellow-400" />
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </CardHeader>

        <hr className="text-gray-500" />
        {/* review lists */}
        <CardContent className="grid gap-6 bg-gray-50 border mx-4 rounded-lg">
          {reviews.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto bg-muted/50 p-4 rounded-full w-fit">
                <Pencil className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your experience
              </p>
              <Button variant="outline" className="mt-4">
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div>
                  <div key={review.id} className="flex gap-5 py-4 rounded-lg">
                    <Avatar className="h-12 w-12 border-2 border-muted">
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback className="font-medium">
                        {review.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {review.user.full_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {user?.id === review.user.id && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground/90 my-4">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {user?.role === "student" && (
        <Card>
          <CardHeader>
            <CardTitle>Share your experience</CardTitle>
            <CardDescription>
              {enrollmentChecking
                ? "Verifying your enrollment..."
                : isEnrolled
                ? "Your review helps others make better decisions"
                : "You need to enroll in this course to leave a review"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentChecking ? (
              <Button className="w-full" disabled>
                Checking enrollment...
              </Button>
            ) : isEnrolled ? (
              <ReviewForm courseId={courseId} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm">
                    You must enroll in this course before leaving a review
                  </p>
                </div>
                <Link to={`/payments/${courseId}`} className="block">
                  <Button className="w-full">Enroll Now</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewList;
