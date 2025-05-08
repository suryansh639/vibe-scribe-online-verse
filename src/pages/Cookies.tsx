
import React from "react";
import PageLayout from "@/components/layout/PageLayout";

const Cookies = () => {
  return (
    <PageLayout title="Cookie Policy">
      <div className="mb-8">
        <p className="text-gray-600 mb-4">Last updated: May 8, 2025</p>
        <p className="mb-4">
          This Cookie Policy explains how Blog Company ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website at www.blogcompany.com ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">1. What are cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p className="mb-4">
          Cookies set by the website owner (in this case, Blog Company) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">2. Why do we use cookies?</h2>
        <p className="mb-4">
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
        </p>
        <p className="mb-4">
          The specific types of first and third-party cookies served through our Website and the purposes they perform are described below:
        </p>

        <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
        <p className="mb-4">
          These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website, you cannot refuse them without impacting how our Website functions.
        </p>

        <h3 className="text-lg font-semibold mb-2">Performance and Functionality Cookies</h3>
        <p className="mb-4">
          These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
        </p>

        <h3 className="text-lg font-semibold mb-2">Analytics and Customization Cookies</h3>
        <p className="mb-4">
          These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you in order to enhance your experience.
        </p>

        <h3 className="text-lg font-semibold mb-2">Advertising Cookies</h3>
        <p className="mb-4">
          These cookies are used to make advertising messages more relevant to you and your interests. They also perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">3. How can you control cookies?</h2>
        <p className="mb-4">
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided below.
        </p>
        <p className="mb-4">
          You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
        </p>
        <p className="mb-4">
          In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit http://www.aboutads.info/choices/ or http://www.youronlinechoices.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">4. How often will we update this Cookie Policy?</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p className="mb-4">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Where can you get further information?</h2>
        <p className="mb-4">
          If you have any questions about our use of cookies or other technologies, please email us at privacy@blogcompany.com or contact us through the methods described on our Contact page.
        </p>
      </section>
    </PageLayout>
  );
};

export default Cookies;
