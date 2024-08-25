import { pageTitleStyles } from "@/styles/common";

export default function PrivacyPolicy() {
  return (
    <div className="py-24 mx-auto max-w-[700px] space-y-6">
      <h1 className={pageTitleStyles}>Privacy Policy </h1>
      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          Welcome to Ascendio, an app that helps you achieve your goals. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our mobile application.
        </p>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p>
          We may collect personal information that you provide directly to us
          when you use our app, such as:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Goals and progress data</li>
          <li>Usage data and app interactions</li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">
          How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Personalize your experience</li>
          <li>Communicate with you about your goals and progress</li>
          <li>Analyze usage patterns to enhance our app</li>
        </ul>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized or unlawful
          processing, accidental loss, destruction, or damage.
        </p>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">
          Data Sharing and Disclosure
        </h2>
        <p>
          We do not sell your personal information. We may share your
          information with third-party service providers who help us operate our
          app, but only as necessary to provide our services to you.
        </p>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal
          information. You can do this through the app settings or by contacting
          us directly.
        </p>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last Updated&quot; date.
        </p>
      </section>

      <section className="py-3">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{" "}
          <a
            href="mailto:privacy@ascendio.xyz"
            className="text-blue-600 hover:underline"
          >
            privacy@ascendio.xyz
          </a>
        </p>
      </section>

      <p className="mt-8 text-sm text-gray-600">Last Updated: June 30, 2024</p>
    </div>
  );
}
