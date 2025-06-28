import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReview,
  voteReview,
  clearCurrentReview,
} from "@/redux/features/reviewSlice";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import ReviewResponse from "./ReviewResponse";
import ReviewForm from "./ReviewForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const ReviewItem = ({ review, userId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleVote = (isHelpful) => {
    dispatch(voteReview({ reviewId: review.id, isHelpful }));
  };

  const handleDelete = () => {
    dispatch(deleteReview(review.id));
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    dispatch(clearCurrentReview());
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={review.user.avatar} />
              <AvatarFallback>
                {review.user.full_name?.charAt(0) ||
                  review.user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">
                {review.user.full_name || review.user.username}
              </h4>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  {review.rating}.0
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <ReviewForm
              courseId={review.course.id}
              reviewToEdit={review}
              onCancel={handleCancelEdit}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <>
              <h3 className="font-semibold mb-2">{review.title}</h3>
              <p className="text-gray-700">{review.comment}</p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-0">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(true)}
              className="flex items-center space-x-1"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{review.helpful_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(false)}
              className="flex items-center space-x-1"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{review.not_helpful_count}</span>
            </Button>
          </div>

          <div className="flex space-x-2">
            {review.user.id === userId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-gray-600 hover:text-primary"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-gray-600 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}

            {user?.role === "teacher" && !review.response && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponseForm(true)}
                className="text-gray-600 hover:text-primary"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Respond
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {review.response && <ReviewResponse response={review.response} />}

      {showResponseForm && (
        <ReviewResponse
          reviewId={review.id}
          onCancel={() => setShowResponseForm(false)}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewItem;
