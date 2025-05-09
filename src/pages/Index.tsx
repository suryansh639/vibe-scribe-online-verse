
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { articles } from "@/data/mockData"; // Import articles directly from mockData
import HeroSection from "@/components/homepage/HeroSection";
import FeaturedAuthors from "@/components/homepage/FeaturedAuthors";
import CategoryHighlights from "@/components/homepage/CategoryHighlights";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import MainContent from "@/components/homepage/MainContent";
import Sidebar from "@/components/homepage/Sidebar";
import FeaturedArticleSection from "@/components/homepage/FeaturedArticleSection";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

const HomePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Ensure all articles conform to ArticleDetailData interface
  const processedArticles: ArticleDetailData[] = articles.map(article => ({
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
  
  // Get the featured article - either look for one explicitly marked as featured or use the first one
  const featuredArticle = processedArticles.find(article => article.featured) || processedArticles[0];

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
          <MainContent articles={processedArticles} loading={loading} />
          
          {/* Sidebar */}
          <Sidebar popularTags={processedArticles.flatMap(article => article.tags || []).slice(0, 12)} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
