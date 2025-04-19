
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { articles, comments, users, popularTags } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Share2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import ArticleCard from "@/components/articles/ArticleCard";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [commentText, setCommentText] = useState("");
  
  // Find the current article
  const article = articles.find(article => article.id === id);
  
  // Get article comments
  const articleComments = comments.filter(comment => comment.articleId === id);
  
  // Get related articles (excluding current one)
  const relatedArticles = articles
    .filter(a => a.id !== id && a.tags.some(tag => article?.tags.includes(tag)))
    .slice(0, 3);
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Format the date for display
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article content - Takes up 2/3 on desktop */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              
              {/* Author info and date */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-brand-orange text-white">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Link to={`/profile/${article.author.id}`} className="font-medium hover:text-brand-orange">
                    {article.author.name}
                  </Link>
                  <div className="text-gray-500 text-sm">
                    {formattedDate} · {article.readTime}
                  </div>
                </div>
              </div>
              
              {/* Cover image */}
              {article.coverImage && (
                <div className="mb-8">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </header>
            
            {/* Article Content - Using markdown content */}
            <div className="prose prose-lg max-w-none mb-8">
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
              ) : (
                <p className="text-lg">{article.excerpt}</p>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tag/${tag}`}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            {/* Article actions */}
            <div className="flex items-center justify-between mb-10 py-4 border-t border-b border-gray-200">
              <div className="flex items-center gap-6">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Heart size={20} className="text-gray-600" />
                  <span>{article.likes}</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <MessageSquare size={20} className="text-gray-600" />
                  <span>{article.comments}</span>
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bookmark size={20} className="text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 size={20} className="text-gray-600" />
                </Button>
              </div>
            </div>
            
            {/* Author bio */}
            <div className="bg-gray-50 rounded-lg p-6 mb-10">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={article.author.avatar} alt={article.author.name} />
                  <AvatarFallback className="bg-brand-orange text-white">
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    <Link to={`/profile/${article.author.id}`} className="hover:text-brand-orange">
                      {article.author.name}
                    </Link>
                  </h3>
                  
                  {/* Get author bio from users data */}
                  <p className="text-gray-600 mb-3">
                    {users.find(user => user.id === article.author.id)?.bio || "Writer at Blog Company"}
                  </p>
                  
                  <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Comments section */}
            <section>
              <h3 className="text-xl font-bold mb-6">Comments ({articleComments.length})</h3>
              
              {/* Comment form */}
              <div className="mb-8">
                <Textarea
                  placeholder="Add a comment..."
                  className="mb-3 min-h-[100px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button 
                  className="bg-brand-orange hover:bg-brand-orangeDark text-white"
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>
              
              {/* Comment list */}
              <div className="space-y-6">
                {articleComments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-brand-orange text-white">
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <Link to={`/profile/${comment.author.id}`} className="font-medium hover:text-brand-orange">
                              {comment.author.name}
                            </Link>
                            <span className="text-gray-500 text-sm ml-2">
                              {new Date(comment.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 h-auto p-1">
                            <ThumbsUp size={16} className="mr-1" />
                            <span className="text-xs">{comment.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 h-auto p-1">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar - Takes up 1/3 on desktop */}
          <div className="lg:col-span-1">
            {/* Related articles */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">Related Articles</h3>
              <div className="space-y-6">
                {relatedArticles.map(article => (
                  <div key={article.id} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                        {article.author.avatar ? (
                          <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-orange text-white text-xs">
                            {article.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <Link to={`/profile/${article.author.id}`} className="text-sm font-medium hover:text-brand-orange">
                        {article.author.name}
                      </Link>
                    </div>
                    
                    <Link to={`/article/${article.id}`}>
                      <h4 className="font-bold mb-2 hover:text-brand-orange transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                    
                    {article.coverImage && (
                      <Link to={`/article/${article.id}`}>
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-40 object-cover rounded mb-2"
                        />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular tags */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 12).map(tag => (
                  <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className="text-sm px-3 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-full text-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div className="bg-brand-orange bg-opacity-10 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Subscribe for updates</h3>
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
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetail;
