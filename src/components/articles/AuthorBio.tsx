
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AuthorBioProps {
  author: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
  };
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-10">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="bg-brand-orange text-white">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-bold text-lg mb-1">
            <Link to={`/profile/${author.id}`} className="hover:text-brand-orange">
              {author.name}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-3">
            {author.bio || "Writer at Blog Company"}
          </p>
          
          <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
