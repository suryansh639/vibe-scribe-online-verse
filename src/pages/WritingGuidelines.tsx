
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Check, AlertCircle } from "lucide-react";

const WritingGuidelines = () => {
  return (
    <PageLayout title="Writing Guidelines">
      <section className="mb-12">
        <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-8">
          <p className="text-lg">
            Our platform is built on quality content that informs, engages, and inspires readers. The following guidelines are designed to help you create content that resonates with our audience and meets our publication standards.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Content Standards</h2>
        <p className="mb-6">
          We welcome original, thoughtful articles that provide value to readers. Whether you're writing about technology, business, lifestyle, or any other topic, your content should be:
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold">Original</h3>
              <p className="text-gray-600">All content must be your original work or properly attributed. Plagiarism in any form will not be tolerated.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold">Factual</h3>
              <p className="text-gray-600">Information presented as fact must be accurate and verifiable. Include credible sources for claims, statistics, and research.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold">Valuable</h3>
              <p className="text-gray-600">Articles should provide insight, information, or entertainment value to readers. Avoid shallow content that doesn't add anything new to the conversation.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold">Well-structured</h3>
              <p className="text-gray-600">Content should have a clear introduction, body, and conclusion. Use headings, subheadings, and paragraphs to organize your thoughts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Style Guidelines</h2>
        
        <h3 className="font-semibold text-lg mb-2">Voice and Tone</h3>
        <p className="mb-4">
          Write in a clear, conversational style that engages readers. Avoid excessive jargon unless writing for a specialized audience. Be authentic, but professional.
        </p>

        <h3 className="font-semibold text-lg mb-2">Grammar and Mechanics</h3>
        <p className="mb-4">
          Proper grammar, spelling, and punctuation are essential. Proofread your work carefully before submission.
        </p>

        <h3 className="font-semibold text-lg mb-2">Formatting</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Use headings (H2, H3) to organize content</li>
          <li>Keep paragraphs relatively short (3-5 sentences)</li>
          <li>Use bullet points or numbered lists when appropriate</li>
          <li>Include relevant images, charts, or infographics</li>
          <li>Bold or italicize text sparingly for emphasis</li>
        </ul>

        <h3 className="font-semibold text-lg mb-2">Article Length</h3>
        <p className="mb-6">
          We recommend articles between 800-2,000 words, depending on the topic complexity. Quality matters more than quantity, so focus on providing comprehensive coverage without unnecessary padding.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Content Restrictions</h2>
        <p className="mb-4">
          The following content is not permitted on our platform:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <p className="text-gray-600">Content that promotes hate speech, discrimination, or violence</p>
            </div>
          </div>

          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <p className="text-gray-600">Misleading, false, or defamatory information</p>
            </div>
          </div>

          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <p className="text-gray-600">Content that violates copyright or intellectual property rights</p>
            </div>
          </div>

          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <p className="text-gray-600">Spam, excessive self-promotion, or purely commercial content</p>
            </div>
          </div>

          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
            <div>
              <p className="text-gray-600">Adult content or other material not suitable for a general audience</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Submission Process</h2>
        <p className="mb-4">
          Once you've written your article following these guidelines:
        </p>

        <ol className="list-decimal pl-6 mb-8 space-y-2">
          <li>Submit your draft through our editor platform</li>
          <li>Our editorial team will review your submission within 3-5 business days</li>
          <li>You'll receive feedback and any requested revisions</li>
          <li>Once approved, your article will be published on our platform</li>
        </ol>

        <div className="bg-gray-50 border-l-4 border-blue-500 p-6">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="mb-4">
            If you have questions about these guidelines or need assistance with your submission, please contact our editorial team at editors@blogcompany.com.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default WritingGuidelines;
