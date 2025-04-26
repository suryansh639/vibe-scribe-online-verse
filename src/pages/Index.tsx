
import { Suspense, lazy, useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { PenIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { popularTags } from "@/data/mockData"; // Keep using mock tags for now

// Lazy load components for better performance
const FeaturedArticle = lazy(() => import("@/components/articles/FeaturedArticle"));
const ArticleCard = lazy(() => import("@/components/articles/ArticleCard"));

const HomePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            content,
            cover_image,
            published_at,
            created_at,
            tags,
            likes,
            comments,
            featured,
            read_time,
            profiles(id, full_name, username, avatar_url)
          `)
          .eq('published', true)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedArticles = data.map(article => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt || article.content?.substring(0, 150) + '...' || '',
            coverImage: article.cover_image,
            featured: article.featured,
            author: {
              id: article.profiles.id,
              name: article.profiles.full_name || article.profiles.username || 'Anonymous',
              avatar: article.profiles.avatar_url
            },
            publishedAt: article.published_at || article.created_at,
            readTime: article.read_time || '5 min read',
            tags: article.tags || [],
            likes: article.likes || 0,
            comments: article.comments || 0
          }));
          setArticles(formattedArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        toast({
          title: "Error loading articles",
          description: "Could not load articles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);
  
  // Get the featured article
  const featuredArticle = articles.find(article => article.featured);
  
  // Get the other articles (non-featured)
  const otherArticles = articles.filter(article => !article.featured);

  const handleWriteClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write articles",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section with featured article and write button */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Discover stories that matter</h1>
            <Link to={user ? "/new-story" : "/signin"} onClick={handleWriteClick}>
              <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                <PenIcon className="w-4 h-4 mr-2" />
                Write Article
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredArticle ? (
            <Suspense fallback={
              <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <FeaturedArticle {...featuredArticle} />
            </Suspense>
          ) : (
            <div className="bg-gray-100 rounded-xl p-8 flex justify-center items-center h-64 text-center">
              <div>
                <p className="text-lg font-medium mb-2">No featured articles yet</p>
                {user && (
                  <Link to="/new-story">
                    <Button size="sm" className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                      Write the first featured article
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Main content with sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Article list */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="latest">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                <Link to="/all-articles">
                  <Button variant="ghost" className="text-brand-orange">View All</Button>
                </Link>
              </div>
              
              <TabsContent value="latest">
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                        <LoadingSpinner />
                      </div>
                    ))}
                  </div>
                ) : otherArticles.length > 0 ? (
                  <Suspense fallback={
                    <div className="space-y-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                          <LoadingSpinner />
                        </div>
                      ))}
                    </div>
                  }>
                    <div>
                      {otherArticles.map(article => (
                        <ArticleCard key={article.id} {...article} />
                      ))}
                    </div>
                  </Suspense>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No articles published yet</p>
                    {user && (
                      <Link to="/new-story">
                        <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                          Write your first article
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular">
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                        <LoadingSpinner />
                      </div>
                    ))}
                  </div>
                ) : otherArticles.length > 0 ? (
                  <Suspense fallback={
                    <div className="space-y-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
                          <LoadingSpinner />
                        </div>
                      ))}
                    </div>
                  }>
                    <div>
                      {/* For demo, we'll use the same articles but sorted by likes */}
                      {[...otherArticles]
                        .sort((a, b) => b.likes - a.likes)
                        .map(article => (
                          <ArticleCard key={article.id} {...article} />
                        ))}
                    </div>
                  </Suspense>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No articles published yet</p>
                    {user && (
                      <Link to="/new-story">
                        <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                          Write your first article
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
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
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
