
import React from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ArticleNotFoundProps {
  error: string | null;
}

const ArticleNotFound = ({ error }: ArticleNotFoundProps) => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Alert className="max-w-lg mx-auto">
        <AlertTitle>Article Not Found</AlertTitle>
        <AlertDescription>
          {error || "The article you're looking for doesn't exist or has been removed."}
        </AlertDescription>
      </Alert>
      <Link to="/" className="mt-8 inline-block">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};

export default ArticleNotFound;
