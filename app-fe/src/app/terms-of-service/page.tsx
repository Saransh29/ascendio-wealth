import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="py-24 mx-auto max-w-[700px] space-y-6">
      <h1 className={pageTitleStyles}>Terms of Service </h1>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">Liability</h2>
        <p>
          Our commitment to providing Ascendio, an app that helps you achieve
          your goals, is founded on the principles of transparency and user
          responsibility. It is important to understand the following regarding
          liability:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            No Warranty or Guarantee: We provide Ascendio &apos;as-is&apos; and
            without any warranty or guarantee. While we make every effort to
            ensure the functionality, security, and reliability of our app, we
            do not make any representations or warranties regarding the
            accuracy, completeness, or suitability of the information and
            materials found or offered within Ascendio.
          </li>
          <li>
            Exclusion of Liability: In no event shall we be liable for any
            direct, indirect, incidental, consequential, special, or exemplary
            damages, including but not limited to, damages for loss of profits,
            goodwill, use, data, or other intangible losses, resulting from the
            use or inability to use Ascendio.
          </li>
          <li>
            User Responsibility: You acknowledge and agree that your use of
            Ascendio is at your own risk. We are not responsible for any damages
            or issues that may arise, including but not limited to, data loss,
            system errors, or interruptions in service. It is your
            responsibility to take appropriate precautions and ensure that any
            services or information obtained through our app meet your specific
            requirements.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <p>
          By creating an account on Ascendio, you acknowledge and agree to the
          following terms:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            Account Management: We reserve the right to manage your account at
            our discretion. This includes the right to delete, suspend, or lock
            your account and associated data without prior notice.
          </li>
          <li>
            Termination: We may terminate or suspend your account for any
            reason, including breach of these terms. In the event of
            termination, you will no longer have access to your account and any
            data associated with it.
          </li>
          <li>
            Account Security: It is your responsibility to maintain the security
            of your account credentials. You agree not to share your login
            information with third parties.
          </li>
          <li>
            Account Data: You can delete your account and all associated data we
            store in our system at any time by going to your account settings
            page and deleting your account. Please note that once your account
            is deleted, there is no way to recover your data.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">
          Uptime, Security, and Privacy
        </h2>
        <p>By using Ascendio, you acknowledge and agree to the following:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            Uptime: While we strive to maintain the availability of Ascendio, we
            do not provide any service level agreement (SLA). The app&apos;s
            uptime may be subject to occasional interruptions, including
            maintenance, updates, or unforeseen technical issues.
          </li>
          <li>
            Security: We implement reasonable security measures to protect the
            integrity of our platform. However, you acknowledge that no online
            service can be completely secure.
          </li>
          <li>
            Privacy: Your privacy is important to us. Our privacy practices are
            outlined in our separate Privacy Policy, which is an integral part
            of these terms. By using Ascendio, you agree to the collection, use,
            and disclosure of your information as described in the Privacy
            Policy.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">
          Copyright and Content Ownership
        </h2>
        <p>
          When it comes to copyright and content ownership, it&apos;s important
          to understand the following terms:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            Ownership of Generated Content: We do not claim any rights to the
            content or goals you create within Ascendio. The content you produce
            using our service is considered your intellectual property, and we
            respect your ownership rights.
          </li>
          <li>
            Developer Protection: We want to foster a collaborative environment
            and assure you that your creative ideas are valued. By using
            Ascendio, you provide developers with the freedom to explore and
            work on projects that may be conceptually similar in the future.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">Features and Bugs</h2>
        <p>
          Our commitment to providing a quality service involves continuous
          efforts to enhance features and address any bugs:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            Continuous Improvement: We are dedicated to continuously adding new
            features and improving existing functionalities to enhance your
            experience with Ascendio.
          </li>
          <li>
            Bug Fixes: While we strive to maintain a seamless experience, you
            understand that bugs may be identified and fixed during the course
            of our ongoing development efforts.
          </li>
          <li>
            Impact on User Experience: Changes to Ascendio, including the
            introduction of new features or bug fixes, may impact your overall
            experience. You accept that such changes are inherent in the nature
            of software development.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">
          Use of AI and Third Party Services
        </h2>
        <p>
          Our commitment to providing cutting-edge services involves the use of
          artificial intelligence and third-party services:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            AI Integration: Ascendio utilizes artificial intelligence to enhance
            your goal-setting and achievement process. This may include
            AI-powered suggestions, progress tracking, and personalized
            insights.
          </li>
          <li>
            Third-Party Services: We may utilize third-party services to employ
            authentication and artificial intelligence features. These
            third-party services are independent entities, and we are not
            responsible for their operations or performance.
          </li>
          <li>
            No Affiliation: We are not affiliated with the third-party AI
            services we employ. Any issues or concerns related to their services
            should be directed to the respective third-party providers.
          </li>
          <li>
            User Responsibility: By using Ascendio, you agree that it is your
            responsibility to familiarize yourself with the laws of your own
            country concerning the use of AI-generated content and insights.
          </li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-xl font-semibold mb-4">
          Updates to Terms of Service
        </h2>
        <p>
          To ensure transparency and compliance, it&apos;s important to be aware
          of our policy regarding updates to the terms of service:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>
            Right to Update: We reserve the right to update these terms of
            service at any time. Updates may be made to reflect changes in our
            services, legal requirements, or other considerations.
          </li>
          <li>
            No Obligation to Notify: While we may make efforts to communicate
            significant changes, you agree that we are not obligated to notify
            users individually when updates occur.
          </li>
          <li>
            Review of Terms: It&apos;s advisable to review these terms regularly
            to ensure that you are aware of any changes that may affect your use
            of Ascendio.
          </li>
        </ul>
      </section>

      <p className="mt-8 text-sm text-gray-600">Last Updated: June 30, 2024</p>
    </div>
  );
}
