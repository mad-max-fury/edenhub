"use client";

import Link from "next/link";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { Footer, GlobalMenu } from "@/components";

export default function NoAccessPage() {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[600px] mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-R50 grid place-items-center mb-5">
          <ShieldOff size={28} className="text-R500" />
        </div>
        <h1 className="text-xl font-bold text-N900 mb-2">Access denied</h1>
        <p className="text-sm text-N500 mb-8 max-w-sm">
          You don&apos;t have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
            <ArrowLeft size={15} /> Go home
          </Link>
          <Link href="/contact" className="px-5 py-2.5 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
            Contact support
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
