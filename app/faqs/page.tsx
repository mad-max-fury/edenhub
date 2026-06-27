"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Footer, GlobalMenu } from "@/components";
import { useGetPublicFaqsQuery } from "@/redux/api/faqs";

export default function FaqsPage() {
  const { data, isLoading } = useGetPublicFaqsQuery();
  const faqs = data?.data ?? [];
  const [openId, setOpenId] = useState("");

  const categories = Array.from(new Set(faqs.map((f) => f.category || "General")));

  return (
    <>
      <GlobalMenu />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link><span>{">"}</span><span className="text-N700">FAQs</span>
        </nav>
        <h1 className="text-2xl font-bold text-N900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-N500 mb-8">Find answers to the most common questions about our products, orders, and policies.</p>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-N10 rounded animate-pulse" />)}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-N400 py-12 text-center">No FAQs available yet.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {categories.map((cat) => {
              const catFaqs = faqs.filter((f) => (f.category || "General") === cat);
              return (
                <div key={cat}>
                  <h2 className="text-sm font-semibold text-N900 uppercase tracking-wide mb-3">{cat}</h2>
                  <div className="border border-N30 rounded divide-y divide-N20">
                    {catFaqs.map((faq) => {
                      const isOpen = openId === faq._id;
                      return (
                        <div key={faq._id}>
                          <button onClick={() => setOpenId(isOpen ? "" : faq._id)}
                            className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm text-N800 hover:bg-N10 transition-colors">
                            <span className={isOpen ? "font-medium" : ""}>{faq.question}</span>
                            <ChevronDown size={14} className={`text-N400 shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-sm text-N500 leading-relaxed">{faq.answer}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 border border-N30 rounded p-6 text-center">
          <p className="text-sm text-N700 font-medium mb-1">Still have questions?</p>
          <p className="text-xs text-N400 mb-3">Our support team is here to help.</p>
          <Link href="/contact" className="text-sm text-BR500 hover:underline font-medium">Contact us</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
