import Link from "next/link";
import { Footer, GlobalMenu } from "@/components";

export default function AboutPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link>
          <span>{">"}</span>
          <span className="text-N700">About Us</span>
        </nav>

        <h1 className="text-2xl font-bold text-N900 mb-6">About Us</h1>

        <div className="prose prose-sm text-N600 leading-relaxed flex flex-col gap-5">
          <p>
            Eden Wood Watch Hub is a curated destination for premium timepieces, eyewear, and lifestyle accessories. We believe in quality craftsmanship, timeless design, and pieces that tell a story.
          </p>
          <p>
            Founded with a passion for horology and fine accessories, we source each piece from trusted manufacturers and independent artisans who share our commitment to excellence. Every item in our collection is carefully selected for its design, build quality, and lasting value.
          </p>

          <h2 className="text-lg font-semibold text-N900 mt-4">Our Mission</h2>
          <p>
            To make premium, authentic accessories accessible to everyone — from first-time collectors to seasoned enthusiasts. We stand behind every product we sell with authenticity guarantees and dedicated customer support.
          </p>

          <h2 className="text-lg font-semibold text-N900 mt-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Curated collection of authentic timepieces and accessories</li>
            <li>Competitive pricing with transparent product information</li>
            <li>Personalization options including custom engraving</li>
            <li>Nationwide shipping with protective packaging</li>
            <li>Dedicated customer support and easy returns</li>
          </ul>

          <h2 className="text-lg font-semibold text-N900 mt-4">Get in Touch</h2>
          <p>
            Have questions or want to learn more? Visit our <Link href="/contact" className="text-BR500 hover:underline">Contact page</Link> or reach out to our support team — we&apos;re always happy to help.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
