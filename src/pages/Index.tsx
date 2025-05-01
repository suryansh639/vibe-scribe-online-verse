
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { popularTags } from "@/data/mockData"; // Keep using mock tags for now
import HeroSection from "@/components/homepage/HeroSection";
import FeaturedAuthors from "@/components/homepage/FeaturedAuthors";
import CategoryHighlights from "@/components/homepage/CategoryHighlights";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import MainContent from "@/components/homepage/MainContent";
import Sidebar from "@/components/homepage/Sidebar";
import FeaturedArticleSection from "@/components/homepage/FeaturedArticleSection";

const HomePage = () => {
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
          <Sidebar popularTags={popularTags} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
