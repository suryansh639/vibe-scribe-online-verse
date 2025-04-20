
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <img src="/lovable-uploads/3efa0f09-9113-4a2d-8a87-9d8474d73326.png" alt="Blog Company" className="h-12 mx-auto mb-6" />
        
        <h1 className="text-6xl font-bold text-brand-orange mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
          <Link to="/all-articles">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
