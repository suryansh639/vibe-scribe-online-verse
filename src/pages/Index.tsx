import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { articles } from "@/data/mockData"; // Import articles as fallback
import HeroSection from "@/components/homepage/HeroSection";
import FeaturedAuthors from "@/components/homepage/FeaturedAuthors";
import CategoryHighlights from "@/components/homepage/CategoryHighlights";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import MainContent from "@/components/homepage/MainContent";
import Sidebar from "@/components/homepage/Sidebar";
import FeaturedArticleSection from "@/components/homepage/FeaturedArticleSection";
import { fetchArticlesFromSupabase, fetchFeaturedArticlesFromSupabase, fetchPopularTagsFromSupabase } from "@/utils/fetchArticlesData";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

const HomePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [articlesData, setArticlesData] = useState<ArticleDetailData[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<ArticleDetailData | null>(null);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch articles from Supabase
        const fetchedArticles = await fetchArticlesFromSupabase();
        
        // Fetch featured articles from Supabase
        const featuredArticles = await fetchFeaturedArticlesFromSupabase();
        
        // Get popular tags
        const tags = await fetchPopularTagsFromSupabase();
        
        // If we have articles from Supabase, use them
        if (fetchedArticles.length > 0) {
          setArticlesData(fetchedArticles);
          
          // If we have featured articles, use the first one
          if (featuredArticles.length > 0) {
            setFeaturedArticle(featuredArticles[0]);
          } else {
            // Otherwise, use the first article as featured
            setFeaturedArticle(fetchedArticles[0]);
          }
          
          setPopularTags(tags);
        } else {
          // Fallback to mock data if Supabase fails or returns no articles
          console.log("Falling back to mock data");
          setArticlesData(articles);
          const mockFeaturedArticle = articles.find(article => article.featured) || articles[0];
          setFeaturedArticle(mockFeaturedArticle as ArticleDetailData);
          setPopularTags(articles.flatMap(article => article.tags || []).slice(0, 12));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching articles",
          description: "Using mock data as fallback",
          variant: "destructive",
        });
        
        // Fallback to mock data on error
        setArticlesData(articles);
        const mockFeaturedArticle = articles.find(article => article.featured) || articles[0];
        setFeaturedArticle(mockFeaturedArticle as ArticleDetailData);
        setPopularTags(articles.flatMap(article => article.tags || []).slice(0, 12));
      } finally {
        // Simulate loading time if it's too fast
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    
    fetchData();
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <HeroSection />

        {/* Category highlights */}
        <CategoryHighlights />

        {/* Featured article section */}
        <FeaturedArticleSection 
          article={featuredArticle || undefined} 
          loading={loading} 
        />

        {/* Testimonials section */}
        <TestimonialsSection />

        {/* Featured authors section */}
        <FeaturedAuthors />

        {/* Main content with sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Article list */}
          <MainContent articles={articlesData} loading={loading} />
          
          {/* Sidebar */}
          <Sidebar popularTags={popularTags} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
