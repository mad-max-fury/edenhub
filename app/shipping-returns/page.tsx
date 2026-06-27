import Link from "next/link";
import { Footer, GlobalMenu } from "@/components";

export default function ShippingReturnsPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link><span>{">"}</span><span className="text-N700">Shipping & Returns</span>
        </nav>
        <h1 className="text-2xl font-bold text-N900 mb-6">Shipping & Returns</h1>
        <div className="flex flex-col gap-8 text-sm text-N600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-N900 mb-3">Shipping</h2>
            <div className="border border-N30 rounded divide-y divide-N20">
              <div className="flex justify-between px-4 py-3">
                <span className="text-N500">Delivery area</span>
                <span className="text-N800 font-medium">Nationwide (Nigeria)</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-N500">Processing time</span>
                <span className="text-N800 font-medium">1-2 business days</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-N500">Delivery time</span>
                <span className="text-N800 font-medium">2-7 business days</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-N500">Free shipping</span>
                <span className="text-N800 font-medium">Orders over ₦150,000</span>
              </div>
            </div>
            <p className="mt-3">All items ship in protective packaging. You&apos;ll receive a tracking number via email once your order ships. Shipping rates are calculated at checkout based on your delivery address and the courier selected.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-N900 mb-3">Returns</h2>
            <p>We want you to be completely satisfied with your purchase. If you&apos;re not happy, we accept returns under the following conditions:</p>
            <ul className="list-disc pl-5 mt-3 flex flex-col gap-2">
              <li>Items must be returned within the return window specified on the product page (typically 7-14 days)</li>
              <li>Items must be in original, unused condition with all tags and packaging</li>
              <li>Personalized/engraved items are final sale and cannot be returned</li>
              <li>Damaged or defective items may be returned at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-N900 mb-3">How to Return</h2>
            <ol className="list-decimal pl-5 flex flex-col gap-2">
              <li>Log in to your account and go to <Link href="/c/account/returns" className="text-BR500 hover:underline">Returns & Refunds</Link></li>
              <li>Select the order and items you wish to return</li>
              <li>Choose a return reason and submit your request</li>
              <li>We&apos;ll review your request within 24-48 hours and provide return instructions</li>
              <li>Ship the item back using the provided label or your preferred carrier</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-N900 mb-3">Refunds</h2>
            <p>Once we receive and inspect your returned item, your refund will be processed to the original payment method within 5-10 business days. You&apos;ll receive an email confirmation when the refund is issued.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-N900 mb-3">Exchanges</h2>
            <p>We don&apos;t currently offer direct exchanges. To get a different item, please return the original and place a new order.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
