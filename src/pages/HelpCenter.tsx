
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, FileQuestion, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide an email address and create a password. You can also sign up using your Google or Facebook account for quicker access."
    },
    {
      question: "How do I publish an article?",
      answer: "Once logged in, click on the 'Write' button in the navigation bar. This will take you to our editor where you can write and format your article. When you're satisfied with your work, click 'Publish' to share it with our community."
    },
    {
      question: "Can I edit my published article?",
      answer: "Yes! You can edit your published articles at any time. Simply navigate to the article and click on the 'Edit' button that appears near the title when you're the author."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on the 'Sign In' button, then select 'Forgot Password?' You'll be prompted to enter your email address, and we'll send you instructions to reset your password."
    }
  ];

  return (
    <PageLayout title="Help Center">
      <div className="mb-10">
        <div className="bg-gray-50 rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-center">How can we help you?</h2>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input 
              className="pl-12 pr-4 py-6 text-lg" 
              placeholder="Search for articles, tutorials, and FAQs..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
            <BookOpen className="h-10 w-10 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold mb-2">Guides & Tutorials</h3>
            <p className="text-gray-600 mb-4">Step-by-step instructions for using our platform features</p>
            <Button variant="link">View guides</Button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
            <FileQuestion className="h-10 w-10 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold mb-2">FAQs</h3>
            <p className="text-gray-600 mb-4">Answers to commonly asked questions about our services</p>
            <Button variant="link">View FAQs</Button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
            <MessageSquare className="h-10 w-10 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Get in touch with our friendly support team</p>
            <Button variant="link">Contact us</Button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-gray-600 mb-4">Join discussions with other users and our team</p>
            <Button variant="link">Join community</Button>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button>View all FAQs</Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default HelpCenter;
