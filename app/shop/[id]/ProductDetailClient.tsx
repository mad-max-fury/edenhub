"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import {
  BadgeCheck,
  ChevronDown,
  GitCompareArrows,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { Button, Footer, GlobalMenu, notify } from "@/components";
import { useAuthModal } from "@/components/authModal/AuthModal";
import {
  useGetBestSellersQuery,
  useGetCatalogProductQuery,
  type ICatalogVariant,
} from "@/redux/api/catalog";
import { useCart } from "@/hooks/useCart";
import {
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "@/redux/api/wishlist";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";
import { recordRecentlyViewed, useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { addToCompare, isInCompare } from "@/hooks/useCompare";
import { ProductReviews } from "./components/productReviews";
import { ProductQA } from "./components/productQA";
import { ShopProductCard } from "../components/shopProductCard";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-N100"} />
    ))}
  </span>
);

const Accordion = ({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-t border-N20">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-3.5 text-left">
        <span className="text-sm font-medium text-N800">{title}</span>
        <ChevronDown size={16} className={`text-N400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4 text-sm text-N500 leading-relaxed">{children}</div>}
    </div>
  );
};

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { requireAuth } = useAuthModal();
  const isLoggedIn = !!getCookie(cookieValues.token);
  const { data, isLoading, isError } = useGetCatalogProductQuery(params.id);

  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState<ICatalogVariant | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showingVideo, setShowingVideo] = useState<string | null>(null);

  const { addItem, items, setItemQty } = useCart();
  const { data: wishlistRes } = useGetWishlistQuery(undefined, { skip: !isLoggedIn });
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();
  const isSaved = !!wishlistRes?.data?.some((p) => p._id === params.id);
  const { data: bestRes } = useGetBestSellersQuery({ limit: 5 });
  const recentlyViewed = useRecentlyViewed();

  useEffect(() => { if (data?.data) recordRecentlyViewed(data.data); }, [data?.data]);

  if (isLoading) {
    return (<>
      <GlobalMenu />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-N10 rounded animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-N10 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-N10 rounded animate-pulse" />
            <div className="h-6 w-32 bg-N10 rounded animate-pulse" />
            <div className="h-12 w-full bg-N10 rounded animate-pulse mt-4" />
          </div>
        </div>
      </main>
      <Footer />
    </>);
  }

  if (isError || !data?.data) {
    return (<>
      <GlobalMenu />
      <div className="h-[60vh] grid place-items-center">
        <div className="text-center">
          <p className="text-N500 mb-4">Product not found</p>
          <Button variant="brown-light" onClick={() => router.push("/shop")}>Back to shop</Button>
        </div>
      </div>
      <Footer />
    </>);
  }

  const product = data.data;
  const categoryName = typeof product.category === "string" ? "" : (product.category?.name ?? "");
  const categorySlug = typeof product.category === "string" ? "" : (product.category?.slug ?? "");

  const productGallery = [product.coverImage, ...(product.images ?? [])].filter(Boolean) as string[];
  const videos = product.videos?.filter(Boolean) ?? [];
  const gallery = variant?.images?.length ? variant.images : productGallery;
  const mainImage = gallery[Math.min(activeImage, gallery.length - 1)];

  const src = variant ?? product;
  const hasDiscount = !!src.discount?.price && src.discount.price > 0;
  const price = hasDiscount ? src.discount!.price! : src.basePrice;
  const discountPct = src.discount?.percentage || (hasDiscount && src.basePrice ? Math.round(((src.basePrice - src.discount!.price!) / src.basePrice) * 100) : 0);
  const inStock = (variant ? variant.quantity : product.quantity) > 0 || product.variants.some((v) => v.quantity > 0);

  const line = items.find((l) => l.product === product._id && (l.variantId ?? "") === (variant?._id ?? ""));
  const relatedFromProduct = (product.relatedProducts ?? []).filter((p) => p._id !== product._id);
  const related = relatedFromProduct.length > 0
    ? relatedFromProduct.slice(0, 4)
    : (bestRes?.data ?? []).filter((p) => p._id !== product._id).slice(0, 4);

  const addToCart = async () => {
    setAdding(true);
    try {
      await addItem({ product: params.id, variantId: variant?._id, quantity: qty, name: product.name + (variant ? ` – ${variant.name}` : ""), image: mainImage || product.coverImage, unitPrice: price, stock: variant ? variant.quantity : product.quantity || 9999, engravingConfig: product.engraving });
      notify.success({ message: "Added to cart" });
    } catch (err) { notify.error({ message: "Could not add to cart", subtitle: getApiErrorMessage(err) }); }
    finally { setAdding(false); }
  };

  const changeLineQty = async (next: number) => {
    if (!line) return;
    try { await setItemQty(line, next); } catch (err) { notify.error({ message: "Update failed", subtitle: getApiErrorMessage(err) }); }
  };

  const toggleSave = () => {
    const doToggle = async () => {
      try { if (isSaved) await removeWishlist(params.id).unwrap(); else await addWishlist(params.id).unwrap(); }
      catch (err) { notify.error({ message: "Action failed", subtitle: getApiErrorMessage(err) }); }
    };
    if (!isLoggedIn) { requireAuth(doToggle); return; }
    doToggle();
  };

  const selectVariant = (v: ICatalogVariant) => { setVariant((cur) => (cur?._id === v._id ? null : v)); setActiveImage(0); };

  return (
    <>
      <GlobalMenu />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-N400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-N700">Home</Link>
          <span>{">"}</span>
          <Link href="/shop" className="hover:text-N700">Shop</Link>
          {categoryName && (<><span>{">"}</span><Link href={`/shop?category=${categorySlug}`} className="hover:text-N700 capitalize">{categoryName}</Link></>)}
          <span>{">"}</span>
          <span className="text-N700 truncate max-w-[300px]">
            {product.name}{product.variationValue ? ` - ${product.variationValue}` : ""}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Gallery ── */}
          <div>
            {/* Main image / video */}
            <div className="aspect-square bg-N10 rounded overflow-hidden mb-3 relative">
              {showingVideo ? (
                <video src={showingVideo} controls autoPlay className="absolute inset-0 w-full h-full object-contain bg-black" />
              ) : (
                <>
                  {mainImage && <Image src={mainImage} alt={product.name} fill className="object-cover" priority />}
                  {hasDiscount && discountPct > 0 && (
                    <span className="absolute top-3 left-3 bg-R500 text-white text-xs font-semibold px-2 py-1 rounded">−{discountPct}%</span>
                  )}
                </>
              )}
            </div>
            {/* Thumbnails */}
            {(gallery.length > 1 || videos.length > 0) && (
              <div className="flex gap-2 overflow-x-auto hideScrollBar">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => { setActiveImage(i); setShowingVideo(null); }}
                    className={`w-16 h-16 rounded border overflow-hidden shrink-0 transition-colors ${!showingVideo && activeImage === i ? "border-N800 border-2" : "border-N30 hover:border-N200"}`}>
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
                {videos.map((v, i) => (
                  <button key={`v${i}`} onClick={() => setShowingVideo(v)}
                    className={`w-16 h-16 rounded border overflow-hidden shrink-0 transition-colors grid place-items-center bg-N50 ${showingVideo === v ? "border-N800 border-2" : "border-N30 hover:border-N200"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-N500"><polygon points="5,3 19,12 5,21" /></svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="lg:sticky lg:top-6 h-fit">
            {/* Brand */}
            {product.brand && <p className="text-xs text-N400 uppercase tracking-widest mb-1">{product.brand}</p>}

            {/* Name */}
            <h1 className="text-2xl font-bold text-N900 leading-snug">{product.name}</h1>

            {/* Rating */}
            <button type="button" onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-2 mt-2">
              <Stars rating={product.averageRating} />
              <span className="text-xs text-N400">{product.totalReviews} review{product.totalReviews === 1 ? "" : "s"}</span>
            </button>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mt-4">
              <span className="text-2xl font-bold text-N900">{money(price)}</span>
              {hasDiscount && <span className="text-sm text-N400 line-through">{money(src.basePrice)}</span>}
            </div>

            {/* Stock urgency */}
            {(() => {
              const stock = variant ? variant.quantity : product.quantity;
              if (stock <= 0) return <p className="text-xs mt-1.5 text-R500">Out of stock</p>;
              if (stock <= 5) return <p className="text-xs mt-1.5 text-O600">Only {stock} left in stock — order soon</p>;
              return <p className="text-xs mt-1.5 text-G600">In stock</p>;
            })()}

            {/* Variation siblings — standalone linked products (Nixon-style) */}
            {(product.variationSiblings ?? []).length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-sm text-N600">
                    <span className="font-medium text-N800">{product.variationLabel || "Color"}:</span>{" "}
                    {product.variationValue || product.name}
                  </p>
                  {product.variants?.[0]?.sku && (
                    <span className="text-xs text-N400">{product.variants[0].sku}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto hideScrollBar">
                  {/* Current product — active swatch */}
                  {(() => {
                    const img = product.coverImage || product.images?.[0];
                    return (
                      <div className="shrink-0 w-[60px] h-[60px] rounded border-2 border-N800 overflow-hidden bg-N10 relative" title={product.variationValue || product.name}>
                        {img && <Image src={img} alt={product.variationValue || product.name} fill className="object-cover" />}
                      </div>
                    );
                  })()}
                  {/* Siblings — each links to its own page */}
                  {product.variationSiblings!.map((s) => {
                    const img = s.coverImage || s.images?.[0];
                    return (
                      <Link key={s._id} href={`/shop/${s.slug || s._id}`} title={s.variationValue || s.name} className="shrink-0">
                        <div className="w-[60px] h-[60px] rounded border-2 border-N20 hover:border-N400 transition-colors overflow-hidden bg-N10 relative">
                          {img && <Image src={img} alt={s.variationValue || s.name} fill className="object-cover" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Embedded variants (size, etc.) */}
            {product.variants.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-N600 mb-2">
                  {variant ? <>Option: <span className="font-medium text-N800">{variant.name}</span></> : "Choose an option"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = variant?._id === v._id;
                    const img = v.images?.[0];
                    return img ? (
                      <button key={v._id ?? v.name} onClick={() => selectVariant(v)} title={v.name}
                        className={`w-14 h-14 rounded overflow-hidden border-2 transition-colors ${active ? "border-N800" : "border-N20 hover:border-N200"}`}>
                        <Image src={img} alt={v.name} width={56} height={56} className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <button key={v._id ?? v.name} onClick={() => selectVariant(v)}
                        className={`px-4 py-2 rounded border text-sm transition-colors ${active ? "border-N800 text-N900 font-medium" : "border-N30 text-N600 hover:border-N200"}`}>
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              {line ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <button onClick={() => router.push("/cart")}
                      className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
                      <ShoppingBag size={15} /> {line.quantity} in cart — View cart
                    </button>
                    <button onClick={toggleSave} aria-label="Save"
                      className={`w-11 h-11 shrink-0 grid place-items-center rounded border transition-colors ${isSaved ? "border-BR400 text-BR500 bg-BR50" : "border-N30 text-N400 hover:border-BR200 hover:text-BR500"}`}>
                      <Heart size={17} className={isSaved ? "fill-BR500" : ""} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={addToCart}
                      disabled={!inStock || adding}
                      className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors disabled:bg-N200 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={15} /> {adding ? "Adding…" : inStock ? "Add to cart" : "Out of stock"}
                    </button>
                    <button onClick={toggleSave} aria-label="Save"
                      className={`w-11 h-11 shrink-0 grid place-items-center rounded border transition-colors ${isSaved ? "border-BR400 text-BR500 bg-BR50" : "border-N30 text-N400 hover:border-BR200 hover:text-BR500"}`}>
                      <Heart size={17} className={isSaved ? "fill-BR500" : ""} />
                    </button>
                  </div>

                  {/* Buy Now */}
                  {inStock && (
                    <button
                      onClick={() => {
                        const doBuyNow = async () => {
                          setAdding(true);
                          try {
                            await addItem({ product: params.id, variantId: variant?._id, quantity: qty, name: product.name + (variant ? ` – ${variant.name}` : ""), image: mainImage || product.coverImage, unitPrice: price, stock: variant ? variant.quantity : product.quantity || 9999, engravingConfig: product.engraving });
                            router.push("/checkout");
                          } catch (err) { notify.error({ message: "Could not proceed", subtitle: getApiErrorMessage(err) }); }
                          finally { setAdding(false); }
                        };
                        if (!isLoggedIn) { requireAuth(doBuyNow); return; }
                        doBuyNow();
                      }}
                      className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium border border-BR500 text-BR500 rounded hover:bg-BR50 transition-colors"
                    >
                      <Zap size={15} /> Buy now
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Compare */}
            <button
              type="button"
              onClick={() => {
                if (isInCompare(product._id)) {
                  router.push("/shop/compare");
                } else {
                  const ok = addToCompare(product);
                  if (ok) notify.success({ message: "Added to compare" });
                  else notify.error({ message: "Compare list is full (max 4)" });
                }
              }}
              className="flex items-center gap-1.5 mt-3 text-xs text-N500 hover:text-BR500 transition-colors"
            >
              <GitCompareArrows size={14} />
              {isInCompare(product._id) ? "View comparison" : "Add to compare"}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-5 border-t border-N20">
              <span className="flex items-center gap-1.5 text-xs text-N500"><Truck size={15} className="text-N400" />Free shipping over ₦150k</span>
              <span className="flex items-center gap-1.5 text-xs text-N500"><BadgeCheck size={15} className="text-N400" />Authentic guaranteed</span>
              {product.hasWarranty && <span className="flex items-center gap-1.5 text-xs text-N500"><ShieldCheck size={15} className="text-N400" />{product.warrantyYears ?? 0}-year warranty</span>}
              {product.isReturnable && <span className="flex items-center gap-1.5 text-xs text-N500"><RotateCcw size={15} className="text-N400" />{product.returnableDays ?? 0}-day returns</span>}
            </div>

            {/* Accordions */}
            <div className="mt-4">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>
              <Accordion title="Details">
                <ul className="flex flex-col gap-1">
                  {product.brand && <li><span className="text-N400">Brand:</span> {product.brand}</li>}
                  {categoryName && <li className="capitalize"><span className="text-N400">Category:</span> {categoryName}</li>}
                  {product.variants.length > 0 && <li><span className="text-N400">Options:</span> {product.variants.map((v) => v.name).join(", ")}</li>}
                  {product.audience && <li className="capitalize"><span className="text-N400">Audience:</span> {product.audience}</li>}
                  {product.attributes && Object.entries(product.attributes).map(([key, val]) => (
                    <li key={key} className="capitalize"><span className="text-N400">{key.replace(/([A-Z])/g, " $1").trim()}:</span> {String(val)}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <p>
                  Free nationwide shipping on orders over ₦150,000. Ships in protective packaging.
                  {product.isReturnable ? ` Returns accepted within ${product.returnableDays ?? 0} days.` : " This item is final sale."}
                </p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-N20 pt-10">
            <h2 className="text-[15px] font-semibold text-N900 mb-5">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ShopProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

        {/* Reviews */}
        <div id="reviews" className="scroll-mt-24">
          <ProductReviews productId={product._id} />
        </div>

        {/* Q&A */}
        <ProductQA productId={product._id} />

        {/* Recently viewed */}
        {recentlyViewed.filter((p) => p._id !== product._id).length > 0 && (
          <section className="mt-12 border-t border-N20 pt-8">
            <h2 className="text-[15px] font-semibold text-N900 mb-5">Recently viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.filter((p) => p._id !== product._id).slice(0, 4).map((p) => (
                <ShopProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
export { ProductDetail };
