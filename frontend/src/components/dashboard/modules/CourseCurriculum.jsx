import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SectionList from "./SectionList";

const CourseCurriculum = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="rounded-full p-2 mr-4 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Curriculum
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
