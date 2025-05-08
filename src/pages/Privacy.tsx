
import React from "react";
import PageLayout from "@/components/layout/PageLayout";

const Privacy = () => {
  return (
    <PageLayout title="Privacy Policy">
      <div className="mb-8">
        <p className="text-gray-600 mb-4">Last updated: May 8, 2025</p>
        <p className="mb-4">
          Blog Company ("we", "us", or "our") operates the www.blogcompany.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>
        <p className="mb-4">
          We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">1. Information Collection and Use</h2>
        <p className="mb-4">
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>

        <h3 className="text-lg font-semibold mb-2">Types of Data Collected</h3>
        
        <h4 className="font-semibold mb-2">Personal Data</h4>
        <p className="mb-4">
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h4 className="font-semibold mb-2">Usage Data</h4>
        <p className="mb-4">
          We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
        </p>

        <h4 className="font-semibold mb-2">Tracking & Cookies Data</h4>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
        </p>
        <p className="mb-4">
          Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
        </p>
        <p className="mb-4">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">2. Use of Data</h2>
        <p className="mb-4">
          Blog Company uses the collected data for various purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
          <li>To provide customer care and support</li>
          <li>To provide analysis or valuable information so that we can improve the Service</li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">3. Transfer of Data</h2>
        <p className="mb-4">
          Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
        </p>
        <p className="mb-4">
          If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.
        </p>
        <p className="mb-4">
          Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
        </p>
        <p className="mb-4">
          Blog Company will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">4. Your Data Protection Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>The right to access, update or delete the information we have on you</li>
          <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
          <li>The right to object - the right to object to our processing of your Personal Data</li>
          <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
          <li>The right to data portability - the right to be provided with a copy of your Personal Data in a structured, machine-readable and commonly used format</li>
          <li>The right to withdraw consent - the right to withdraw your consent at any time where we relied on your consent to process your personal information</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">5. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>By email: privacy@blogcompany.com</li>
          <li>By visiting this page on our website: www.blogcompany.com/contact</li>
        </ul>
      </section>
    </PageLayout>
  );
};

export default Privacy;
