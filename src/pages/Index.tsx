
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

const HomePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleDetailData[]>([]);
  
  useEffect(() => {
    // Combine mock articles with user-created articles from localStorage
    const fetchArticles = () => {
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
      
      // Ensure all articles conform to ArticleDetailData interface
      const processedArticles: ArticleDetailData[] = combinedArticles.map(article => ({
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
      setLoading(false);
    };
    
    // Simulate loading time
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
