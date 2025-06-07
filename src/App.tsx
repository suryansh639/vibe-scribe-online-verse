
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Editor from "./pages/Editor";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import AllArticles from "./pages/AllArticles";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import WritingGuidelines from "./pages/WritingGuidelines";
import Community from "./pages/Community";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Dummy article data for seeding the database
const dummyArticles = [
  // Business Articles
  {
    title: "10 Strategies for Small Business Growth in 2025",
    excerpt: "Discover proven tactics to scale your small business in the current economic landscape.",
    content: "Small businesses are the backbone of the economy, yet they face numerous challenges in today's competitive market. This article explores ten effective strategies that can help small business owners drive growth in 2025 and beyond. From leveraging digital marketing to optimizing operational efficiency, these approaches have been tested and proven by successful entrepreneurs across various industries.",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["business", "entrepreneurship", "small business", "growth"],
    read_time: "8 min read",
    featured: true
  },
  {
    title: "The Future of Remote Work: Corporate Strategies for Distributed Teams",
    excerpt: "How leading companies are adapting their business models for remote and hybrid workforces.",
    content: "The pandemic accelerated the shift to remote work, and now many businesses are making it a permanent part of their operating model. This article examines how Fortune 500 companies are restructuring their operations, communication strategies, and management approaches to maintain productivity and culture with distributed teams. We'll explore the challenges, opportunities, and best practices emerging in this new business landscape.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["business", "remote work", "management", "corporate strategy"],
    read_time: "10 min read"
  },
  {
    title: "Sustainable Business Practices That Boost Profitability",
    excerpt: "How environmentally conscious decisions can drive business growth and customer loyalty.",
    content: "Sustainability is no longer just about corporate social responsibility—it's becoming a key driver of business value. This article presents case studies of companies that have successfully implemented sustainable practices while simultaneously increasing their bottom line. From reducing waste in the supply chain to developing eco-friendly products, these businesses demonstrate that environmental consciousness and profitability can go hand in hand.",
    cover_image: "https://images.unsplash.com/photo-1535813449-5a3014031216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["business", "sustainability", "corporate responsibility", "green business"],
    read_time: "7 min read"
  },
  
  // Technology Articles
  {
    title: "The Rise of AI in Everyday Applications",
    excerpt: "How artificial intelligence is quietly transforming the tools we use daily.",
    content: "Artificial intelligence has moved beyond research labs and into our daily lives, often in ways we don't even notice. This article explores the AI technologies embedded in common applications, from email clients that automatically categorize messages to photo apps that enhance images with a single tap. We'll discuss the technological advancements that have made these features possible and what they tell us about the future of human-computer interaction.",
    cover_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["technology", "artificial intelligence", "machine learning", "software"],
    read_time: "9 min read",
    featured: false
  },
  {
    title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
    excerpt: "Exploring how blockchain technology is being used in various industries beyond digital currencies.",
    content: "While blockchain is most commonly associated with cryptocurrency, its potential applications extend far beyond Bitcoin and similar digital assets. This article examines how industries including supply chain management, healthcare, real estate, and voting systems are implementing blockchain technology to increase transparency, security, and efficiency. We'll also address the challenges these implementations face and how they're being overcome.",
    cover_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["technology", "blockchain", "innovation", "digital transformation"],
    read_time: "11 min read"
  },
  {
    title: "The Future of Quantum Computing: Practical Applications on the Horizon",
    excerpt: "How quantum computing is moving from theoretical science to practical applications.",
    content: "Quantum computing has long been discussed as a revolutionary technology with the potential to solve problems beyond the reach of classical computers. This article explores recent breakthroughs in quantum computing and the practical applications that are becoming feasible in the near future. From drug discovery to materials science to logistics optimization, quantum computing is poised to transform numerous fields in ways we're just beginning to understand.",
    cover_image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["technology", "quantum computing", "innovation", "computer science"],
    read_time: "12 min read"
  },
  
  // Lifestyle Articles
  {
    title: "Mindful Living: Incorporating Presence Into Your Daily Routine",
    excerpt: "Practical strategies for bringing mindfulness into everyday moments.",
    content: "In our fast-paced world, mindfulness offers a way to reconnect with the present moment and find greater peace amid chaos. This article provides actionable techniques for incorporating mindful awareness into various aspects of daily life, from morning rituals to work tasks to evening wind-down routines. We'll explore both traditional meditation practices and informal mindfulness approaches that can be seamlessly integrated into busy modern lifestyles.",
    cover_image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["lifestyle", "mindfulness", "wellness", "mental health"],
    read_time: "6 min read"
  },
  {
    title: "The Science of Sleep: Optimizing Your Rest for Better Health",
    excerpt: "Evidence-based approaches to improving sleep quality and overall wellbeing.",
    content: "Sleep is fundamental to physical and mental health, yet many people struggle to get consistent, quality rest. This article delves into the latest scientific research on sleep and provides practical guidance for optimizing your sleep environment, schedule, and habits. From understanding sleep cycles to managing technology use, these evidence-based strategies can help you wake up feeling more refreshed and improve your overall health outcomes.",
    cover_image: "https://images.unsplash.com/photo-1541781774-95cd2761a3ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["lifestyle", "health", "sleep", "wellness"],
    read_time: "8 min read"
  },
  {
    title: "Sustainable Living on a Budget: Small Changes with Big Impact",
    excerpt: "How to make eco-friendly lifestyle choices without breaking the bank.",
    content: "Many people assume that living sustainably requires significant financial investment, but that's not always the case. This article presents affordable ways to reduce your environmental footprint through thoughtful consumption, waste reduction, energy conservation, and other daily choices. We'll explore how these small changes can collectively make a meaningful difference while often saving money in the long run.",
    cover_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["lifestyle", "sustainability", "budget living", "eco-friendly"],
    read_time: "7 min read"
  },
  
  // Travel Articles
  {
    title: "Hidden Gems: Underexplored Destinations for Authentic Travel Experiences",
    excerpt: "Discover less-traveled locations that offer rich cultural experiences away from tourist crowds.",
    content: "While popular destinations have their appeal, there's something special about discovering places that aren't on every traveler's itinerary. This article highlights several underexplored locations around the world that offer authentic cultural experiences, breathtaking landscapes, and memorable adventures without the crowds. From remote villages to lesser-known cities, these destinations reward travelers seeking genuine connections and unique stories.",
    cover_image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["travel", "destinations", "adventure", "cultural travel"],
    read_time: "9 min read"
  },
  {
    title: "Sustainable Tourism: How to Travel Responsibly in a Changing World",
    excerpt: "Practical tips for minimizing your environmental impact while maximizing cultural engagement.",
    content: "As awareness of tourism's environmental and social impacts grows, many travelers are seeking ways to explore the world more responsibly. This article provides concrete strategies for sustainable travel, from choosing eco-conscious accommodations to supporting local economies to reducing carbon footprints. We'll also discuss how to respectfully engage with local communities and preserve the natural and cultural treasures that make travel so enriching.",
    cover_image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["travel", "sustainability", "eco-tourism", "responsible travel"],
    read_time: "8 min read"
  },
  {
    title: "The Art of Solo Travel: Finding Freedom and Connection on the Road",
    excerpt: "Insights and advice for those traveling alone, whether by choice or circumstance.",
    content: "Traveling alone offers unique opportunities for personal growth, freedom, and unexpected connections. This article explores the joys and challenges of solo travel, with practical advice for safety, meeting people, and making the most of independent adventures. Drawing on experiences from solo travelers of different ages and backgrounds, we'll discuss how to overcome common concerns and embrace the transformative potential of exploring the world on your own terms.",
    cover_image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["travel", "solo travel", "adventure", "personal growth"],
    read_time: "10 min read"
  }
];

