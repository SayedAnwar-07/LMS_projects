import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchSections,
  selectAllSections,
  selectCurriculumStatus,
  selectCurriculumError,
  deleteSection,
  setCurrentItem,
  clearCurrentItem,
  resetCurriculumState,
  deleteLesson,
  fetchLessons,
} from "@/redux/features/curriculumSlice";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  MoreVertical,
  Clock,
} from "lucide-react";
import SectionForm from "./SectionForm";
import LessonForm from "./LessonForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const SectionList = ({ courseId }) => {
  const dispatch = useDispatch();
  const sections = useSelector(selectAllSections);
  const status = useSelector(selectCurriculumStatus);
  const error = useSelector(selectCurriculumError);
  const [showSectionForm, setShowSectionForm] = React.useState(false);
  const [showLessonForm, setShowLessonForm] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({});

  useEffect(() => {
    const loadCurriculumData = async () => {
      try {
        await dispatch(fetchSections(courseId)).unwrap();
        await dispatch(fetchLessons()).unwrap();
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load curriculum data");
      }
    };

    loadCurriculumData();

    return () => {
      dispatch(resetCurriculumState());
    };
  }, [dispatch, courseId]);

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Failed to fetch sections"
      );
    }
  }, [error]);

  const handleDeleteSection = async (id) => {
    try {
      await dispatch(deleteSection(id)).unwrap();
      toast.success("Section deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete section");
    }
  };

  const handleEditSection = (section) => {
    dispatch(setCurrentItem(section));
    setShowSectionForm(true);
  };

  const handleDeleteLesson = async (id) => {
    try {
      await dispatch(deleteLesson(id)).unwrap();
      toast.success("Lesson deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete lesson");
    }
  };

  const handleEditLesson = (lesson) => {
    dispatch(setCurrentItem(lesson));
    setShowLessonForm(true);
  };

  const handleAddLesson = (sectionId) => {
    dispatch(setCurrentItem({ section: sectionId, course: courseId }));
    setShowLessonForm(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const filteredSections = sections.filter(
    (section) => section.course === Number(courseId)
  );

  if (status === "loading" && sections.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Course Curriculum</h2>
        <Button onClick={() => setShowSectionForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </div>

      {showSectionForm && (
        <SectionForm
          onClose={() => {
            setShowSectionForm(false);
            dispatch(clearCurrentItem());
          }}
          courseId={courseId}
        />
      )}

      {showLessonForm && (
        <LessonForm
          onClose={() => {
            setShowLessonForm(false);
            dispatch(clearCurrentItem());
          }}
        />
      )}

      {filteredSections.length === 0 && status === "succeeded" ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No sections found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first section
          </p>
          <Button className="mt-4" onClick={() => setShowSectionForm(true)}>
            Create Section
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {section.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {section.lectures?.length || 0} lessons
                        {section.total_duration &&
                          ` • ${section.total_duration}`}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSection(section);
                      }}
                    >
                      Edit Section
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                    >
                      Delete Section
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {expandedSections[section.id] && (
                <>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">
                        Section Lessons
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddLesson(section.id)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lesson
                      </Button>
                    </div>

                    {section.lectures?.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="w-[50%]">Lesson</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.lectures.map((lesson) => (
                              <TableRow
                                key={lesson.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium">
                                  {lesson.title}
                                </TableCell>
                                <TableCell>
                                  {lesson.duration || "Not specified"}
                                </TableCell>
                                <TableCell>
                                  {lesson.is_preview ? (
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-800 bg-green-50"
                                    >
                                      Preview
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Regular</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleEditLesson(lesson)}
                                      >
                                        Edit Lesson
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() =>
                                          handleDeleteLesson(lesson.id)
                                        }
                                      >
                                        Delete Lesson
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <h4 className="mt-3 text-sm font-medium text-gray-900">
                          No lessons in this section
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Add lessons to build your curriculum
                        </p>
                        <Button
                          size="sm"
                          className="mt-4"
                          onClick={() => handleAddLesson(section.id)}
                        >
                          Add Lesson
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionList;
