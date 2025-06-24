import React from "react";
import { Search, BookOpen, FileText, ShoppingCart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Your Perfect Course",
    description:
      "Browse our extensive catalog of courses using smart filters to find exactly what matches your learning goals and skill level.",
    icon: <Search className="w-5 h-5 text-primary" />,
  },
  {
    number: "02",
    title: "Create Your Learning Account",
    description:
      "Sign up in seconds to access your personalized dashboard where you can track progress and save favorite courses.",
    icon: <BookOpen className="w-5 h-5 text-primary" />,
  },
  {
    number: "03",
    title: "Experience a Free Preview",
    description:
      "Try a sample lesson from any course to ensure the teaching style and content meet your expectations before committing.",
    icon: <FileText className="w-5 h-5 text-primary" />,
  },
  {
    number: "04",
    title: "Enroll and Start Learning",
    description:
      "Complete your secure purchase and gain immediate access to all course materials, resources, and community features.",
    icon: <ShoppingCart className="w-5 h-5 text-primary" />,
  },
];

export default function OurProcess() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Our Process
          </h2>
        </div>

        <div className="relative">
          {/* Vertical timeline line - hidden on mobile, shown on md+ */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full" />

          <div className="space-y-8 sm:space-y-12 md:space-y-20 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center justify-between relative`}
              >
                {/* Step Content */}
                <div className="w-full md:w-5/12 mb-4 md:mb-0">
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-gray-800 font-bold text-lg sm:text-xl">
                      Step {step.number}
                    </h3>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-700">
                      {step.title}
                    </h4>
                    <hr className="mb-4 border-gray-300 w-60 mx-auto md:mx-0" />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start items-center sm:items-start">
                      <span className="bg-white text-black border border-gray-300 p-2 sm:p-3 rounded-full flex-shrink-0">
                        {step.icon}
                      </span>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dot on center timeline - hidden on mobile, shown on md+ */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-800 border-4 border-white z-10" />

                {/* Mobile only dot */}
                <div className="md:hidden w-4 h-4 rounded-full bg-gray-800 border-2 border-white my-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
