
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
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
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);
  const { article, relatedArticles, popularTags, loading, error } = useArticleDetail(id);
  
  const handleCommentAdded = () => {
    setCommentsRefreshTrigger(prev => prev + 1);
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

  // If the slug in the URL doesn't match the expected slug from the title,
  // we could redirect here, but for now we'll just let it render

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <ArticleHeader
              title={article.title}
              author={article.author}
              publishedAt={article.publishedAt || article.published_at || article.created_at}
              readTime={article.readTime || article.read_time || "5 min read"}
              coverImage={article.coverImage || article.cover_image}
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
