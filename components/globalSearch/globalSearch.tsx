"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  ArrowRight,
  SearchIcon,
  Layers,
  Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "../modal/modal";
import { Button } from "../buttons";
import { SearchInput } from "../search";
import { MiniEmptyState } from "../miniEmptyState/miniEmptyState";
import { EmptySearchIcon } from "@/assets/svgs/emptyStates";
import { Typography } from "../typography";
import { Badge } from "../badge/Badge";
import {
  useGetCatalogProductsQuery,
  useGetCatalogCategoriesQuery,
  useGetBestSellersQuery,
  type ICatalogTreeNode,
  type ICatalogProduct,
} from "@/redux/api/catalog";
import Image from "next/image";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const flatten = (
  nodes: ICatalogTreeNode[] = [],
): { slug: string; name: string }[] => {
  const out: { slug: string; name: string }[] = [];
  nodes.forEach((n) => {
    out.push({ slug: n.slug, name: n.name });
    if (n.subcategories?.length) out.push(...flatten(n.subcategories));
  });
  return out;
};

const SectionLabel = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-3 text-BR400">
    <Typography variant="c-m" fontWeight="bold" className="uppercase  text-xs">
      {title}
    </Typography>
  </div>
);

const CategoryCard = ({
  slug,
  name,
  onClick,
}: {
  slug: string;
  name: string;
  onClick: () => void;
}) => (
  <Link
    href={`/shop?category=${slug}`}
    onClick={onClick}
    className="group flex items-center gap-3 p-3 rounded-xl border border-N20 bg-white hover:border-BR300 hover:shadow-sm transition-all"
  >
    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-LB50 to-LB75 grid place-items-center shrink-0">
      <Layers size={20} className="text-BR400" />
    </div>
    <div className="flex-1 min-w-0">
      <Typography variant="p-m" fontWeight="medium" className="truncate">
        {name}
      </Typography>
      <Typography variant="p-s" color="N80" className="text-xs">
        Browse collection
      </Typography>
    </div>
    <ArrowRight
      size={18}
      className="text-N200 group-hover:text-BR400 group-hover:translate-x-0.5 transition-all"
    />
  </Link>
);

const ProductCard = ({
  product,
  onClick,
}: {
  product: ICatalogProduct;
  onClick: () => void;
}) => {
  const inStock =
    product.quantity > 0 || product.variants?.some((v) => v.quantity > 0);
  const image = product.coverImage || product.images?.[0] || "";
  const price =
    product.discount?.price && product.discount.price > 0
      ? product.discount.price
      : product.basePrice;
  return (
    <Link
      href={`/shop/${product._id}`}
      onClick={onClick}
      className="group flex items-center gap-3 p-2.5 rounded-xl border border-N20 bg-white hover:border-BR300 hover:shadow-sm transition-all"
    >
      <div className="w-14 h-14 rounded-lg bg-N10 overflow-hidden shrink-0 relative">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Typography
          variant="p-m"
          fontWeight="medium"
          color="BR500"
          className="truncate"
        >
          {product.name}
        </Typography>
        <div className="flex items-center gap-2 mt-0.5">
          <Typography variant="p-s" fontWeight="bold" color="BR400">
            {money(price)}
          </Typography>
          <Badge
            variant={inStock ? "green" : "gray"}
            text={inStock ? "In stock" : "Out of stock"}
          />
        </div>
      </div>
      <ArrowRight
        size={18}
        className="text-N200 group-hover:text-BR400 group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  );
};

const CardSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-N20 bg-white">
    <div className="h-12 w-12 rounded-lg bg-N10 animate-pulse shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-3.5 w-2/3 bg-N10 rounded animate-pulse" />
      <div className="h-3 w-1/3 bg-N10 rounded animate-pulse" />
    </div>
  </div>
);

