
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArticleHeaderProps {
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime?: string;
  coverImage?: string;
}

const ArticleHeader = ({ title, author, publishedAt, readTime, coverImage }: ArticleHeaderProps) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="bg-brand-orange text-white">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Link to={`/profile/${author.id}`} className="font-medium hover:text-brand-orange">
            {author.name}
          </Link>
          <div className="text-gray-500 text-sm">
            {formattedDate} · {readTime || "5 min read"}
          </div>
        </div>
      </div>
      
      {coverImage && (
        <div className="mb-8">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}
    </header>
  );
};

export default ArticleHeader;
