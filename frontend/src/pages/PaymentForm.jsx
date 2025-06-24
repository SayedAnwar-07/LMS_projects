import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  processCoursePayment,
  selectPaymentProcessing,
  selectPaymentSuccess,
  selectEnrollment,
  fetchPaymentDetails,
} from "../redux/features/paymentSlice";

import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  Shield,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  BookOpen,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";

const PaymentForm = ({ courseDetails }) => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const processing = useSelector(selectPaymentProcessing);
  const success = useSelector(selectPaymentSuccess);
  const enrollment = useSelector(selectEnrollment);

  const [progress, setProgress] = useState(66);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProgress(66);

    if (!stripe || !elements) {
      toast.error("Payment system not ready.");
      setProgress(66);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card details missing");
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(courseDetails.client_secret, {
          payment_method: { card: cardElement },
          return_url: window.location.origin + `/courses/${courseId}`,
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent?.status === "succeeded") {
        const result = await dispatch(
          processCoursePayment({
            courseId: parseInt(courseId),
            payment_intent_id: paymentIntent.id,
          })
        );

        if (processCoursePayment.rejected.match(result)) {
          throw new Error(
            result.payload?.error?.message || "Enrollment failed"
          );
        }

        toast.success("Enrolled successfully!");
        setProgress(100);
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
      setProgress(66);
      dispatch(fetchPaymentDetails(courseId));
    }
  };

  const ProgressSteps = ({ currentStep }) => {
    const steps = [
      { id: 1, label: "Order Details", icon: <BookOpen className="w-4 h-4" /> },
      { id: 2, label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
      {
        id: 3,
        label: "Confirmation",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    ];

    return (
      <div className="w-full mb-8">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gray-800 -translate-y-1/2 transition-all duration-300"
            style={{
              width: `${
                currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%"
              }`,
            }}
          ></div>
          <div className="flex justify-between relative">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= step.id
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm ${
                    currentStep >= step.id
                      ? "text-gray-800 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <ProgressSteps
        currentStep={progress === 33 ? 1 : progress === 66 ? 2 : 3}
      />

      {success && enrollment ? (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gray-50 p-8 text-center border-b border-gray-200">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Confirmed
            </h2>
            <p className="text-gray-600">
              You're now enrolled in{" "}
              <span className="font-medium">{enrollment.course.title}</span>
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Course Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Course Details
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={courseDetails.banner}
                      alt={courseDetails.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      by {courseDetails.instructor.full_name}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                      <span>{courseDetails.duration}</span>
                      <span>{courseDetails.level}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">
                      {formatDate(courseDetails.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">
                      {courseDetails.category.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Payment Receipt
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> Transaction ID
                    </span>
                    <span className="font-mono text-sm">
                      {enrollment.payment_intent_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> Payment Date
                    </span>
                    <span className="font-medium">
                      {formatDate(new Date().toISOString())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Payment Method
                    </span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">
                      Amount Paid
                    </span>
                    <span className="font-bold text-gray-800">
                      ${enrollment.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 h-11 text-white"
              >
                Start Learning Now <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 h-11"
              >
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 py-8">
          <div className="flex flex-col md:flex-row">
            {/* Order Summary */}
            <div className="w-full md:w-1/2 px-8 border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={courseDetails.banner}
                    alt={courseDetails.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {courseDetails.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    by {courseDetails.instructor.full_name}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                    <span>{courseDetails.duration}</span>
                    <span>{courseDetails.level}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-gray-700">
                  Pricing Details
                </h3>
                <div className="space-y-2">
                  {courseDetails.discount_price && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original Price</span>
                        <span className="line-through">
                          ${courseDetails.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">
                          -$
                          {(
                            courseDetails.price - courseDetails.discount_price
                          ).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-gray-800">
                      $
                      {courseDetails.discount_price
                        ? courseDetails.discount_price.toFixed(2)
                        : courseDetails.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  What You'll Learn
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {courseDetails.what_you_will_learn
                    ?.slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="w-full md:w-1/2 px-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Payment Details
              </h2>

              <form onSubmit={handlePayment}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Information
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white hover:border-gray-400 transition-colors">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "15px",
                              color: "#111827",
                              "::placeholder": {
                                color: "#9CA3AF",
                              },
                              iconColor: "#4B5563",
                            },
                            invalid: {
                              color: "#EF4444",
                            },
                          },
                          hidePostalCode: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${courseDetails.price.toFixed(2)}</span>
                      </div>
                      {courseDetails.discount_price && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span className="text-green-600">
                            -$
                            {(
                              courseDetails.price - courseDetails.discount_price
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                        <span>Total</span>
                        <span className="text-gray-800">
                          $
                          {courseDetails.discount_price
                            ? courseDetails.discount_price.toFixed(2)
                            : courseDetails.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-900 h-11 text-white"
                  disabled={processing || !stripe}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay $${
                      courseDetails.discount_price
                        ? courseDetails.discount_price.toFixed(2)
                        : courseDetails.price.toFixed(2)
                    }`
                  )}
                </Button>

                <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Secure 256-bit SSL encrypted payment</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
