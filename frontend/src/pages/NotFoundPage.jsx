// src/pages/NotFoundPage.jsx
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            404 - Page Not Found
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFoundPage;