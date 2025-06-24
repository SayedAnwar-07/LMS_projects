import React from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Users, BookOpen, Award } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const AboutPage = () => {
  const stats = [
    {
      value: "10,000+",
      label: "Students Enrolled",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: "50+",
      label: "Expert Instructors",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      value: "100+",
      label: "Courses Available",
      icon: <Award className="h-6 w-6" />,
    },
    {
      value: "95%",
      label: "Satisfaction Rate",
      icon: <Rocket className="h-6 w-6" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
       <BackButton/>
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Our Learning Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering learners worldwide with high-quality education and
          cutting-edge skills.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            We believe education should be accessible, engaging, and
            transformative. Our mission is to break down barriers to learning by
            providing high-quality courses taught by industry experts.
          </p>
          <p className="text-gray-600 mb-6">
            Whether you're looking to advance your career, explore new
            interests, or develop professional skills, we have the perfect
            learning path for you.
          </p>
          <Button className="bg-black hover:bg-gray-800">
            Explore Courses
          </Button>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img
            src="https://www.workitdaily.com/media-library/happy-employees-on-a-successful-team.jpg?id=30117495&width=1245&height=700&quality=85&coordinates=0%2C66%2C0%2C28"
            alt="Team working together"
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 rounded-xl p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center text-black mb-3">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              image:
                "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            },
            {
              name: "Sarah Miller",
              role: "Head of Education",
              image:
                "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=",
            },
            {
              name: "Michael Chen",
              role: "Lead Instructor",
              image:
                "https://media.istockphoto.com/id/1443627298/photo/half-length-portrait-of-successful-male-boss-dressed-in-elegant-suit-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=eHSZdO4IeOi5luzCi4BqitGDz5IZNuJsiD0tJz3NT4w=",
            },
            {
              name: "Emily Wilson",
              role: "Student Success",
              image:
                "https://t4.ftcdn.net/jpg/09/58/01/67/360_F_958016762_lSM8nLIicfKIlAzpEMCmQkWnflFDrEfO.jpg",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-60 w-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
