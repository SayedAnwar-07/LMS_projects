import FeaturedCourses from "@/components/home/FeaturedCourses";
import Hero from "@/components/home/Hero";
import OurProcess from "@/components/home/OurProcess";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCourses />
      <OurProcess />
    </div>
  );
};

export default Home;
