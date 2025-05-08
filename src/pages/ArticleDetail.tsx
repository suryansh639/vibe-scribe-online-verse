
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
  // Support both URL formats: /article/id and /article/id/slug
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);
  const { article, relatedArticles, popularTags, loading, error } = useArticleDetail(id);
  
  useEffect(() => {
    // Log for debugging
    console.log("ArticleDetail component - Article ID:", id);
    console.log("ArticleDetail component - Article loaded:", article ? "Yes" : "No");
    
    // Show toast message if there's an error
    if (error) {
      toast.error("Error loading article: " + error);
    }
    
    // Check if the URL includes the slug and if it's incorrect, redirect to the correct one
    if (article && slug && slugify(article.title) !== slug) {
      const correctSlug = slugify(article.title);
      navigate(`/article/${id}/${correctSlug}`, { replace: true });
      toast.info("The URL has been updated to match the article title");
    }
  }, [id, article, error, slug, navigate]);
  
  const handleCommentAdded = () => {
    setCommentsRefreshTrigger(prev => prev + 1);
    toast.success("Comment added successfully!");
  };
  
  if (loading) {
    return (
      <Layout>
        <ArticleDetailSkeleton />
      </Layout>
    );
  }
  
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
