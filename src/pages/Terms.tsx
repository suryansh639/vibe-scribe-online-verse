
import React from "react";
import PageLayout from "@/components/layout/PageLayout";

const Terms = () => {
  return (
    <PageLayout title="Terms of Service">
      <div className="mb-8">
        <p className="text-gray-600 mb-4">Last updated: May 8, 2025</p>
        <p className="mb-4">
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Blog Company website and services operated by Blog Company.
        </p>
        <p className="mb-4">
          Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
        </p>
        <p className="mb-4">
          By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">1. Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        <p className="mb-4">
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </p>
        <p className="mb-4">
          You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">2. Content</h2>
        <p className="mb-4">
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
        </p>
        <p className="mb-4">
          By posting Content on or through the Service, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.
          </li>
          <li>
            The posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.
          </li>
        </ul>
        <p className="mb-4">
          We reserve the right to remove Content that violates these Terms or that we determine, in our sole discretion, is unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">3. Copyright Policy</h2>
        <p className="mb-4">
          We respect the intellectual property rights of others and expect users of our Service to do the same. It is our policy to respond to any claim that Content posted on the Service infringes on the copyright or other intellectual property rights of any person or entity.
        </p>
        <p className="mb-4">
          If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to copyright@blogcompany.com, with the subject line: "Copyright Infringement" and include in your claim a detailed description of the alleged Infringement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">4. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall Blog Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">5. Changes</h2>
        <p className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <p className="mb-4">
          By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at legal@blogcompany.com.
        </p>
      </section>
    </PageLayout>
  );
};

export default Terms;
