
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ArticleGrid from "./ArticleGrid";
import ArticleTabs from "./ArticleTabs";
import { ArticleDetailData } from "@/hooks/types/articleTypes";

interface MainContentProps {
  articles: ArticleDetailData[];
  loading: boolean;
}

const MainContent = ({ articles, loading }: MainContentProps) => {
  // Get the other articles (non-featured)
  const otherArticles = articles.filter(article => !article.featured);

  return (
    <div className="lg:col-span-2">
      {/* Display some articles before the tabs section */}
      {!loading && otherArticles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <ArticleGrid articles={otherArticles.slice(0, 4)} />
        </div>
      )}
      
      {/* Tabs section for latest/popular articles */}
      <ArticleTabs articles={otherArticles} loading={loading} />
    </div>
  );
};

export default MainContent;
