import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCourseProgress,
  markLessonCompleted,
  selectCurrentCourseProgress,
  selectProgressLoading,
  selectProgressError,
  selectMarkingStatus,
} from "@/redux/features/progressSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Check, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ProgressTracker = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const progress = useSelector(selectCurrentCourseProgress);
  const loading = useSelector(selectProgressLoading);
  const error = useSelector(selectProgressError);
  const markingStatus = useSelector(selectMarkingStatus);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseProgress(courseId));
    }
  }, [courseId, dispatch]);

  const handleLessonComplete = (lessonId) => {
    if (progress?.enrollment_id) {
      dispatch(
        markLessonCompleted({
          enrollmentId: progress.enrollment_id,
          lessonId,
        })
      );
    }
  };

  const handleStartLearning = () => {
    // Find the first incomplete lesson or default to first lesson
    const nextLesson =
      progress?.lessons?.find((lesson) => !lesson.is_completed) ||
      progress?.lessons?.[0];

    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {error.message || "Failed to load progress"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Progress Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You haven't started this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Progress</span>
          <Badge
            variant={progress.is_course_completed ? "success" : "secondary"}
          >
            {progress.is_course_completed ? "Completed" : "In Progress"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              {progress.progress_percentage}% Complete
            </span>
            <span className="text-sm text-gray-500">
              {progress.completed_lessons} of {progress.total_lessons} lessons
            </span>
          </div>
          <Progress value={progress.progress_percentage} className="h-3" />
        </div>

        {/* Start/Continue Button */}
        <Button
          onClick={handleStartLearning}
          className="w-full"
          disabled={markingStatus === "marking"}
        >
          {progress.progress_percentage > 0 ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Start Learning
            </>
          )}
        </Button>

        {/* Lessons List */}
        <div className="space-y-2">
          <h3 className="font-medium">Lessons</h3>
          <div className="space-y-1">
            {progress.lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-3 rounded-md ${
                  lesson.is_completed ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {lesson.is_completed ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Play className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={lesson.is_completed ? "text-green-700" : ""}>
                    {lesson.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLessonComplete(lesson.id)}
                  disabled={markingStatus === "marking" || lesson.is_completed}
                >
                  {lesson.is_completed ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
