import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewResponse } from "@/redux/features/reviewSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const responseFormSchema = z.object({
  response_text: z.string().min(10, "Response must be at least 10 characters"),
});

const ReviewResponse = ({ response, reviewId, onCancel }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(!response);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      response_text: response?.response_text || "",
    },
  });

  const onSubmit = (values) => {
    dispatch(createReviewResponse({ reviewId, responseData: values }))
      .unwrap()
      .then(() => {
        toast.success("Response posted successfully!");
        setIsEditing(false);
        onCancel?.();
      })
      .catch((error) => {
        toast.error(error.message || "Failed to post response");
      });
  };

  if (response) {
    return (
      <Card className="ml-10 mt-2 border-l-4 border-primary">
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={response.instructor.avatar} />
              <AvatarFallback>
                {response.instructor.full_name?.charAt(0) ||
                  response.instructor.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">
                {response.instructor.full_name || response.instructor.username}
                <span className="text-sm text-primary ml-2">Instructor</span>
              </h4>
              <p className="text-sm text-gray-500">
                {new Date(response.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{response.response_text}</p>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="ml-10 mt-2">
          <CardContent className="p-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Response
              </label>
              <Textarea
                placeholder="Write your response to this review"
                rows={3}
                {...register("response_text")}
                className={errors.response_text ? "border-red-500" : ""}
              />
              {errors.response_text && (
                <span className="text-sm text-red-500">
                  {errors.response_text.message}
                </span>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  onCancel?.();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Post Response
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }

  return null;
};

export default ReviewResponse;
