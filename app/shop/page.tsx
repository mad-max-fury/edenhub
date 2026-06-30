"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  EmptyPageState,
  Footer,
  GlobalMenu,
  Typography,
} from "@/components";
import { PaginationElement } from "@/components/pagination/pagination";
import {
  useGetCatalogBrandsQuery,
  useGetCatalogCategoriesQuery,
  useGetCatalogProductsQuery,
  type ICatalogTreeNode,
} from "@/redux/api/catalog";
import { useGetAdQuery } from "@/redux/api/ads";
import { ShopProductCard } from "./components/shopProductCard";
import { SortMenu } from "./components/SortMenu";
import { PAGE_SIZE } from "@/constants/data";

const AUDIENCE_LABELS: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  unisex: "Unisex Collection",
};

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating" },
];

const DEFAULT_SORT = "newest";

const FACET_SECTIONS: { label: string; options: string[] }[] = [
  {
    label: "Type",
    options: [
      "Analog",
      "Digital",
      "Smartwatch",
      "Chronograph",
      "Diver",
      "Dress",
      "Field",
      "Pilot",
    ],
  },
  {
    label: "Color",
    options: [
      "Gold",
      "Silver",
      "Black",
      "Blue",
      "Brown",
      "Green",
      "White",
      "Rose Gold",
    ],
  },
  { label: "Water Rating", options: ["30m", "50m", "100m", "200m", "300m"] },
  { label: "Watch Size", options: ["Small", "Medium", "Large", "Oversized"] },
  {
    label: "Movement Type",
    options: ["Automatic", "Quartz", "Mechanical", "Solar", "Kinetic"],
  },
  { label: "Lume", options: ["Super LumiNova", "Tritium", "Standard", "None"] },
  { label: "Case Thickness", options: ["Slim", "Standard", "Thick"] },
  { label: "Crystal Material", options: ["Sapphire", "Mineral", "Acrylic"] },
  {
    label: "Band Material",
    options: ["Leather", "Stainless Steel", "Rubber", "Nylon", "Silicone"],
  },
  {
    label: "Band Connection",
    options: ["Quick Release", "Spring Bar", "Integrated"],
  },
  { label: "Band Type", options: ["Bracelet", "Strap", "Bangle"] },
];

const GENDER_OPTIONS = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
];

const money = (n: number) => `₦${Number(n).toLocaleString()}`;

const flatten = (
  nodes: ICatalogTreeNode[] = [],
  depth = 0,
): { slug: string; name: string; depth: number }[] => {
  const out: { slug: string; name: string; depth: number }[] = [];
  nodes.forEach((n) => {
    out.push({ slug: n.slug, name: n.name, depth });
    if (n.subcategories?.length)
      out.push(...flatten(n.subcategories, depth + 1));
  });
  return out;
};

interface DraftFilters {
  brand: string;
  minPrice: string;
  maxPrice: string;
  audience: string;
  tags: string[];
}

const EMPTY_DRAFT: DraftFilters = {
  brand: "",
  minPrice: "",
  maxPrice: "",
  audience: "",
  tags: [],
};

const ShopPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [audience, setAudience] = useState("");
  const [tag, setTag] = useState("");
  const [adId, setAdId] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<DraftFilters>(EMPTY_DRAFT);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Price: true,
  });
  const toggleSection = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const get = (k: string, fn: (v: string) => void) => {
      const v = p.get(k);
      if (v) fn(v);
    };
    get("search", setSearch);
    get("category", setCategory);
    get("brand", setBrand);
    get("minPrice", setMinPrice);
    get("maxPrice", setMaxPrice);
    get("sort", setSort);
    get("audience", setAudience);
    get("tag", setTag);
    get("ad", setAdId);
    const pg = p.get("page");
    if (pg) setPage(Number(pg) || 1);
  }, []);

  const firstWrite = useRef(true);
  useEffect(() => {
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    if (adId) return;
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    if (brand) p.set("brand", brand);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (audience) p.set("audience", audience);
    if (tag) p.set("tag", tag);
    if (sort && sort !== DEFAULT_SORT) p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");
  }, [
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    audience,
    tag,
    sort,
    page,
    adId,
  ]);

  const { data: categoriesRes } = useGetCatalogCategoriesQuery();
  const { data: brandsRes } = useGetCatalogBrandsQuery();
  const topCategories = categoriesRes?.data ?? [];
  const categories = useMemo(
    () => flatten(categoriesRes?.data ?? []),
    [categoriesRes],
  );
  const brands = brandsRes?.data ?? [];
  const { data: adRes, isFetching: adLoading } = useGetAdQuery(adId, {
    skip: !adId,
  });
  const ad = adRes?.data;

  const { data, isFetching } = useGetCatalogProductsQuery(
    {
      pageNumber: page,
      pageSize: PAGE_SIZE.sm,
      searchTerm: search || undefined,
      category: category || undefined,
      brand: brand || undefined,
      audience: audience || undefined,
      tag: tag || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
    },
    { skip: !!adId },
  );

  const products = data?.data.data ?? [];
  const metadata = data?.data.metadata;
  const totalCount = metadata?.totalCount ?? products.length;

  // Immediate controls (pills, sort, chips, pagination) commit straight away.
  const resetPageAnd = (fn: () => void) => {
    fn();
    setPage(1);
  };

  // Drawer lifecycle.
  const openFilters = () => {
    setDraft({
      brand,
      minPrice,
      maxPrice,
      audience,
      tags: tag
        ? tag
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });
    setFiltersOpen(true);
  };
  const applyDraft = () => {
    setBrand(draft.brand);
    setMinPrice(draft.minPrice);
    setMaxPrice(draft.maxPrice);
    setAudience(draft.audience);
    setTag(draft.tags.join(","));
    setPage(1);
    setFiltersOpen(false);
  };
  const clearDraft = () => setDraft(EMPTY_DRAFT);
  const setDraftField = (patch: Partial<DraftFilters>) =>
    setDraft((d) => ({ ...d, ...patch }));
  const toggleTag = (value: string) =>
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(value)
        ? d.tags.filter((t) => t !== value)
        : [...d.tags, value],
    }));

  const bannerTitle =
    categories.find((c) => c.slug === category)?.name ??
    (audience ? (AUDIENCE_LABELS[audience] ?? audience) : "Shop All");

  // Applied tag facets (comma-separated) → individual chips.
  const appliedTags = tag
    ? tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const removeTag = (value: string) =>
    resetPageAnd(() =>
      setTag(appliedTags.filter((t) => t !== value).join(",")),
    );

  // Count the "advanced" (drawer) filters currently applied.
  const advancedCount =
    appliedTags.length +
    (brand ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (audience ? 1 : 0);

  const hasActiveFilters =
    !!category ||
    !!brand ||
    !!minPrice ||
    !!maxPrice ||
    !!search ||
    !!audience ||
    !!tag;

  const clearAll = () =>
    resetPageAnd(() => {
      setCategory("");
      setBrand("");
      setMinPrice("");
      setMaxPrice("");
      setSearch("");
      setAudience("");
      setTag("");
    });

  const Chip = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1 text-xs text-N700 bg-N10 border border-N30 rounded pl-2.5 pr-1.5 py-1 hover:bg-N20 transition-colors"
    >
      {label}
      <X size={12} className="text-N400" />
    </button>
  );

  const pillCls = (active: boolean) =>
    `shrink-0 text-xs px-4 py-2 rounded-full border transition-colors ${
      active
        ? "bg-N900 text-white border-N900"
        : "bg-white text-N600 border-N30 hover:border-N200"
    }`;

  const sectionHeader = (label: string) => (
    <button
      type="button"
      onClick={() => toggleSection(label)}
      aria-expanded={!!openSections[label]}
      className="w-full flex items-center justify-between py-3.5 text-left"
    >
      <span className="text-sm font-medium text-N800">{label}</span>
      <ChevronDown
        size={14}
        className={`text-N400 transition-transform ${openSections[label] ? "rotate-180" : ""}`}
      />
    </button>
  );

  if (adId) {
    const adProducts = ad?.products ?? [];
    return (
      <>
        <GlobalMenu />

        <section className="relative bg-BR500 text-white overflow-hidden">
          {ad?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="relative max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] py-16 lg:py-24">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors mb-5"
            >
              ← Back to shop
            </Link>
            {ad?.eyebrow && (
              <Typography
                color="LB300"
                className="uppercase tracking-[3px] text-xs mb-2"
              >
                {ad.eyebrow}
              </Typography>
            )}
            <Typography
              color="N0"
              fontWeight="medium"
              className="text-4xl lg:text-5xl leading-tight"
            >
              {ad?.title ?? "Featured"}
            </Typography>
            {ad?.subtitle && (
              <Typography className="mt-2 text-white/90 text-lg">
                {ad.subtitle}
              </Typography>
            )}
            {ad?.description && (
              <Typography className="mt-4 max-w-2xl text-white/80 leading-[26px]">
                {ad.description}
              </Typography>
            )}
          </div>
        </section>

        <main className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] py-10">
          {adLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-N20 animate-pulse" />
              ))}
            </div>
          ) : adProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {adProducts.map((p) => (
                <ShopProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyPageState
              title="Nothing to Display"
              text="No products in this campaign yet"
              containerClassname="flex flex-col items-center justify-center h-72"
            />
          )}
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <GlobalMenu />

      <section className="bg-white border-b border-N30">
        <div className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] pt-6 pb-8">
          <nav className="flex items-center gap-1.5 text-xs text-N400 mb-4">
            <Link href="/" className="hover:text-N700">
              Home
            </Link>
            <span>{">"}</span>
            <span className="text-N700">Shop</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-N900 capitalize">
            {bannerTitle}
          </h1>
          <p className="text-sm text-N500 mt-1.5 max-w-lg">
            Timepieces, eyewear and accessories — crafted, numbered, and built
            to be handed down.
          </p>
        </div>
      </section>

      <div className="sticky top-[90px] z-20 bg-white border-b border-N30">
        <div className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] py-3 flex items-center gap-4 justify-between">
          {/* Category pills (apply immediately) */}
          <div className="flex items-center gap-2 overflow-x-auto hideScrollBar">
            <button
              type="button"
              onClick={() => resetPageAnd(() => setCategory(""))}
              className={pillCls(category === "")}
            >
              All
            </button>
            {topCategories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => resetPageAnd(() => setCategory(c.slug))}
                className={pillCls(category === c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Count + sort + filters */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-xs text-N500 whitespace-nowrap">
              {totalCount} {totalCount === 1 ? "result" : "results"}
            </span>
            <SortMenu
              options={SORT_OPTIONS}
              value={sort}
              onChange={(v) => resetPageAnd(() => setSort(v))}
            />
            <button
              type="button"
              onClick={openFilters}
              className="relative flex items-center gap-1.5 border border-N30 rounded px-3 py-2 text-sm text-N700 bg-white hover:border-N200 transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
              {advancedCount > 0 && (
                <span className="grid place-items-center min-w-[16px] h-[16px] px-1 rounded-full bg-N900 text-white text-[9px] font-bold">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter chips (reflect applied state) */}
        {hasActiveFilters && (
          <div className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] pb-3 flex items-center gap-2 flex-wrap">
            {category && (
              <Chip
                label={bannerTitle}
                onRemove={() => resetPageAnd(() => setCategory(""))}
              />
            )}
            {audience && (
              <Chip
                label={AUDIENCE_LABELS[audience] ?? audience}
                onRemove={() => resetPageAnd(() => setAudience(""))}
              />
            )}
            {appliedTags.map((t) => (
              <Chip key={t} label={t} onRemove={() => removeTag(t)} />
            ))}
            {search && (
              <Chip
                label={`“${search}”`}
                onRemove={() => resetPageAnd(() => setSearch(""))}
              />
            )}
            {brand && (
              <Chip
                label={brand}
                onRemove={() => resetPageAnd(() => setBrand(""))}
              />
            )}
            {(minPrice || maxPrice) && (
              <Chip
                label={`${minPrice ? money(Number(minPrice)) : "₦0"} – ${
                  maxPrice ? money(Number(maxPrice)) : "∞"
                }`}
                onRemove={() =>
                  resetPageAnd(() => {
                    setMinPrice("");
                    setMaxPrice("");
                  })
                }
              />
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-BR400 underline hover:text-BR500 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Product grid */}
      <main className="max-w-[1400px] mx-auto px-[clamp(16px,4vw,40px)] py-10">
        {isFetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-N20 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {products.map((p) => (
                <ShopProductCard key={p._id} product={p} />
              ))}
            </div>
            <PaginationElement
              noOfPages={metadata?.totalPages}
              isServerSidePagination
              setPageNumber={(p) => setPage(p)}
            />
          </div>
        ) : (
          <EmptyPageState
            title="Nothing to Display"
            text="No products match your filters"
            containerClassname="flex flex-col items-center justify-center h-72"
          />
        )}
      </main>

      <Footer />

      {/* Filters drawer — edits a draft, only commits on Apply */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        selector="portal"
        anchor="right"
        width="360px"
        header={
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-N900">Filters</span>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close"
              className="p-1 text-N400 hover:text-N700"
            >
              <X size={18} />
            </button>
          </div>
        }
      >
        <div className="flex flex-col pb-20">
          {/* Price */}
          <div className="border-b border-N20">
            {sectionHeader("Price")}
            {openSections["Price"] && (
              <div className="pb-4 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ₦"
                  value={draft.minPrice}
                  onChange={(e) => setDraftField({ minPrice: e.target.value })}
                  className="w-full border border-N30 rounded px-3 py-2 text-sm focus:border-BR400 outline-none"
                />
                <span className="text-N300">–</span>
                <input
                  type="number"
                  placeholder="Max ₦"
                  value={draft.maxPrice}
                  onChange={(e) => setDraftField({ maxPrice: e.target.value })}
                  className="w-full border border-N30 rounded px-3 py-2 text-sm focus:border-BR400 outline-none"
                />
              </div>
            )}
          </div>

          {/* Attribute facets */}
          {FACET_SECTIONS.map((section) => (
            <div key={section.label} className="border-b border-N20">
              {sectionHeader(section.label)}
              {openSections[section.label] && (
                <div className="pb-4 flex flex-col gap-0.5">
                  {section.options.map((opt) => {
                    const checked = draft.tags.includes(opt);
                    return (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 cursor-pointer py-1.5 text-sm text-N600 hover:text-N900 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTag(opt)}
                          className="w-3.5 h-3.5 accent-BR500"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Gender */}
          <div className="border-b border-N20">
            {sectionHeader("Gender")}
            {openSections["Gender"] && (
              <div className="pb-4 flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((g) => {
                  const active = draft.audience === g.value;
                  return (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() =>
                        setDraftField({ audience: active ? "" : g.value })
                      }
                      className={`text-xs px-3.5 py-1.5 rounded border transition-colors ${
                        active
                          ? "bg-N900 text-white border-N900"
                          : "bg-white text-N600 border-N30 hover:border-N200"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Brand */}
          {brands.length > 0 && (
            <div className="border-b border-N20">
              {sectionHeader("Brand")}
              {openSections["Brand"] && (
                <div className="pb-4 flex flex-col gap-0.5 max-h-60 overflow-auto hideScrollBar">
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5 text-sm text-N600 hover:text-N900">
                    <input
                      type="radio"
                      name="brand"
                      checked={draft.brand === ""}
                      onChange={() => setDraftField({ brand: "" })}
                      className="w-3.5 h-3.5 accent-BR500"
                    />
                    All brands
                  </label>
                  {brands.map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2.5 cursor-pointer py-1.5 text-sm text-N600 hover:text-N900"
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={draft.brand === b}
                        onChange={() => setDraftField({ brand: b })}
                        className="w-3.5 h-3.5 accent-BR500"
                      />
                      {b}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-white border-t border-N30 flex items-center gap-3">
          <button
            type="button"
            onClick={clearDraft}
            className="flex-1 py-2.5 text-sm font-medium text-N600 border border-N30 rounded hover:border-N200 transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={applyDraft}
            className="flex-1 py-2.5 text-sm font-medium bg-N900 text-white rounded hover:bg-N800 transition-colors"
          >
            Apply filters
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default ShopPage;
