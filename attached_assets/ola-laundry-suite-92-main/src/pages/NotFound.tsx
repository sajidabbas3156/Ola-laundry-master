
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-ola-700 mb-2">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="my-6">
            <div className="h-32 w-32 bg-ola-100 rounded-full mx-auto flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ola-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            We couldn't find the page you were looking for. The page might have
            been moved, deleted, or never existed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.history.back()}>Go Back</Button>
          <Button variant="outline" className="ml-2" onClick={() => window.location.href = "/"}>
            Home Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
