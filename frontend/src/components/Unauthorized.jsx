import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            403 - Access Denied
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription>
              You don't have permission to access this resource. Please contact
              your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
