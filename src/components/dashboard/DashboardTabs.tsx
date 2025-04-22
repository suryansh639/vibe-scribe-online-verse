
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ArticleCard from "@/components/articles/ArticleCard";
import type { ArticleListItem } from "@/components/articles/ArticlesList";

interface DashboardTabsProps {
  myArticles: ArticleListItem[];
  bookmarkedArticles: ArticleListItem[];
  likedArticles: ArticleListItem[];
}

export const DashboardTabs = ({
  myArticles,
  bookmarkedArticles,
  likedArticles
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="stories">
      <TabsList>
        <TabsTrigger value="stories">My Stories</TabsTrigger>
        <TabsTrigger value="bookmarks">
          <Bookmark className="mr-2 h-4 w-4" />
          Bookmarks
        </TabsTrigger>
        <TabsTrigger value="likes">
          <Heart className="mr-2 h-4 w-4" />
          Liked Articles
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="stories" className="mt-6">
        {myArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't written any stories yet.</p>
            <Link to="/new-story">
              <Button>Write Your First Story</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myArticles.map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="bookmarks" className="mt-6">
        {bookmarkedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No bookmarked articles yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarkedArticles.map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="likes" className="mt-6">
        {likedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No liked articles yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {likedArticles.map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
