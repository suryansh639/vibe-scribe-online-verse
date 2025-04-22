
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Alert } from "@/components/ui/alert";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useDashboardData } from "@/hooks/useDashboardData";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lazy load the tabs component to improve initial load time
const LazyDashboardTabs = lazy(() => import("@/components/dashboard/DashboardTabs").then(
  module => ({ default: module.DashboardTabs })
));

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, myArticles, bookmarkedArticles, likedArticles, loading } = useDashboardData();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

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
            {loading ? (
              <div className="bg-white p-6 rounded-lg border border-gray-200 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <ProfileCard profile={profile} />
            )}
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <LoadingSpinner />
              </div>
            ) : (
              <Suspense fallback={<div className="bg-white p-6 rounded-lg border border-gray-200 flex justify-center"><LoadingSpinner /></div>}>
                <LazyDashboardTabs
                  myArticles={myArticles}
                  bookmarkedArticles={bookmarkedArticles}
                  likedArticles={likedArticles}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
