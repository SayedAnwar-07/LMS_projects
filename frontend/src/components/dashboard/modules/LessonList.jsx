import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchLessons,
  selectLessonsBySectionId,
  selectCurrentItem,
  selectCurriculumStatus,
  selectCurriculumError,
  deleteLesson,
  setCurrentItem,
  clearCurrentItem,
} from "@/redux/features/curriculumSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle, FileText, RefreshCw } from "lucide-react";
import LessonForm from "./LessonForm";
import { Skeleton } from "@/components/ui/skeleton";

const LessonList = ({ sectionId, courseId }) => {
  const dispatch = useDispatch();
  const lessons = useSelector((state) =>
    selectLessonsBySectionId(sectionId)(state)
  );

  const status = useSelector(selectCurriculumStatus);
  const error = useSelector(selectCurriculumError);
  const currentItem = useSelector(selectCurrentItem);
  const [showForm, setShowForm] = React.useState(false);

  useEffect(() => {
    if (!showForm && currentItem) {
      dispatch(clearCurrentItem());
    }
  }, [showForm, currentItem, dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLesson(id)).unwrap();
      toast.success("Lesson deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete lesson");
    }
  };

  const handleEdit = (lesson) => {
    dispatch(setCurrentItem(lesson));
    setShowForm(true);
  };

  const handleAddLesson = () => {
    dispatch(
      setCurrentItem({
        section: sectionId,
        course: courseId,
        title: "",
        description: "",
        video: "",
        duration: "00:00",
        is_preview: false,
      })
    );
    setShowForm(true);
  };

  useEffect(() => {
    dispatch(fetchLessons());
  }, [dispatch, sectionId]);

  const handleRefresh = () => {
    dispatch(fetchLessons());
  };

  // Loading state
  if (status === "loading" && lessons.length === 0) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (error && lessons.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-red-50">
        <div className="text-red-500 font-medium">Error loading lessons</div>
        <p className="text-sm text-red-600 mt-1">
          {typeof error === "string" ? error : error.message}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={handleRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lessons</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={status === "loading"}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                status === "loading" ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddLesson}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
          </Button>
        </div>
      </div>

      {showForm && (
        <LessonForm
          onClose={() => setShowForm(false)}
          onSaved={() => dispatch(fetchLessons())}
        />
      )}

      {lessons.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <FileText className="mx-auto h-10 w-10 text-gray-400" />
          <h4 className="mt-2 text-sm font-medium">No lessons found</h4>
          <p className="text-xs text-gray-500 mt-1">
            This section doesn't have any lessons yet
          </p>
          <Button size="sm" className="mt-3" onClick={handleAddLesson}>
            Create First Lesson
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.duration || "Not specified"}</TableCell>
                  <TableCell>
                    {lesson.is_preview ? (
                      <Badge variant="success">Preview</Badge>
                    ) : (
                      <Badge variant="secondary">Regular</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lesson)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LessonList;
