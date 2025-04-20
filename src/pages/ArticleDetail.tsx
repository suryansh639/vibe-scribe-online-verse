
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import CommentForm from "@/components/comments/CommentForm";
import CommentsList from "@/components/comments/CommentsList";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleContent from "@/components/articles/ArticleContent";
import ArticleActions from "@/components/articles/ArticleActions";
import AuthorBio from "@/components/articles/AuthorBio";
import RelatedArticles from "@/components/articles/RelatedArticles";
import PopularTopics from "@/components/articles/PopularTopics";
import { mockArticles } from "@/data/mockData";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        // First try to get the article from Supabase
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:profiles(*)
          `)
          .eq("id", id)
          .eq("status", "published")
          .single();
          
        if (error) {
          console.log("Supabase error or article not found, checking mock data:", error);
          
          // If not found in Supabase, check mock data
          const mockArticle = mockArticles.find(article => article.id === id);
          
          if (mockArticle) {
            console.log("Found in mock data:", mockArticle);
            setArticle({
              ...mockArticle,
              author: mockArticle.author || {
                id: "mock-author",
                name: "Mock Author",
                avatar: "/placeholder.svg",
                bio: "This is a mock author bio for demonstration purposes."
              }
            });
            
            // Set related articles from mock data
            setRelatedArticles(
              mockArticles
                .filter(article => article.id !== id)
                .slice(0, 3)
                .map(article => ({
                  id: article.id,
                  title: article.title,
                  coverImage: article.coverImage,
                  author: article.author || {
                    id: "mock-author",
                    name: "Mock Author",
                    avatar: "/placeholder.svg"
                  }
                }))
            );
            
            // Set popular tags from mock data
            const allTags = mockArticles.flatMap(article => article.tags || []);
            const uniqueTags = [...new Set(allTags)];
            setPopularTags(uniqueTags.slice(0, 12));
            
            setLoading(false);
            return;
          } else {
            setError("Article not found");
          }
        } else if (data) {
          // Article found in Supabase
          setArticle({
            ...data,
            author: {
              id: data.author.id,
              name: data.author.full_name || data.author.username || "Anonymous",
              avatar: data.author.avatar_url,
              bio: data.author.bio
            }
          });
          
          // Fetch related articles based on tags
          if (data.tags && data.tags.length > 0) {
            const { data: relatedData } = await supabase
              .from("articles")
              .select(`
                *,
                profiles(*)
              `)
              .neq("id", id)
              .eq("status", "published")
              .overlaps("tags", data.tags)
              .limit(3);
              
            if (relatedData) {
              setRelatedArticles(relatedData.map(article => ({
                id: article.id,
                title: article.title,
                coverImage: article.cover_image,
                author: {
                  id: article.profiles.id,
                  name: article.profiles.full_name || article.profiles.username || "Anonymous",
                  avatar: article.profiles.avatar_url
                }
              })));
            }
          }
          
          // Fetch popular tags
          const { data: tagsData } = await supabase
            .from("articles")
            .select("tags")
            .eq("status", "published");
            
          if (tagsData) {
            const tagCounts: Record<string, number> = {};
            tagsData.forEach(article => {
              if (!article.tags) return;
              article.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            });
            
            const sortedTags = Object.entries(tagCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([tag]) => tag);
              
            setPopularTags(sortedTags);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("An error occurred while fetching the article");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const handleCommentAdded = () => {
    setCommentsRefreshTrigger(prev => prev + 1);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-2/3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Alert className="max-w-lg mx-auto">
            <AlertTitle>Article Not Found</AlertTitle>
            <AlertDescription>
              {error || "The article you're looking for doesn't exist or has been removed."}
            </AlertDescription>
          </Alert>
          <Link to="/" className="mt-8 inline-block">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <ArticleHeader
              title={article.title}
              author={article.author}
              publishedAt={article.publishedAt || article.published_at || article.created_at}
              readTime={article.readTime || article.read_time || "5 min read"}
              coverImage={article.coverImage || article.cover_image}
            />
            
            <ArticleContent
              content={article.content}
              excerpt={article.excerpt}
              tags={article.tags}
            />
            
            <ArticleActions
              articleId={article.id}
              initialLikes={article.likes || 0}
              initialComments={article.comments || 0}
            />
            
            <AuthorBio author={article.author} />
            
            {/* Comments section */}
            <section>
              <h3 className="text-xl font-bold mb-6">Comments ({article.comments || 0})</h3>
              <CommentForm 
                articleId={article.id}
                onCommentAdded={handleCommentAdded}
              />
              <CommentsList 
                articleId={article.id} 
                refreshTrigger={commentsRefreshTrigger} 
              />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedArticles articles={relatedArticles} />
            <PopularTopics tags={popularTags} />
            
            {/* Newsletter signup */}
            <div className="bg-brand-orange bg-opacity-10 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Subscribe for updates</h3>
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
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetail;
