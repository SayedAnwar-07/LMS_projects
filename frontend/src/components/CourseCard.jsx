import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, BookOpen, Calendar } from "lucide-react";
import { useSelector } from "react-redux";

const CourseCard = ({ course }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login", { state: { from: `/courses/${course.id}` } });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Course Thumbnail */}
      <div className="relative">
        <img
          src={course.banner}
          alt={course.title}
          className="w-full h-56 object-cover"
        />
        {course.is_featured && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Category and Price */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {course.category.title}
          </span>
          <div className="flex items-center">
            {course.discount_price ? (
              <>
                <span className="text-gray-400 line-through text-sm mr-2">
                  ${course.price}
                </span>
                <span className="font-bold text-black">
                  ${course.discount_price}
                </span>
              </>
            ) : (
              <span className="font-bold text-black">${course.price}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">
          By {course.instructor.full_name}
        </p>

        {/* Rating and Students */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-800 ml-1">
              {course.rating}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 ml-1">
              {course.students || 0}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{course.what_you_will_learn.length} topics</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{course.start_date}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/courses/${course.id}`} onClick={handleDetailsClick}>
          <Button className="w-full bg-black hover:bg-gray-800 text-white cursor-pointer">
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
