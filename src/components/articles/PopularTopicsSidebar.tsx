
import { Badge } from "@/components/ui/badge";

interface PopularTopicsSidebarProps {
  tags: string[];
  tagFilter?: string | null;
  onTagClick: (tag: string) => void;
}

const PopularTopicsSidebar = ({
  tags,
  tagFilter,
  onTagClick
}: PopularTopicsSidebarProps) => (
  <div className="bg-gray-50 rounded-lg p-6 mb-8 sticky top-24">
    <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className={`cursor-pointer ${tagFilter === tag ? 'bg-brand-orange text-white' : 'hover:bg-gray-100'}`}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);

export default PopularTopicsSidebar;
