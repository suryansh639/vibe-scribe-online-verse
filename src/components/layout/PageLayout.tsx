
import React, { ReactNode } from "react";
import Layout from "./Layout";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">{title}</h1>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default PageLayout;
