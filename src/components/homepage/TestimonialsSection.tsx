
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "This platform has transformed how I share my ideas with the world. The community feedback is incredibly valuable!",
      author: "Alex Rivera",
      role: "Tech Blogger",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    },
    {
      quote: "I've discovered so many insightful writers here. It's become my daily source of inspiration and knowledge.",
      author: "Jessica Wong",
      role: "Avid Reader",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    },
    {
      quote: "As a new writer, I was nervous about sharing my work. The supportive environment here gave me confidence to publish.",
      author: "Marcus Johnson",
      role: "Fiction Writer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-brand-orange/10 to-orange-100 rounded-xl mb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">What Our Community Says</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-white border-none shadow-md h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4 text-brand-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.685.41-2.235.315-.56.766-.94 1.353-1.139v-.035c-.787-.32-1.485-.84-2.095-1.356-.62-.527-1.15-1.132-1.59-1.812h1.54c.305.47.683.858 1.13 1.163.448.295.943.515 1.487.66.595.15 1.28.396 2.056.74.787.36 1.456.892 2.005 1.596s.877 1.608 1.052 2.71c.346 2.22-.06 3.688-1.2 4.41-1.15.723-2.597.964-4.32.737v-.03c.93-.16 1.708-.53 2.335-1.1.62-.57.93-1.28.93-2.14zm9.94 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.695-1.327-.824-.57-.143-1.07-.14-1.54-.028-.16-.95.09-1.685.41-2.235.3-.54.75-.935 1.353-1.14v-.035c-.8-.32-1.485-.84-2.095-1.356-.61-.527-1.14-1.132-1.59-1.812h1.54c.305.47.683.858 1.13 1.163.45.295.943.515 1.486.66.604.15 1.29.396 2.056.74.78.36 1.45.892 2.005 1.596s.875 1.608 1.05 2.71c.35 2.22-.05 3.688-1.19 4.41-1.15.723-2.596.964-4.32.737v-.03c.93-.16 1.707-.53 2.334-1.1.62-.57.93-1.28.93-2.14z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 flex-grow">{testimonial.quote}</p>
                      <div className="flex items-center mt-6">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback className="bg-brand-orange text-white">{testimonial.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static mx-2 translate-y-0" />
            <CarouselNext className="static mx-2 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsSection;
