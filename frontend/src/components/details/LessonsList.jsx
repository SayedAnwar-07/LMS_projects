import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLessons,
  selectAllLessons,
  selectCurriculumStatus,
  selectCurriculumError,
  selectLessonsBySectionId,
} from "@/redux/features/curriculumSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Lock, Check } from "lucide-react";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { selectIsEnrolled } from "@/redux/features/paymentSlice";

const LessonsList = ({ sectionId }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectCurriculumStatus);
  const error = useSelector(selectCurriculumError);
  const allLessons = useSelector(selectAllLessons);
  const sectionLessons = useSelector((state) =>
    sectionId ? selectLessonsBySectionId(sectionId)(state) : null
  );
  // eslint-disable-next-line no-unused-vars
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isEnrolled = useSelector(selectIsEnrolled);

  const lessons = sectionId ? sectionLessons : allLessons;
  const safeLessons = Array.isArray(lessons) ? lessons : [];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLessons());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => dispatch(fetchLessons())}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sectionId ? "Section Lessons" : "All Lessons"}</CardTitle>
        <CardDescription>
          {sectionId ? "Lessons in this section" : "All available lessons"}
        </CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        {safeLessons.length === 0 ? (
          <p>No lessons found</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {safeLessons.map((lesson) => {
              const isLocked = !isEnrolled && !lesson.isPreview;
              return (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger className="hover:no-underline px-4 py-3 border rounded-lg mb-2">
                    <div className="flex items-center space-x-3 w-full">
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Play className="h-4 w-4 text-gray-500" />
                      )}
                      <div className="flex-1 text-left">
                        <h3
                          className={`font-medium ${
                            isLocked ? "text-gray-400" : ""
                          }`}
                        >
                          {lesson.title}
                        </h3>
                        {isEnrolled && (
                          <span className="text-xs text-green-600 mt-1 block">
                            <Check className="h-3 w-3 inline mr-1" />
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2 space-y-2">
                    <p
                      className={`text-sm ${
                        isLocked ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {lesson.description}
                    </p>
                    <p
                      className={`text-sm ${
                        isLocked ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Duration: {lesson.duration}
                    </p>
                    {isLocked && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Enroll to unlock
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </Card>
  );
};

export default LessonsList;
