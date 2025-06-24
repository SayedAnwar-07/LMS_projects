import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { processCoursePayment } from "../redux/features/paymentSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const PaymentComplete = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const stripe = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const verifyPayment = async () => {
      try {
        const paymentIntentId = searchParams.get("payment_intent");

        if (!paymentIntentId) {
          throw new Error("Payment information not found");
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(
          paymentIntentId
        );
        setPaymentStatus(paymentIntent.status);

        if (paymentIntent.status === "succeeded") {
          const result = await dispatch(
            processCoursePayment({
              courseId,
              token: paymentIntent.payment_method,
            })
          );

          if (result.error) {
            throw new Error(result.payload?.error || "Enrollment failed");
          }
        }
      } catch (error) {
        toast.error(error.message || "Payment verification failed");
        navigate(`/payments/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [stripe, courseId, dispatch, navigate, searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-lg">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <BackButton />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader
            className={
              paymentStatus === "succeeded" ? "bg-green-50" : "bg-red-50"
            }
          >
            <CardTitle
              className={
                paymentStatus === "succeeded"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {paymentStatus === "succeeded"
                ? "Payment Successful!"
                : "Payment Not Completed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6 space-y-4">
            {paymentStatus === "succeeded" ? (
              <>
                <p>Thank you for your payment!</p>
                <p>You have been successfully enrolled in the course.</p>
              </>
            ) : (
              <>
                <p>We couldn't confirm your payment.</p>
                <p>
                  Please try again or contact support if you believe this is an
                  error.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() =>
                navigate(
                  paymentStatus === "succeeded"
                    ? `/courses/${courseId}`
                    : `/payments/${courseId}`
                )
              }
            >
              {paymentStatus === "succeeded" ? "Go to Course" : "Try Again"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentComplete;
