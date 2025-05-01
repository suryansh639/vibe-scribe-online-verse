
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
}

const FeaturedAuthors = () => {
  // Mock data for featured authors
  const featuredAuthors: Author[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Tech writer and digital strategist with a passion for emerging technologies."
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Fiction writer exploring the boundaries between reality and imagination."
    },
    {
      id: "3",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
      bio: "Food enthusiast and travel blogger documenting culinary adventures."
    }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Featured Authors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredAuthors.map((author) => (
          <div key={author.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-brand-orange text-white">{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg mb-2">{author.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{author.bio}</p>
            <Link to={`/profile/${author.id}`} className="mt-auto">
              <Button variant="outline" className="text-brand-orange border-brand-orange hover:bg-brand-orange/10">
                View Profile
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedAuthors;
