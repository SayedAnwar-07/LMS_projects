import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reviews = ({ rating, reviews }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-xl font-bold mb-4">Student Feedback</h3>
        <div className="flex items-center mb-6">
          <div className="text-5xl font-bold mr-4">{rating}</div>
          <div>
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Course Rating • {reviews} reviews</p>
          </div>
        </div>
        <Button variant="outline">Write a Review</Button>
      </div>
      {/* Reviews list would go here */}
    </div>
  );
};

export default Reviews;
