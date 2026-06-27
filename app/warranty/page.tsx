import Link from "next/link";
import { Footer, GlobalMenu } from "@/components";

export default function WarrantyPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link><span>{">"}</span><span className="text-N700">Warranty</span>
        </nav>
        <h1 className="text-2xl font-bold text-N900 mb-6">Warranty Policy</h1>
        <div className="flex flex-col gap-6 text-sm text-N600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Coverage</h2>
            <p>Many of our products come with a manufacturer&apos;s warranty. The warranty duration is listed on each product page (typically 1-2 years for timepieces). This warranty covers defects in materials and workmanship under normal use.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">What&apos;s Covered</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Manufacturing defects in the movement or mechanism</li>
              <li>Defective materials (case, crystal, crown)</li>
              <li>Premature failure under normal use conditions</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">What&apos;s Not Covered</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Normal wear and tear (scratches, strap aging)</li>
              <li>Damage from misuse, accidents, or water exposure beyond the rated depth</li>
              <li>Battery replacements</li>
              <li>Unauthorized modifications or repairs</li>
              <li>Damage caused by third-party servicing</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">How to Claim</h2>
            <p>To file a warranty claim, contact our support team at <a href="mailto:support@edenwoodwatchhub.com" className="text-BR500 hover:underline">support@edenwoodwatchhub.com</a> with your order number, a description of the issue, and photos if possible. We&apos;ll guide you through the process.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-N900 mb-2">Warranty Repairs</h2>
            <p>If your claim is approved, we&apos;ll repair or replace the item at no cost. Shipping for warranty claims is covered by Eden Wood Watch Hub. Turnaround time is typically 2-4 weeks depending on the nature of the repair.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
