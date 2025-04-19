
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenSquare, Bookmark, Heart } from "lucide-react";
import ArticleCard from "@/components/articles/ArticleCard";
import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [likedArticles, setLikedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profile);
    };

    const fetchMyArticles = async () => {
      if (!user) return;
      
      const { data: articles } = await supabase
        .from('articles')
        .select('*, author:profiles(*)')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });
      
      setMyArticles(articles || []);
    };

    const fetchBookmarkedArticles = async () => {
      if (!user) return;
      
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('article:articles(*)')
        .eq('user_id', user.id);
      
      setBookmarkedArticles(bookmarks?.map(b => b.article) || []);
    };

    const fetchLikedArticles = async () => {
      if (!user) return;
      
      const { data: likes } = await supabase
        .from('article_likes')
        .select('article:articles(*)')
        .eq('user_id', user.id);
      
      setLikedArticles(likes?.map(l => l.article) || []);
    };

    Promise.all([
      fetchProfile(),
      fetchMyArticles(),
      fetchBookmarkedArticles(),
      fetchLikedArticles()
    ]).finally(() => setLoading(false));

  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Alert>Please sign in to view your dashboard.</Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="space-y-3">
                <Link to="/settings">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </Link>
                <Link to="/new-story">
                  <Button className="w-full bg-brand-orange hover:bg-brand-orangeDark">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Write a Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
