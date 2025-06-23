import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "hello@learnify.com",
      action: "Send a message",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      action: "Call now",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "123 Education St, San Francisco, CA",
      action: "Get directions",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Hours",
      details: "Mon-Fri: 9am-5pm PST",
      action: "",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions? We're here to help! Reach out to our team anytime.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-black p-2 rounded-full text-white mr-4">
                {method.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900">
                {method.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{method.details}</p>
            {method.action && (
              <Button variant="outline" className="w-full">
                {method.action}
              </Button>
            )}
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <Input id="phone" type="tel" placeholder="+1 (___) ___-____" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Your message here..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-16 rounded-xl overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 w-full h-96">
          {/* Replace with your actual map component or iframe */}
          <div className="flex items-center justify-center h-full text-gray-500">
            <MapPin className="h-12 w-12" />
            <span className="ml-2">Interactive Map Location</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
