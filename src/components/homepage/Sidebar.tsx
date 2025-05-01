
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  popularTags: string[];
}

const Sidebar = ({ popularTags }: SidebarProps) => {
  return (
    <div className="lg:col-span-1">
      {/* Popular tags */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Link
              key={tag}
              to={`/all-articles?tag=${encodeURIComponent(tag)}`}
              className="text-sm px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-700"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="bg-brand-orange bg-opacity-10 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">Stay in the loop</h3>
        <p className="text-gray-600 mb-4">Get the latest articles delivered right to your inbox</p>
        
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-orange focus:outline-none"
          />
          <Button className="w-full bg-brand-orange hover:bg-brand-orangeDark text-white">
            Subscribe
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
