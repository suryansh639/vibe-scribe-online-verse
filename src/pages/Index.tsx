import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { articles as mockArticles } from "@/data/mockData"; // Import articles from mockData
import HeroSection from "@/components/homepage/HeroSection";
import FeaturedAuthors from "@/components/homepage/FeaturedAuthors";
import CategoryHighlights from "@/components/homepage/CategoryHighlights";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import MainContent from "@/components/homepage/MainContent";
import Sidebar from "@/components/homepage/Sidebar";
import FeaturedArticleSection from "@/components/homepage/FeaturedArticleSection";
import { ArticleDetailData } from "@/hooks/types/articleTypes";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleDetailData[]>([]);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Try to fetch from Supabase first
        let { data: supabaseArticles, error } = await supabase
          .from('articles')
          .select(`
            id, title, content, excerpt, cover_image, published_at, read_time, tags, likes, comments, featured,
            author_id, profiles(id, full_name, username, avatar_url, bio)
          `)
          .order('published_at', { ascending: false });

        // If there's an error or no data, fall back to localStorage and mockData
        if (error || !supabaseArticles || supabaseArticles.length === 0) {
          console.log("Falling back to localStorage and mockData", error);
          
          // Get user articles from localStorage
          const userArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
          
          // Combine with mock articles, ensuring no duplicates by id
          const combinedArticles = [...userArticles];
          
          // Add mock articles that don't exist in user articles
          mockArticles.forEach(mockArticle => {
            if (!combinedArticles.some(article => article.id === mockArticle.id)) {
              combinedArticles.push(mockArticle);
            }
          });
          
          supabaseArticles = combinedArticles;
        }
        
        // Transform all articles to match ArticleDetailData exactly
        const processedArticles: ArticleDetailData[] = (supabaseArticles || []).map((article: any) => {
          if (!article) {
            return {
              id: "default-id",
              title: "Default Title",
              content: "",
              excerpt: "Default excerpt",
              coverImage: "/placeholder.svg",
              publishedAt: new Date().toISOString(),
              readTime: "5 min read",
              tags: [],
              likes: 0,
              comments: 0,
              featured: false,
              author: {
                id: "anonymous",
                name: "Anonymous",
                avatar: "/placeholder.svg",
                bio: "No bio available"
              }
            };
          }
          
          // Case 1: Handle articles from Supabase with profiles nested
          if ('profiles' in article) {
            const profiles = article.profiles as Record<string, any> | null | undefined;
            
            return {
              id: article.id || "",
              title: article.title || "",
              content: article.content || "",
              excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
              coverImage: article.cover_image || "/placeholder.svg",
              publishedAt: article.published_at || new Date().toISOString(),
              readTime: article.read_time || "5 min read",
              tags: Array.isArray(article.tags) ? article.tags : [],
              likes: typeof article.likes === 'number' ? article.likes : 0,
              comments: typeof article.comments === 'number' ? article.comments : 0,
              featured: !!article.featured,
              author: {
                id: profiles?.id || article.author_id || "mock-author",
                name: profiles?.full_name || profiles?.username || "Anonymous",
                avatar: profiles?.avatar_url || "/placeholder.svg",
                bio: profiles?.bio || "No bio available"
              }
            };
          }
          // Case 2: Handle mock articles or localStorage articles with different structure
          else if ('author' in article) {
            return {
              id: article.id || "",
              title: article.title || "",
              content: article.content || "",
              excerpt: article.excerpt || "",
              coverImage: article.coverImage || "/placeholder.svg",
              publishedAt: article.publishedAt || new Date().toISOString(),
              readTime: article.readTime || "5 min read",
              tags: Array.isArray(article.tags) ? article.tags : [],
              likes: typeof article.likes === 'number' ? article.likes : 0,
              comments: typeof article.comments === 'number' ? article.comments : 0,
              featured: !!article.featured,
              author: {
                id: article.author?.id || "anonymous",
                name: article.author?.name || "Anonymous",
                avatar: article.author?.avatar || "/placeholder.svg",
                bio: article.author?.bio || "No bio available"
              }
            };
          }
          // Case 3: Fallback for any other structure to ensure it matches ArticleDetailData
          else {
            return {
              id: article.id || "",
              title: article.title || "",
              content: article.content || "", 
              excerpt: article.excerpt || "",
              coverImage: article.coverImage || article.cover_image || "/placeholder.svg",
              publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
              readTime: article.readTime || article.read_time || "5 min read",
              tags: Array.isArray(article.tags) ? article.tags : [],
              likes: typeof article.likes === 'number' ? article.likes : 0,
              comments: typeof article.comments === 'number' ? article.comments : 0,
              featured: !!article.featured,
              author: {
                id: article.author_id || "anonymous",
                name: "Anonymous",
                avatar: "/placeholder.svg",
                bio: "No bio available"
              }
            };
          }
        });
        
        setArticles(processedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        toast({
          title: "Error",
          description: "Failed to load articles. Using mock data instead.",
          variant: "destructive",
        });
        
        // Fallback to mock data, ensuring it matches ArticleDetailData
        setArticles(mockArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "", // Ensure content is never undefined
          excerpt: article.excerpt || "",
          coverImage: article.coverImage || "/placeholder.svg",
          publishedAt: article.publishedAt || new Date().toISOString(),
          readTime: article.readTime || "5 min read",
          tags: Array.isArray(article.tags) ? article.tags : [],
          likes: typeof article.likes === 'number' ? article.likes : 0,
          comments: typeof article.comments === 'number' ? article.comments : 0,
          featured: !!article.featured,
          author: {
            id: article.author?.id || "mock-author",
            name: article.author?.name || "Mock Author",
            avatar: article.author?.avatar || "/placeholder.svg",
            bio: article.author?.bio || "No bio available"
          }
        })));
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch the articles
    fetchArticles();
  }, [toast]);
  
  // Get the featured article - either look for one explicitly marked as featured or use the first one
  const featuredArticle = articles.find(article => article.featured) || articles[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <HeroSection />

        {/* Category highlights */}
        <CategoryHighlights />

        {/* Featured article section */}
        <FeaturedArticleSection article={featuredArticle} loading={loading} />

        {/* Testimonials section */}
        <TestimonialsSection />

        {/* Featured authors section */}
        <FeaturedAuthors />

        {/* Main content with sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Article list */}
          <MainContent articles={articles} loading={loading} />
          
          {/* Sidebar */}
          <Sidebar popularTags={articles.flatMap(article => article.tags || []).slice(0, 12)} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
