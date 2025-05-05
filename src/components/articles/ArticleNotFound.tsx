
import React from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface ArticleNotFoundProps {
  error: string | null;
}

const ArticleNotFound = ({ error }: ArticleNotFoundProps) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Alert className="bg-red-50 border-red-200 mb-8">
        <AlertTitle className="text-xl font-bold text-red-700 mb-2">Article Not Found</AlertTitle>
        <AlertDescription className="text-gray-700">
          {error || "The article you're looking for doesn't exist or has been removed."}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="inline-block">
          <Button className="w-full flex gap-2 items-center">
            <Home size={18} />
            Return to Home
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          onClick={() => window.history.back()} 
          className="flex gap-2 items-center"
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ArticleNotFound;
