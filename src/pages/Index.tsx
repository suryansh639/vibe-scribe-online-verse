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
        // Get published articles from Supabase
        const { data: supaArticles, error } = await supabase
          .from('articles')
          .select(`
            id, title, excerpt, content, cover_image, published_at, created_at,
            read_time, tags, likes, comments, featured,
            author:profiles(id, full_name, username, avatar_url, bio)
          `)
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;

        // Prepare Supabase articles
        const publishedArticles: ArticleDetailData[] = (supaArticles || []).map(article => ({
          id: article.id,
          title: article.title,
          content: article.content || "",
          excerpt: article.excerpt || article.content?.substring(0, 150) + "..." || "",
          coverImage: article.cover_image || "/placeholder.svg",
          publishedAt: article.published_at || article.created_at || new Date().toISOString(),
          readTime: article.read_time || "5 min read",
          tags: article.tags || [],
          likes: article.likes || 0,
          comments: article.comments || 0,
          featured: article.featured || false,
          author: {
            id: article.author.id,
            name: article.author.full_name || article.author.username || "Anonymous",
            avatar: article.author.avatar_url || "/placeholder.svg",
            bio: article.author.bio || "No bio available",
          }
        }));

        // (Optional) Merge with mock/localStorage articles, avoiding duplicates by ID
        const userArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
        const combined = [...publishedArticles];
        // If you want to include local-only articles as drafts, you can merge here

        // Add mock articles that don't exist
        mockArticles.forEach(mockArticle => {
          if (!combined.some(article => article.id === mockArticle.id)) {
            combined.push({
              ...mockArticle,
              content: mockArticle.content || "", // Ensure content is always present
              excerpt: mockArticle.excerpt || (mockArticle.content ? mockArticle.content.substring(0, 150) + "..." : ""),
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

        setArticles(combined);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        toast({
          title: "Could not load articles",
          description: err.message,
          variant: "destructive"
        });
      }
    };

    fetchArticles();
  }, []);

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
