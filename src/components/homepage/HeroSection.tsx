
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative w-full mb-16">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Discover stories that inspire
                  </h1>
                  <p className="text-white/80 text-lg mb-8 max-w-md">
                    Join thousands of readers exploring new ideas, perspectives, and expert insights.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/all-articles">
                      <Button className="bg-white text-blue-600 hover:bg-blue-50">
                        Start Reading
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="outline" className="border-white text-white hover:bg-white/20">
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Person reading"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </CarouselItem>
          
          <CarouselItem>
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Writing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Share your expertise
                  </h1>
                  <p className="text-white/80 text-lg mb-8 max-w-md">
                    Become a contributor and share your knowledge with our growing community.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/new-story">
                      <Button className="bg-white text-orange-600 hover:bg-orange-50">
                        Write a Story
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/80" />
        <CarouselNext className="right-2 bg-white/80" />
      </Carousel>
    </div>
  );
};

export default HeroSection;
