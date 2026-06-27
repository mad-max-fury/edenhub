import Link from "next/link";
import { Footer, GlobalMenu } from "@/components";

export default function TermsPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link><span>{">"}</span><span className="text-N700">Terms & Conditions</span>
        </nav>
        <h1 className="text-2xl font-bold text-N900 mb-6">Terms & Conditions</h1>
        <p className="text-xs text-N400 mb-6">Last updated: January 2026</p>
        <div className="flex flex-col gap-6 text-sm text-N600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">1. General</h2>
            <p>By accessing and using the Eden Wood Watch Hub website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">2. Products & Pricing</h2>
            <p>All products listed are subject to availability. Prices are displayed in Nigerian Naira (₦) and are subject to change without prior notice. We make every effort to ensure accuracy of product descriptions and pricing.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">3. Orders & Payment</h2>
            <p>By placing an order, you are making an offer to purchase. We reserve the right to accept or decline any order. Payment is processed securely through our payment partners (Paystack and Stripe). Orders are confirmed once payment is successfully received.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">4. Shipping</h2>
            <p>We ship nationwide within Nigeria. Delivery times and costs vary depending on your location and the shipping method selected at checkout. Please refer to our <Link href="/shipping-returns" className="text-BR500 hover:underline">Shipping & Returns</Link> page for details.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">5. Returns & Refunds</h2>
            <p>We accept returns on eligible items within the return window specified on the product page. Items must be in their original condition and packaging. Refunds are processed to the original payment method within 5-10 business days.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">6. Intellectual Property</h2>
            <p>All content on this website — including text, images, logos, and designs — is the property of Eden Wood Watch Hub and is protected by copyright law. Unauthorized reproduction or distribution is prohibited.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">7. Limitation of Liability</h2>
            <p>Eden Wood Watch Hub shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products, to the fullest extent permitted by law.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">8. Contact</h2>
            <p>For questions about these terms, please contact us at <a href="mailto:support@edenwoodwatchhub.com" className="text-BR500 hover:underline">support@edenwoodwatchhub.com</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
