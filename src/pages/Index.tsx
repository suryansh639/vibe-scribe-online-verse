
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { articles as mockArticles } from "@/data/mockData"; // Import articles from mockData for fallback
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
    // Fetch articles from Supabase and fall back to mock data if needed
    const fetchArticles = async () => {
      try {
        // Fetch articles from Supabase
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, 
            title, 
            content, 
            excerpt, 
            cover_image, 
            published_at, 
            read_time, 
            tags, 
            likes, 
            comments, 
            featured,
            profiles:author_id (id, full_name, username, avatar_url, bio)
          `)
          .eq('published', true)
          .order('published_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching articles from Supabase:", error);
          throw error;
        }
        
        // Map Supabase data to ArticleDetailData format
        let processedArticles: ArticleDetailData[] = [];
        
        if (data && data.length > 0) {
          processedArticles = data.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content || "",
            excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
            coverImage: article.cover_image || "/placeholder.svg",
            publishedAt: article.published_at || new Date().toISOString(),
            readTime: article.read_time || "5 min read",
            tags: article.tags || [],
            likes: article.likes || 0,
            comments: article.comments || 0,
            featured: article.featured || false,
            author: {
              id: article.profiles?.id || "unknown",
              name: article.profiles?.full_name || article.profiles?.username || "Anonymous",
              avatar: article.profiles?.avatar_url || "/placeholder.svg",
              bio: article.profiles?.bio || "No bio available"
            }
          }));
        }
        
        // If no articles from database or fewer than 5, add mock articles
        if (processedArticles.length < 5) {
          // Add mock articles that don't exist in database articles
          mockArticles.forEach(mockArticle => {
            if (!processedArticles.some(article => article.id === mockArticle.id)) {
              processedArticles.push({
                id: mockArticle.id,
                title: mockArticle.title,
                content: mockArticle.content || "",
                excerpt: mockArticle.excerpt || mockArticle.content?.substring(0, 150) + "..." || "",
                coverImage: mockArticle.coverImage || "/placeholder.svg",
                publishedAt: mockArticle.publishedAt || new Date().toISOString(),
                readTime: mockArticle.readTime || "5 min read",
                tags: mockArticle.tags || [],
                likes: mockArticle.likes || 0,
                comments: mockArticle.comments || 0,
                featured: mockArticle.featured || false,
                author: mockArticle.author || {
                  id: "mock-author",
                  name: "Mock Author",
                  avatar: "/placeholder.svg",
                  bio: "This is a mock author bio for demonstration purposes."
                }
              });
            }
          });
        }
        
        setArticles(processedArticles);
      } catch (error) {
        console.error("Error in fetchArticles:", error);
        
        // Fall back to mock articles if database fetch fails
        const processedArticles = mockArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "",
          excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
          coverImage: article.coverImage || "/placeholder.svg",
          publishedAt: article.publishedAt || new Date().toISOString(),
          readTime: article.readTime || "5 min read",
          tags: article.tags || [],
          likes: article.likes || 0,
          comments: article.comments || 0,
          featured: article.featured || false,
          author: article.author || {
            id: "mock-author",
            name: "Mock Author",
            avatar: "/placeholder.svg",
            bio: "This is a mock author bio for demonstration purposes."
          }
        }));
        
        setArticles(processedArticles);
      } finally {
        setLoading(false);
      }
    };
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      fetchArticles();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
