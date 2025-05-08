
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Content Editor",
      department: "Editorial",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time"
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "Contract"
    }
  ];

  return (
    <PageLayout title="Careers">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Team</h2>
        <p className="mb-4">
          At Blog Company, we're building a platform that celebrates quality content and thoughtful discussion. We're always looking for talented individuals who share our passion for great writing, innovative technology, and meaningful connections.
        </p>
        <p className="mb-4">
          Working here means joining a diverse team of creative thinkers, problem solvers, and storytellers who are committed to shaping the future of digital publishing.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Growth Opportunities</h3>
            <p>We invest in our team's professional development with continuing education stipends, conferences, and mentorship programs.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Flexible Work</h3>
            <p>We offer remote-first positions with flexible hours, focusing on results rather than rigid schedules.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Competitive Benefits</h3>
            <p>Enjoy comprehensive health coverage, generous PTO, parental leave, and a 401(k) matching program.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Meaningful Work</h3>
            <p>Your contributions will directly impact how millions of people discover and engage with quality content online.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Open Positions</h2>
        
        <div className="space-y-6">
          {openPositions.map((position, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <div className="text-gray-600">
                  <span className="font-medium">Department:</span> {position.department}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Location:</span> {position.location}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Type:</span> {position.type}
                </div>
              </div>
              <Button>View Position</Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-gray-600">Don't see a position that fits your skills?</p>
          <Button variant="outline">Send us your resume</Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Careers;
