
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ArticleLoadingStateProps {
  count?: number;
}

const ArticleLoadingState = ({ count = 3 }: ArticleLoadingStateProps) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="border-b border-gray-200 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    ))}
  </div>
);

export default ArticleLoadingState;
