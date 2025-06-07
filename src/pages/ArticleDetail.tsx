
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import CommentForm from "@/components/comments/CommentForm";
import CommentsList from "@/components/comments/CommentsList";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleContent from "@/components/articles/ArticleContent";
import ArticleActions from "@/components/articles/ArticleActions";
import AuthorBio from "@/components/articles/AuthorBio";
import RelatedArticles from "@/components/articles/RelatedArticles";
import PopularTopics from "@/components/articles/PopularTopics";
import ArticleDetailSkeleton from "@/components/articles/ArticleDetailSkeleton";
import ArticleNotFound from "@/components/articles/ArticleNotFound";
import NewsletterSignup from "@/components/articles/NewsletterSignup";
import { useArticleDetail } from "@/hooks/useArticleDetail";
import { slugify } from "@/lib/utils";

const ArticleDetail = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);
  
  // Use the hook to fetch article data
  const { article, relatedArticles, popularTags, loading, error } = useArticleDetail(id);
  
  useEffect(() => {
    // Log for debugging
    console.log("ArticleDetail component - Article ID:", id);
    
    if (article) {
      console.log("Article loaded successfully:", article.title);
      document.title = `${article.title} | Blog`;
      
      // Check if the URL includes the slug and if it's incorrect, redirect to the correct one
      if (slug && slugify(article.title) !== slug) {
        const correctSlug = slugify(article.title);
        navigate(`/article/${id}/${correctSlug}`, { replace: true });
      }
    } else if (error && !loading) {
      console.error("Error loading article:", error);
      toast.error("Error loading article: " + error);
    }
  }, [id, article, error, slug, navigate, loading]);
  
  const handleCommentAdded = () => {
    setCommentsRefreshTrigger(prev => prev + 1);
    toast.success("Comment added successfully!");
  };
  
  // Show loading state while fetching
  if (loading) {
    return (
      <Layout>
        <ArticleDetailSkeleton />
      </Layout>
    );
  }
  
  // If no article was found, show the not found component
  if (error || !article) {
    return (
      <Layout>
        <ArticleNotFound error={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <ArticleHeader
              title={article.title}
              author={article.author}
              publishedAt={article.publishedAt || ""}
              readTime={article.readTime || "5 min read"}
              coverImage={article.coverImage}
            />
            
            <ArticleContent
              content={article.content}
              excerpt={article.excerpt}
              tags={article.tags}
            />
            
            <ArticleActions
              articleId={article.id}
              initialLikes={article.likes || 0}
              initialComments={article.comments || 0}
            />
            
            <AuthorBio author={article.author} />
            
            {/* Comments section */}
            <section>
              <h3 className="text-xl font-bold mb-6">Comments ({article.comments || 0})</h3>
              <CommentForm 
                articleId={article.id}
                onCommentAdded={handleCommentAdded}
              />
              <CommentsList 
                articleId={article.id} 
                refreshTrigger={commentsRefreshTrigger} 
              />
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RelatedArticles articles={relatedArticles} />
            <PopularTopics tags={popularTags} />
            <NewsletterSignup />
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetail;
