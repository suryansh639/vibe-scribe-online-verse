
import React from "react";
import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout title="About Us">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
        <p className="mb-4">
          Founded in 2020, Blog Company began with a simple mission: to create a platform where quality content could thrive in an age of fleeting social media posts and clickbait headlines.
        </p>
        <p className="mb-4">
          What started as a small team of passionate writers and tech enthusiasts has grown into a thriving community of creators, thinkers, and readers who believe in the power of well-crafted content.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
        <p className="mb-4">
          Our mission is to elevate digital publishing by providing a platform that values substance over sensation, depth over brevity, and quality over quantity.
        </p>
        <p className="mb-4">
          We believe that thoughtful, well-researched content has the power to inform, inspire, and transform. In a world of information overload, we strive to be a trusted source of knowledge and insight.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Quality</h3>
            <p>We never compromise on the quality of content we publish. Every article undergoes a rigorous editorial process.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Integrity</h3>
            <p>We maintain the highest standards of journalistic integrity, fact-checking, and ethical reporting.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Diversity</h3>
            <p>We amplify diverse voices and perspectives, believing that the best ideas emerge from a chorus of different viewpoints.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