const App = () => {
  // Only run this effect once to seed the database with dummy articles
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        // First check if articles already exist to avoid duplicates
        const { data: existingArticles, error: checkError } = await supabase
          .from('articles')
          .select('id')
          .limit(1);
        
        if (checkError) {
          console.error("Error checking for existing articles:", checkError);
          return;
        }
        
        // Only seed if no articles exist
        if (existingArticles && existingArticles.length === 0) {
          console.log("No articles found, seeding database...");
          
          // Get author ID from profiles table
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
          if (profileError || !profiles || profiles.length === 0) {
            console.error("No user profiles found. Please create an account first.");
            return;
          }
          
          const authorId = profiles[0].id;
          
          // Insert articles with the author ID
          for (const article of dummyArticles) {
            const { error } = await supabase
              .from('articles')
              .insert({
                ...article,
                author_id: authorId,
                published: true,
                status: 'published',
                published_at: new Date().toISOString(),
                likes: Math.floor(Math.random() * 50),
                comments: Math.floor(Math.random() * 10)
              });
              
            if (error) {
              console.error("Error inserting article:", error);
            }
          }
          
          console.log("Database seeding completed");
        } else {
          console.log("Articles already exist, skipping database seeding");
        }
      } catch (error) {
        console.error("Error in database seeding:", error);
      }
    };
    
    seedDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/article/:id/:slug" element={<ArticleDetail />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/all-articles" element={<AllArticles />} />
              
              {/* Company pages */}
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Resources pages */}
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/guidelines" element={<WritingGuidelines />} />
              <Route path="/community" element={<Community />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/new-story" element={<Editor />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Redirects */}
              <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/write" element={<Navigate to="/new-story" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
