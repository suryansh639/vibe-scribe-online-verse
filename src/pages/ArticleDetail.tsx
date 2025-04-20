
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Share2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import CommentForm from "@/components/comments/CommentForm";
import CommentsList from "@/components/comments/CommentsList";
import ArticleCard from "@/components/articles/ArticleCard";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);
  
  // Use the article interactions hook
  const { 
    isLiked, 
    isBookmarked, 
    likesCount, 
    loading: interactionLoading, 
    toggleLike, 
    toggleBookmark 
  } = useArticleInteractions({ articleId: id || "" });
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:profiles(*)
          `)
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
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
          const { data: relatedData, error: relatedError } = await supabase
            .from("articles")
            .select(`
              *,
              profiles(*)
            `)
            .neq("id", id)
            .eq("status", "published")
            .overlaps("tags", data.tags)
            .limit(3);
            
          if (!relatedError && relatedData) {
            const formattedRelatedArticles = relatedData.map(article => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || "",
              coverImage: article.cover_image,
              author: {
                id: article.profiles.id,
                name: article.profiles.full_name || article.profiles.username || "Anonymous",
                avatar: article.profiles.avatar_url
              },
              publishedAt: article.published_at || article.created_at,
              readTime: article.read_time || "5 min read",
              tags: article.tags || [],
              likes: article.likes || 0,
              comments: article.comments || 0
            }));
            
            setRelatedArticles(formattedRelatedArticles);
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
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const handleCommentAdded = () => {
    // Trigger comments refresh
    setCommentsRefreshTrigger(prev => prev + 1);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article content skeleton */}
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
            
            {/* Sidebar skeleton */}
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
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Alert className="max-w-lg mx-auto">
            <AlertTitle>Article Not Found</AlertTitle>
            <AlertDescription>
              The article you're looking for doesn't exist or has been removed.
            </AlertDescription>
          </Alert>
          <Link to="/" className="mt-8 inline-block">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Format the date for display
  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article content - Takes up 2/3 on desktop */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              
              {/* Author info and date */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-brand-orange text-white">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Link to={`/profile/${article.author.id}`} className="font-medium hover:text-brand-orange">
                    {article.author.name}
                  </Link>
                  <div className="text-gray-500 text-sm">
                    {formattedDate} · {article.read_time || "5 min read"}
                  </div>
                </div>
              </div>
              
              {/* Cover image */}
              {article.cover_image && (
                <div className="mb-8">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </header>
            
            {/* Article Content - Using markdown content */}
            <div className="prose prose-lg max-w-none mb-8">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
              ) : (
                <p className="text-lg">{article.excerpt}</p>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags?.map((tag: string) => (
                <Link
                  key={tag}
                  to={`/all-articles?tag=${tag}`}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            {/* Article actions */}
            <div className="flex items-center justify-between mb-10 py-4 border-t border-b border-gray-200">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
                  onClick={toggleLike}
                  disabled={interactionLoading === "like"}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  <span>{likesCount || article.likes || 0}</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
                  <MessageSquare size={20} />
                  <span>{article.comments || 0}</span>
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={isBookmarked ? 'text-brand-orange' : 'text-gray-600'}
                  onClick={toggleBookmark}
                  disabled={interactionLoading === "bookmark"}
                >
                  <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>
            
            {/* Author bio */}
            <div className="bg-gray-50 rounded-lg p-6 mb-10">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-brand-orange text-white">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    <Link to={`/profile/${article.author.id}`} className="hover:text-brand-orange">
                      {article.author.name}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    {article.author.bio || "Writer at Blog Company"}
                  </p>
                  
                  <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Comments section */}
            <section>
              <h3 className="text-xl font-bold mb-6">Comments ({article.comments || 0})</h3>
              
              {/* Comment form */}
              <CommentForm 
                articleId={article.id}
                onCommentAdded={handleCommentAdded}
              />
              
              {/* Comment list */}
              <CommentsList 
                articleId={article.id} 
                refreshTrigger={commentsRefreshTrigger} 
              />
            </section>
          </div>
          
          {/* Sidebar - Takes up 1/3 on desktop */}
          <div className="lg:col-span-1">
            {/* Related articles */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">Related Articles</h3>
              <div className="space-y-6">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map(article => (
                    <div key={article.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                          {article.author.avatar ? (
                            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white text-xs">
                              {article.author.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <Link to={`/profile/${article.author.id}`} className="text-sm font-medium hover:text-brand-orange">
                          {article.author.name}
                        </Link>
                      </div>
                      
                      <Link to={`/article/${article.id}`}>
                        <h4 className="font-bold mb-2 hover:text-brand-orange transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                      
                      {article.coverImage && (
                        <Link to={`/article/${article.id}`}>
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-40 object-cover rounded mb-2"
                          />
                        </Link>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No related articles found</p>
                )}
              </div>
            </div>
            
            {/* Popular tags */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
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
