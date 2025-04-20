
import { Link } from "react-router-dom";

interface PopularTopicsProps {
  tags: string[];
}

const PopularTopics = ({ tags }: PopularTopicsProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link
            key={tag}
            to={`/all-articles?tag=${tag}`}
            className="text-sm px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-700"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTopics;
