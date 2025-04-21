
import Layout from "@/components/layout/Layout";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import ArticleCard from "@/components/articles/ArticleCard";
import { articles, popularTags } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomePage = () => {
  // Get the featured article
  const featuredArticle = articles.find(article => article.featured);
  
  // Get the other articles (non-featured)
  const otherArticles = articles.filter(article => !article.featured);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section with featured article */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Discover stories that matter</h1>
          {featuredArticle && <FeaturedArticle {...featuredArticle} />}
        </section>

        {/* Main content with sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Article list */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="latest">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                <Link to="/articles">
                  <Button variant="ghost" className="text-brand-orange">View All</Button>
                </Link>
              </div>
              
              <TabsContent value="latest">
                <div>
                  {otherArticles.map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="popular">
                <div>
                  {/* For demo, we'll use the same articles but sorted by likes */}
                  {[...otherArticles]
                    .sort((a, b) => b.likes - a.likes)
                    .map(article => (
                      <ArticleCard key={article.id} {...article} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Popular tags */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Link
                    key={tag}
                    to={`/all-articles?tag=${encodeURIComponent(tag)}`}
                    className="text-sm px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="bg-brand-orange bg-opacity-10 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Stay in the loop</h3>
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
              <p className="text-xs text-gray-500 mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
