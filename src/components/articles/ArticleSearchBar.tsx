
import { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ArticleSearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  searchFilter: string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  clearSearch: () => void;
}

const ArticleSearchBar = ({
  searchTerm,
  setSearchTerm,
  searchFilter,
  onSubmit,
  clearSearch
}: ArticleSearchBarProps) => (
  <form onSubmit={onSubmit} className="relative w-full md:w-auto">
    <Input
      type="text"
      placeholder="Search articles..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="pr-10 w-full md:w-64"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
      {(searchFilter || searchTerm) && (
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 p-0 mr-1" onClick={clearSearch}>
          <X size={14} />
        </Button>
      )}
      <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 p-0">
        <Search size={14} />
      </Button>
    </div>
  </form>
);

export default ArticleSearchBar;
