
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, PenSquare, Bell, User, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-articles?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate is handled within signOut function in AuthContext
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              alt="Blog Company" 
              className="h-10" 
              src="/lovable-uploads/3efa0f09-9113-4a2d-8a87-9d8474d73326.png" 
            />
          </Link>
          
          <div className="hidden md:flex items-center relative">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 text-gray-400 top-1/2 -translate-y-1/2" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white border border-gray-200 focus:border-brand-orange focus:outline-none w-64" 
              />
            </form>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/all-articles">
            <Button variant="ghost" className="hidden md:flex items-center gap-2 text-gray-600">
              <Eye size={20} />
              <span>View All</span>
            </Button>
          </Link>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell size={20} />
              </Button>
              
              <Link to="/new-story">
                <Button variant="ghost" className="hidden md:flex items-center gap-2 text-gray-600">
                  <PenSquare size={20} /> 
                  <span>Write</span>
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="bg-brand-orange text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <User size={18} />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">My Stories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard?tab=bookmarks" className="w-full cursor-pointer">Bookmarks</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/edit-profile" className="w-full cursor-pointer">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500 cursor-pointer" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-700">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-brand-orange hover:bg-brand-orangeDark text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
