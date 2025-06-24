// components/common/BackButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackButton = ({
  className = "",
  variant = "outline",
  text = "Go Back",
  iconClassName = "h-4 w-4 mr-2",
  size = "default",
}) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      onClick={() => navigate(-1)}
      className={`group hover:shadow-sm transition-all cursor-pointer ${className}`}
      size={size}
    >
      <ChevronLeft
        className={`${iconClassName} group-hover:-translate-x-1 transition-transform`}
      />
      <span className="font-medium">{text}</span>
    </Button>
  );
};