const CardSkeletonGrid = ({
  count,
  cols = false,
}: {
  count: number;
  cols?: boolean;
}) => (
  <div
    className={
      cols
        ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
        : "grid grid-cols-1 gap-2.5"
    }
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const GlobalSearchDropdown: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const active = searchTerm.trim().length >= 2;

  const { data: prodRes, isFetching } = useGetCatalogProductsQuery(
    { searchTerm: searchTerm.trim() || undefined, pageSize: 6 },
    { skip: !active },
  );
  const { data: catRes, isLoading: catLoading } =
    useGetCatalogCategoriesQuery();
  const { data: bestRes, isFetching: bestFetching } = useGetBestSellersQuery({
    limit: 6,
  });

  const topCategories = catRes?.data ?? [];
  const trending = bestRes?.data ?? [];
  const popularTerms = topCategories.slice(0, 6).map((c) => c.name);

  const products = active ? (prodRes?.data.data ?? []) : [];
  const categories = active
    ? flatten(catRes?.data ?? []).filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];
  const hasResults = products.length > 0 || categories.length > 0;

  const close = () => setIsDropdownOpen(false);

  const addToSearchHistory = (term: string) => {
    if (term && !searchHistory.includes(term)) {
      const updated = [term, ...searchHistory].slice(0, 5);
      setSearchHistory(updated);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const removeSearchHistoryItem = (item: string) => {
    const updated = searchHistory.filter((h) => h !== item);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const goToShop = (term: string) => {
    addToSearchHistory(term);
    close();
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) goToShop(searchTerm.trim());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const saved = localStorage.getItem("searchHistory");
    if (saved) setSearchHistory(JSON.parse(saved));

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Button
        shape={"pill"}
        variant={"gold"}
        size={"plain"}
        className={"aspect-square h-[50px]"}
        onClick={() => setIsDropdownOpen(true)}
        aria-label="Search"
      >
        <SearchIcon className="text-BR500" />
      </Button>
      <Modal
        mobileLayoutType={"full"}
        isOpen={isDropdownOpen}
        closeModal={close}
      >
        <div ref={searchRef} className="relative w-full">
          <div className="top-0 sticky w-full bg-white z-[1]">
            <div className="mb-3 w-full pt-3 max-w-2xl px-4 md:px-0 mx-auto">
              <SearchInput
                placeholder="Search by product name or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name={"productSearch"}
                id={""}
                onSubmit={handleSearchSubmit}
                ariaLabel="Search products"
              />
            </div>
            <hr className="bg-[#808080]" />
            {active && isFetching && (
              <div className="h-0.5 w-full bg-BR400 animate-pulse" />
            )}
          </div>

          <div
            className="font-clashDisplay max-w-2xl mx-auto px-4 md:px-0 min-h-[500px] md:max-h-[600px] overflow-y-auto w-full mt-1 bg-white rounded-md pb-10"
            role="menu"
            aria-orientation="vertical"
          >
            {active && hasResults && (
              <div className="mt-6 w-full space-y-7">
                {categories.length > 0 && (
                  <section>
                    <SectionLabel title="Categories" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <CategoryCard
                          key={category.slug}
                          slug={category.slug}
                          name={category.name}
                          onClick={close}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {products.length > 0 && (
                  <section>
                    <SectionLabel title="Products" />
                    <div className="grid grid-cols-1 gap-2.5">
                      {products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onClick={close}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {active && isFetching && !hasResults && (
              <div className="mt-6 w-full">
                <SectionLabel title="Searching…" />
                <CardSkeletonGrid count={5} />
              </div>
            )}

            {active && !hasResults && !isFetching && (
              <div className="w-full h-[400px] flex items-center justify-center">
                <MiniEmptyState
                  icon={<EmptySearchIcon className="h-[150px]" />}
                  title="No results found"
                  text={`Try adjusting your search to find what you are looking for`}
                />
              </div>
            )}

            {!active && (
              <div className="mt-4 w-full space-y-7">
                {searchHistory.length > 0 && (
                  <section>
                    <div className="flex justify-between items-center mb-3">
                      <SectionLabel title="Recent searches" />
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-BR300 font-medium hover:underline mb-3"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 bg-N10 hover:bg-LB50 rounded-full pl-3.5 pr-2 py-1.5 text-sm text-N500 transition-colors"
                        >
                          <button onClick={() => goToShop(item)}>{item}</button>
                          <button
                            onClick={() => removeSearchHistoryItem(item)}
                            aria-label={`Remove ${item}`}
                            className="text-N200 hover:text-R400"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {popularTerms.length > 0 && (
                  <section>
                    <SectionLabel title="Popular searches" />
                    <div className="flex flex-wrap gap-2">
                      {popularTerms.map((term) => (
                        <button
                          key={term}
                          onClick={() => goToShop(term)}
                          className="rounded-full border border-N20 hover:border-BR300 hover:bg-LB50 px-4 py-1.5 text-sm text-N600 transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {catLoading ? (
                  <section>
                    <SectionLabel title="Browse categories" />
                    <CardSkeletonGrid count={4} cols />
                  </section>
                ) : (
                  topCategories.length > 0 && (
                    <section>
                      <SectionLabel title="Browse categories" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topCategories.slice(0, 6).map((category) => (
                          <CategoryCard
                            key={category.slug}
                            slug={category.slug}
                            name={category.name}
                            onClick={close}
                          />
                        ))}
                      </div>
                    </section>
                  )
                )}

                {bestFetching ? (
                  <section>
                    <SectionLabel title="Trending now" />
                    <CardSkeletonGrid count={4} />
                  </section>
                ) : (
                  trending.length > 0 && (
                    <section>
                      <SectionLabel title="Trending now" />
                      <div className="grid grid-cols-1 gap-2.5">
                        {trending.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onClick={close}
                          />
                        ))}
                      </div>
                    </section>
                  )
                )}

                {!catLoading &&
                  !bestFetching &&
                  topCategories.length === 0 &&
                  trending.length === 0 && (
                    <div className="w-full h-[400px] flex items-center justify-center">
                      <MiniEmptyState
                        icon={<EmptySearchIcon className="h-[150px]" />}
                        title="Search the store"
                        text={
                          "Start typing to search for products or categories."
                        }
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
