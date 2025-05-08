
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Award, Calendar } from "lucide-react";

const Community = () => {
  const upcomingEvents = [
    {
      title: "Writing Workshop: Crafting Compelling Headlines",
      date: "June 15, 2025",
      time: "1:00 PM - 2:30 PM EST",
      type: "Virtual"
    },
    {
      title: "Tech Writers Meetup",
      date: "June 22, 2025",
      time: "6:30 PM - 8:00 PM PST",
      type: "In-person (San Francisco)"
    },
    {
      title: "Q&A Session with Professional Editors",
      date: "July 5, 2025",
      time: "11:00 AM - 12:00 PM EST",
      type: "Virtual"
    }
  ];

  return (
    <PageLayout title="Community">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">Join Our Thriving Community</h2>
          <p className="text-lg mb-6">
            Connect with fellow writers, readers, and enthusiasts who share your passion for quality content and meaningful discussions.
          </p>
          <Button size="lg">Join Now</Button>
        </div>

        <p className="mb-8 text-lg">
          The Blog Company community is where ideas flourish, connections form, and writers at all stages of their journey find support and inspiration. Whether you're looking to improve your writing skills, receive feedback on your work, or simply engage with like-minded individuals, our community has something for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Discussion Forums</h3>
            <p className="text-gray-600 mb-4">
              Engage in thoughtful conversations on a wide range of topics with community members from around the world.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Writing Groups</h3>
            <p className="text-gray-600 mb-4">
              Join specialized groups based on your interests, where you can share your work and receive constructive feedback.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Recognition Programs</h3>
            <p className="text-gray-600 mb-4">
              Get your work highlighted through our featured author program and annual writing competitions.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Upcoming Community Events
        </h2>

        <div className="space-y-6">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium mb-2">{event.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <div className="text-gray-600">
                  <span className="font-medium">Date:</span> {event.date}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Time:</span> {event.time}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Format:</span> {event.type}
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button>Register</Button>
                <Button variant="outline">Add to Calendar</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Community Guidelines</h2>
        <p className="mb-4">
          Our community thrives on respect, collaboration, and positivity. To ensure a productive environment for everyone, we ask all members to follow these core principles:
        </p>

        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <span className="font-medium">Be respectful</span>: Treat others with kindness and consideration, even when you disagree.
          </li>
          <li>
            <span className="font-medium">Provide constructive feedback</span>: When commenting on others' work, focus on being helpful rather than harsh.
          </li>
          <li>
            <span className="font-medium">Stay on topic</span>: Keep discussions relevant to the forums and groups you're participating in.
          </li>
          <li>
            <span className="font-medium">Give credit</span>: Always attribute ideas, quotes, and content that isn't yours.
          </li>
          <li>
            <span className="font-medium">No spam or self-promotion</span>: Excessive self-promotion or unrelated links are not permitted.
          </li>
        </ul>
      </section>

      <section>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Connect with fellow writers, participate in events, and take your writing to the next level with support from peers and professionals.
          </p>
          <div className="space-x-4">
            <Button size="lg">Create an Account</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Community;
