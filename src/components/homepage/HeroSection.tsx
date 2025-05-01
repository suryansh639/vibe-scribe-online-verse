
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroSection = () => {
  const { user } = useAuth();

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
      alt: "Technology"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      alt: "Writing inspiration"
    },
    {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", 
      alt: "Writers at work"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-16 bg-gradient-to-r from-gray-900 to-brand-orange">
      <div className="absolute inset-0 opacity-20">
        <Carousel className="w-full" autoplay>
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="h-[500px] w-full">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          Discover Stories That Move You
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Join our community of writers and readers to explore insights, experiences, and ideas that inspire.
          Share your thoughts with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          {user ? (
            <Link to="/new-story">
              <Button size="lg" className="bg-white text-brand-orange hover:bg-gray-100">
                Start Writing
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-brand-orange hover:bg-gray-100">
                  Join Now
                </Button>
              </Link>
              <Link to="/all-articles">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  Explore Stories
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
