
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { users, articles } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import ArticleCard from "@/components/articles/ArticleCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the user
  const user = users.find(user => user.id === id);
  
  // Get user's articles
  const userArticles = articles.filter(article => article.author.id === id);
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="mb-8">The user profile you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-brand-orange text-white text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
              
              <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-6">
                <div>
                  <span className="font-bold">{userArticles.length}</span>
                  <span className="text-gray-500 ml-1">Stories</span>
                </div>
                <div>
                  <span className="font-bold">{user.followers}</span>
                  <span className="text-gray-500 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold">{user.following}</span>
                  <span className="text-gray-500 ml-1">Following</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                  Follow
                </Button>
                <Button variant="outline">
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content tabs */}
        <Tabs defaultValue="stories">
          <TabsList className="mb-8">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stories">
            {userArticles.length > 0 ? (
              <div>
                {userArticles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold mb-2">No stories yet</h3>
                <p className="text-gray-600 mb-6">
                  {user.name.split(' ')[0]} hasn't published any stories yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
              <h2 className="text-xl font-bold mb-4">About {user.name}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Member since</h3>
                  <p className="text-gray-600">January 2023</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
