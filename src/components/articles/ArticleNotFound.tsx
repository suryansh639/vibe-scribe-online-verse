
import React from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

interface ArticleNotFoundProps {
  error: string | null;
}

const ArticleNotFound = ({ error }: ArticleNotFoundProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Alert className="bg-red-50 border-red-200 mb-8">
        <AlertTitle className="text-xl font-bold text-red-700 mb-2">Article Not Found</AlertTitle>
        <AlertDescription className="text-gray-700">
          {error || "The article you're looking for doesn't exist or has been removed."}
          
          {/* Show additional help text if there's a specific error */}
          {error && error.includes("mock data") && (
            <div className="mt-2 text-sm">
              Try accessing articles from the home page or all articles section.
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="inline-block">
          <Button className="w-full flex gap-2 items-center bg-brand-orange hover:bg-brand-orangeDark text-white">
            <Home size={18} />
            Return to Home
          </Button>
        </Link>
        
        <Link to="/all-articles">
          <Button 
            variant="outline" 
            className="w-full flex gap-2 items-center"
          >
            <ArrowLeft size={18} />
            Browse All Articles
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="flex gap-2 items-center"
        >
          <RefreshCw size={18} />
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default ArticleNotFound;
