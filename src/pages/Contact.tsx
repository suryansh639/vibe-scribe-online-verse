
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <PageLayout title="Contact Us">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Get In Touch</h2>
          <p className="mb-6 text-gray-600">
            We'd love to hear from you! Whether you have a question about our platform, need help with your account, or want to discuss partnership opportunities, our team is here to assist.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="subject">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help?" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Tell us about your inquiry..."
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
          <p className="mb-8 text-gray-600">
            If you prefer to reach out directly or visit our offices, you can use the information below.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-gray-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Headquarters</h3>
                <address className="not-italic text-gray-600">
                  1234 Blog Street<br />
                  San Francisco, CA 94107<br />
                  United States
                </address>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-6 h-6 text-gray-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-6 h-6 text-gray-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">contact@blogcompany.com</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <table className="w-full text-gray-600">
              <tbody>
                <tr>
                  <td className="py-2">Monday - Friday:</td>
                  <td>9:00 AM - 6:00 PM EST</td>
                </tr>
                <tr>
                  <td className="py-2">Saturday:</td>
                  <td>10:00 AM - 4:00 PM EST</td>
                </tr>
                <tr>
                  <td className="py-2">Sunday:</td>
                  <td>Closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Contact;
