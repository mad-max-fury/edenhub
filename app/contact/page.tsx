"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button, Footer, GlobalMenu, notify } from "@/components";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      notify.error({ message: "Please fill in all required fields" });
      return;
    }
    setSent(true);
    notify.success({ message: "Message sent! We'll get back to you soon." });
  };

  return (
    <>
      <GlobalMenu />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        <nav className="text-xs text-N400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-N700">Home</Link>
          <span>{">"}</span>
          <span className="text-N700">Contact Us</span>
        </nav>

        <h1 className="text-2xl font-bold text-N900 mb-2">Contact Us</h1>
        <p className="text-sm text-N500 mb-8">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Form */}
          {sent ? (
            <div className="border border-G100 bg-G50/30 rounded p-8 text-center">
              <p className="text-lg font-semibold text-N900 mb-2">Thank you!</p>
              <p className="text-sm text-N500">Your message has been received. We&apos;ll get back to you within 24-48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-N500 mb-1 block">Name <span className="text-R400">*</span></label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name" className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-N500 mb-1 block">Email <span className="text-R400">*</span></label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-N500 mb-1 block">Subject</label>
                <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What is this about?" className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
              </div>
              <div>
                <label className="text-xs text-N500 mb-1 block">Message <span className="text-R400">*</span></label>
                <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="How can we help?" rows={5} className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none resize-y" />
              </div>
              <Button variant="brown-light" type="submit" className="w-fit">Send Message</Button>
            </form>
          )}

          {/* Contact info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-N400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-N800">Phone</p>
                <a href="tel:09012345670" className="text-sm text-N500 hover:text-N800">090-123-4567-0</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-N400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-N800">Email</p>
                <a href="mailto:support@edenwoodwatchhub.com" className="text-sm text-N500 hover:text-N800">support@edenwoodwatchhub.com</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-N400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-N800">Address</p>
                <p className="text-sm text-N500">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
