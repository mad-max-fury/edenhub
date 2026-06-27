import Link from "next/link";
import { Footer, GlobalMenu } from "@/components";

export default function PrivacyPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link><span>{">"}</span><span className="text-N700">Privacy Policy</span>
        </nav>
        <h1 className="text-2xl font-bold text-N900 mb-6">Privacy Policy</h1>
        <p className="text-xs text-N400 mb-6">Last updated: January 2026</p>
        <div className="flex flex-col gap-6 text-sm text-N600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Information We Collect</h2>
            <p>We collect information you provide directly — such as your name, email, phone number, and shipping address when you create an account, place an order, or contact us. We also collect usage data through cookies and analytics tools to improve our service.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer support inquiries</li>
              <li>Improve our website and product offerings</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. Payment data is processed securely through our payment partners (Paystack and Stripe) and is never stored on our servers.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Cookies</h2>
            <p>We use cookies to maintain your session, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Third-Party Services</h2>
            <p>We share necessary data with trusted third parties to fulfill orders (shipping partners), process payments (Paystack, Stripe), and analyze usage (analytics). We do not sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@edenwoodwatchhub.com" className="text-BR500 hover:underline">support@edenwoodwatchhub.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
