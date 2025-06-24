import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPaymentDetails,
  resetPaymentState,
  selectCourseDetails,
  selectPaymentLoading,
  selectPaymentError,
  clearPaymentErrors,
  selectIsEnrolled,
} from "../redux/features/paymentSlice";
import PaymentForm from "./PaymentForm";
import { toast } from "react-toastify";
import { BackButton } from "@/components/BackButton";

const stripePromise = loadStripe(
  "pk_test_51RbwOQDCq52O5K5oOP8pYDX4KLNbsvlu3kYXlL8O8TiJP18uXBF5mvxP2eJXiSnYvFL5Uc55sJpkq0mgyLmUQPiU00r4hGQmGs"
);

const PaymentPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courseDetails = useSelector(selectCourseDetails);
  const loading = useSelector(selectPaymentLoading);
  const error = useSelector(selectPaymentError);
  const isEnrolled = useSelector(selectIsEnrolled);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchPaymentDetails(courseId));
    }

    return () => {
      dispatch(resetPaymentState());
    };
  }, [courseId, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Payment loading error:", error);
      toast.error(error.message || "Failed to load payment details");
      dispatch(clearPaymentErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isEnrolled || courseDetails?.already_enrolled) {
      navigate(`/courses/${courseId}`);
    }
  }, [isEnrolled, courseDetails, courseId, navigate]);

  if (loading || !courseDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-lg">Preparing your payment...</p>
      </div>
    );
  }

  if (!courseDetails.client_secret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">
          Payment details not available. Please try again.
        </p>
        <Button onClick={() => dispatch(fetchPaymentDetails(courseId))}>
          Retry
        </Button>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#6366f1",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      fontFamily: "Inter, system-ui, sans-serif",
    },
  };

  const options = {
    clientSecret: courseDetails.client_secret,
    appearance,
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          courseDetails={{
            ...courseDetails,
            course_title: courseDetails.title,
            amount: courseDetails.price,
            discount_amount: courseDetails.discount_price,
            final_amount: courseDetails.discount_price || courseDetails.price,
          }}
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
