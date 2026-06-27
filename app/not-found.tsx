"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Footer, GlobalMenu } from "@/components";

const NotFound = () => {
  return (
    <>
      <GlobalMenu />
      <main className="max-w-[600px] mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-[80px] font-bold text-N100 leading-none mb-4">404</div>
        <h1 className="text-xl font-bold text-N900 mb-2">Page not found</h1>
        <p className="text-sm text-N500 mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back to the shop.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
            <ArrowLeft size={15} /> Go home
          </Link>
          <Link href="/shop" className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
            <Search size={15} /> Browse shop
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
