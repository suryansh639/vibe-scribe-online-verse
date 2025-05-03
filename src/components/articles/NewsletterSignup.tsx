
import React from "react";
import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <div className="bg-brand-orange bg-opacity-10 rounded-lg p-6">
      <h3 className="font-bold text-lg mb-2">Subscribe for updates</h3>
      <p className="text-gray-600 mb-4">Get the latest articles delivered right to your inbox</p>
      
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-orange focus:outline-none"
        />
        <Button className="w-full bg-brand-orange hover:bg-brand-orangeDark text-white">
          Subscribe
        </Button>
      </div>
    </div>
  );
};

export default NewsletterSignup;
