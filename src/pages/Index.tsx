
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

// Sample articles data for the homepage
const sampleArticles = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Healthcare",
    excerpt: "Discover how AI is revolutionizing healthcare diagnostics, treatment planning, and patient care. From predictive analytics to personalized medicine, explore the exciting advancements changing the medical landscape.",
    content: "Artificial intelligence is transforming healthcare in remarkable ways. Machine learning algorithms now help doctors diagnose diseases with greater accuracy than ever before...",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    featured: true,
    author: {
      id: "auth1",
      name: "Dr. Elena Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
    },
    publishedAt: "2025-04-25T12:00:00Z",
    readTime: "8 min read",
    tags: ["Technology", "Healthcare", "Artificial Intelligence"],
    likes: 245,
    comments: 37
  },
  {
    id: "2",
    title: "Sustainable Living: 10 Simple Steps to Reduce Your Carbon Footprint",
    excerpt: "Learn practical, everyday actions you can take to live more sustainably and reduce environmental impact. These simple changes can make a significant difference when adopted consistently.",
    content: "Living sustainably doesn't have to be complicated or expensive. Small changes in your daily habits can significantly reduce your environmental impact...",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    featured: false,
    author: {
      id: "auth2",
      name: "Michael Green",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
    },
    publishedAt: "2025-04-23T09:15:00Z",
    readTime: "6 min read",
    tags: ["Lifestyle", "Environment", "Sustainability"],
    likes: 187,
    comments: 24
  },
  {
    id: "3",
    title: "The Psychology of Productivity: How to Work Smarter, Not Harder",
    excerpt: "Explore the psychological principles behind productivity and learn evidence-based techniques to enhance focus, manage energy, and accomplish more meaningful work in less time.",
    content: "In our always-connected world, productivity isn't about working longer hours but about working smarter. Understanding the psychology behind focus and motivation...",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    featured: false,
    author: {
      id: "auth3",
      name: "Sarah Lopez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
    },
    publishedAt: "2025-04-20T14:30:00Z",
    readTime: "10 min read",
    tags: ["Business", "Productivity", "Psychology"],
    likes: 312,
    comments: 56
  },
  {
    id: "4",
    title: "Exploring the Hidden Gems of Southeast Asia",
    excerpt: "Venture beyond the typical tourist destinations to discover less-traveled but equally stunning locations across Southeast Asia, from secluded beaches to mountainous villages.",
    content: "Southeast Asia offers more than just the popular destinations that appear on social media. For travelers willing to venture off the beaten path...",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    featured: false,
    author: {
      id: "auth4",
      name: "James Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
    },
    publishedAt: "2025-04-18T11:45:00Z",
    readTime: "7 min read",
    tags: ["Travel", "Adventure", "Culture"],
    likes: 203,
    comments: 31
  },
  {
    id: "5",
    title: "The Rise of Plant-Based Diets: Benefits and Meal Planning",
    excerpt: "Discover the health and environmental advantages of plant-based eating, along with practical tips for nutritionally balanced meal planning that satisfies both taste buds and dietary needs.",
    content: "Plant-based diets have moved from niche to mainstream, with more people reducing their animal product consumption for health, environmental, and ethical reasons...",
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    featured: false,
    author: {
      id: "auth5",
      name: "Amanda Park",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    publishedAt: "2025-04-16T08:20:00Z",
    readTime: "5 min read",
    tags: ["Lifestyle", "Food", "Health"],
    likes: 176,
    comments: 29
  },
  {
    id: "6",
    title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
    excerpt: "Look beyond the cryptocurrency hype to understand how blockchain technology is revolutionizing industries from supply chain management to healthcare data security.",
    content: "While most people associate blockchain with Bitcoin and other cryptocurrencies, the technology's potential extends far beyond digital currencies...",
    coverImage: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
    featured: false,
    author: {
      id: "auth6",
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    publishedAt: "2025-04-14T16:55:00Z",
    readTime: "9 min read",
    tags: ["Technology", "Business", "Blockchain"],
    likes: 231,
    comments: 42
  }
];

const HomePage = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching from Supabase by using our sample data
    setLoading(true);
    // Use setTimeout to simulate API loading time
    const timer = setTimeout(() => {
      setArticles(sampleArticles);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
