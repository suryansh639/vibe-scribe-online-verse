
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenSquare } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const ProfileCard = ({ profile }: { profile: Profile | null }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-center mb-6">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>
      
      <div className="space-y-3">
        <Link to="/edit-profile">
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </Link>
        <Link to="/new-story">
          <Button className="w-full bg-brand-orange hover:bg-brand-orangeDark">
            <PenSquare className="mr-2 h-4 w-4" />
            Write a Story
          </Button>
        </Link>
      </div>
    </div>
  );
};
