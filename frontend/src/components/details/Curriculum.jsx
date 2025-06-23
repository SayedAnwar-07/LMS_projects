import { Play, Download, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { selectIsEnrolled } from "@/redux/features/paymentSlice";
import { toast } from "react-toastify";
import {
  fetchCourseProgress,
  markLessonCompleted,
  markLessonIncomplete,
  selectMarkingStatus,
} from "@/redux/features/progressSlice";
import { fetchUserEnrollments } from "@/redux/features/enrolledSlice";

const Curriculum = ({
  curriculum,
  lessons,
  duration,
  enrollmentId,
  courseId,
}) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEnrolled = useSelector(selectIsEnrolled);
  const markingStatus = useSelector(selectMarkingStatus);

  const handleLessonClick = async (lecture) => {
    if (!isEnrolled || markingStatus === "marking") return;

    const isCurrentlyCompleted = lecture.is_completed;
    const action = isCurrentlyCompleted
      ? markLessonIncomplete
      : markLessonCompleted;

    try {
      await dispatch(
        action({
          enrollmentId,
          lessonId: lecture.id,
        })
      ).unwrap();

      toast.success(
        isCurrentlyCompleted
          ? "Lesson marked as incomplete!"
          : "Lesson marked as completed!"
      );

      dispatch(fetchCourseProgress(courseId));
      dispatch(fetchUserEnrollments());
    } catch (error) {
      toast.error(error.message || "Failed to update progress");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {lessons} lessons • {duration}
        </h3>
        {isEnrolled && (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download all resources
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        {curriculum.map((section, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:no-underline px-4 py-3 bg-white mb-2 border border-gray-200">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium text-left">{section.title}</h3>
                {isEnrolled && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Unlocked
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {section.lectures.map((lecture) => {
                  const isLocked = !isEnrolled && !lecture.isPreview;
                  const isUpdating =
                    markingStatus === "marking" &&
                    markingStatus.lessonId === lecture.id;

                  return (
                    <div
                      key={lecture.id}
                      className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
                        isLocked
                          ? "opacity-75 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${lecture.is_completed ? "bg-green-50" : ""}`}
                      onClick={() => !isLocked && handleLessonClick(lecture)}
                    >
                      <div className="flex items-center">
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-gray-400 mr-3" />
                        ) : lecture.is_completed ? (
                          <Check className="h-4 w-4 text-green-500 mr-3" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-500 mr-3" />
                        )}
                        <span
                          className={`text-left ${
                            isLocked ? "text-gray-400" : ""
                          } ${
                            lecture.is_completed
                              ? "text-green-700 font-medium"
                              : ""
                          }`}
                        >
                          {lecture.title}
                          {isUpdating && " (Updating...)"}
                        </span>
                        {lecture.isPreview && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Preview
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {lecture.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {!isEnrolled && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
          <div className="flex items-start">
            <Lock className="h-5 w-5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">Unlock full course content</h4>
              <p className="text-sm">
                Enroll in this course to access all lectures, resources, and
                certificates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
