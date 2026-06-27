"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { HamburgerIcon } from "@/assets/svgs";
import { CONTACT_ITEMS } from "@/constants/data";
import { useGetCatalogCategoriesQuery } from "@/redux/api/catalog";
import { Drawer } from "../drawer/drawer";
import { Button } from "../buttons";
import { AppLogo } from "../logo/logo";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  subcategories: { _id: string; name: string; slug: string }[];
}

const AUDIENCES = [
  { label: "Men", href: "/shop?audience=men" },
  { label: "Women", href: "/shop?audience=women" },
  { label: "Unisex", href: "/shop?audience=unisex" },
];

export const SideBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const { data, isLoading } = useGetCatalogCategoriesQuery();
  const categories: CategoryNode[] = useMemo(
    () =>
      (data?.data ?? []).map((c) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        subcategories: (c.subcategories ?? []).map((s) => ({
          _id: s._id,
          name: s.name,
          slug: s.slug,
        })),
      })),
    [data],
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <Button
        shape="pill"
        variant="gold"
        size="plain"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="aspect-square h-[50px]"
      >
        <HamburgerIcon />
      </Button>

      <Drawer
        open={open}
        onClose={close}
        anchor="left"
        selector="drawer-root"
        width="min(340px, 85vw)"
        header={
          <div className="flex items-center justify-between w-full">
            <Link href="/" onClick={close} aria-label="Home">
              <AppLogo size="md" variant="textHorizontalBlack" />
            </Link>
            <button onClick={close} aria-label="Close" className="w-8 h-8 grid place-items-center rounded-full text-N500 hover:bg-N10 hover:text-N800 transition-colors">
              <X size={18} />
            </button>
          </div>
        }
      >
        <nav className="flex flex-col pb-6">
          {/* Main links */}
          <div className="flex flex-col border-b border-N20 pb-2 mb-2">
            {[
              { label: "Shop All", href: "/shop" },
              { label: "New Arrivals", href: "/shop?sort=newest" },
              { label: "Best Sellers", href: "/shop?sort=popular" },
            ].map((link) => (
              <Link key={link.label} href={link.href} onClick={close}
                className="flex items-center justify-between py-3 text-sm font-medium text-N800 hover:text-N900 transition-colors">
                {link.label}
                <ChevronRight size={14} className="text-N300" />
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="border-b border-N20 pb-2 mb-2">
            <p className="text-[11px] text-N400 uppercase tracking-wider py-2">Categories</p>
            {isLoading ? (
              <div className="flex flex-col gap-1">
                {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-N10 rounded animate-pulse" />)}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-N400 py-2">No categories yet.</p>
            ) : (
              <div className="flex flex-col">
                {categories.map((c) => {
                  const isOpen = expanded === c.id;
                  const hasSubs = c.subcategories.length > 0;
                  return (
                    <div key={c.id}>
                      <div className="flex items-center">
                        <Link href={`/shop?category=${c.slug}`} onClick={close}
                          className="flex-1 py-2.5 text-sm text-N700 hover:text-N900 transition-colors">
                          {c.name}
                        </Link>
                        {hasSubs && (
                          <button onClick={() => setExpanded(isOpen ? null : c.id)} className="p-1.5 text-N400 hover:text-N700">
                            <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>
                      {hasSubs && isOpen && (
                        <div className="flex flex-col pl-3 pb-1">
                          {c.subcategories.map((sub) => (
                            <Link key={sub._id} href={`/shop?category=${sub.slug}`} onClick={close}
                              className="py-2 text-sm text-N500 hover:text-N800 transition-colors">
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Audience */}
          <div className="border-b border-N20 pb-3 mb-3">
            <p className="text-[11px] text-N400 uppercase tracking-wider py-2">Shop by</p>
            <div className="flex gap-2">
              {AUDIENCES.map((a) => (
                <Link key={a.label} href={a.href} onClick={close}
                  className="flex-1 text-center text-xs py-2 border border-N30 rounded text-N600 hover:border-N200 hover:text-N900 transition-colors">
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="pt-1">
            <p className="text-[11px] text-N400 uppercase tracking-wider py-2">Need help?</p>
            {CONTACT_ITEMS.map((item) => (
              <div key={item.title} className="py-1.5">
                <p className="text-[10px] text-N400 uppercase tracking-wide">{item.title}</p>
                <a href={item.link} className="text-sm text-N700 hover:text-N900 transition-colors">{item.value}</a>
              </div>
            ))}
          </div>
        </nav>
      </Drawer>
    </>
  );
};
