import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl/none text-black">
                Unlock Your Potential With Our Expert-Led Courses
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Discover a world of knowledge with our comprehensive courses
                designed to help you master new skills and advance your career.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Courses
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-black text-black hover:bg-gray-100 transition-colors duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <img
                    key={item}
                    src={`https://randomuser.me/api/portraits/${
                      item % 2 === 0 ? "women" : "men"
                    }/${item}0.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">10,000+</span> students already
                learning
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img
                src="https://d35v9chtr4gec.cloudfront.net/uteach/assets/feature-courses-1.webp"
                alt="Hero Image"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-48">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="font-bold text-black">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
