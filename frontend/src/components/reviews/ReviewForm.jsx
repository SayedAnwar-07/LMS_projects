import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createReview, updateReview } from "@/redux/features/reviewSlice";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const reviewFormSchema = z.object({
  comment: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1).max(5),
  has_attended: z.boolean().default(true),
});

const ReviewForm = ({ courseId, reviewToEdit, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.reviews);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      comment: reviewToEdit?.comment || "",
      rating: reviewToEdit?.rating || 0,
      has_attended: reviewToEdit?.has_attended || true,
    },
  });

  useEffect(() => {
    if (success) {
      toast.success(
        reviewToEdit
          ? "Review updated successfully!"
          : "Review submitted successfully!"
      );
      reset();
      onSuccess?.();
    }
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [success, error, reset, onSuccess, reviewToEdit]);

  const onSubmit = (data) => {
    if (reviewToEdit) {
      dispatch(updateReview({ reviewId: reviewToEdit.id, reviewData: data }));
    } else {
      dispatch(createReview({ courseId, reviewData: data }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= (hoverRating || watch("rating"))
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setValue("rating", star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {watch("rating") || 0}.0
          </span>
        </div>
        {errors.rating && (
          <span className="text-sm text-red-500">{errors.rating.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Review
        </label>
        <Textarea
          placeholder="Share your experience with this course"
          rows={4}
          {...register("comment")}
          className={errors.comment ? "border-red-500" : ""}
        />
        {errors.comment && (
          <span className="text-sm text-red-500">{errors.comment.message}</span>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => reset())}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {reviewToEdit ? "Updating..." : "Submitting..."}
            </span>
          ) : reviewToEdit ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
