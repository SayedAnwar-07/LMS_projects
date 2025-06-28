import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionList from "./SectionList";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse, selectCourse } from "@/redux/features/curriculumSlice";
import { BackButton } from "@/components/BackButton";

const CourseCurriculum = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const course = useSelector(selectCourse);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourse(courseId));
    }
  }, [courseId, dispatch]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="flex flex-col space-y-6 mt-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {course?.title || "Course"} Curriculum
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize your course content
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Sections & Lessons
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Add, edit, and rearrange your course content
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <SectionList courseId={Number(courseId)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCurriculum;
