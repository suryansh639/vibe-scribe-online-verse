
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Alert } from "@/components/ui/alert";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, myArticles, bookmarkedArticles, likedArticles } = useDashboardData();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Alert>Please sign in to view your dashboard.</Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-full md:w-1/4">
            <ProfileCard profile={profile} />
          </div>
          
          <div className="flex-1">
            <DashboardTabs
              myArticles={myArticles}
              bookmarkedArticles={bookmarkedArticles}
              likedArticles={likedArticles}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
