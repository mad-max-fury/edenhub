"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { getCookie } from "cookies-next";
import { Typography, notify } from "@/components";
import { useAuthModal } from "@/components/authModal/AuthModal";
import { useCart } from "@/hooks/useCart";
import {
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "@/redux/api/wishlist";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";
import type { ICatalogProduct, ICatalogVariant } from "@/redux/api/catalog";
import Image from "next/image";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const isRecent = (iso?: string) => {
  if (!iso) return false;
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  return days <= 30;
};

const Stars = ({ value }: { value: number }) => {
  const rounded = Math.round(value);
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rounded ? "fill-LB400 text-LB400" : "text-N40"}
          size={12}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
};

export const ShopProductCard = ({ product }: { product: ICatalogProduct }) => {
  const { requireAuth } = useAuthModal();
  const { addItem, items, setItemQty } = useCart();
  const [variant, setVariant] = useState<ICatalogVariant | null>(null);
  const [adding, setAdding] = useState(false);

  const isLoggedIn = !!getCookie(cookieValues.token);
  const { data: wishlistRes } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();
  const isSaved = !!wishlistRes?.data?.some((p) => p._id === product._id);

  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollThumbs = (e: React.MouseEvent, dir: 1 | -1) => {
    stop(e);
    if (dir === 1) thumbsApi?.scrollNext();
    else thumbsApi?.scrollPrev();
  };

  // Active price source = selected variant, else the product.
  const src = variant ?? product;
  const hasDiscount = !!src.discount?.price && src.discount.price > 0;
  const price = hasDiscount ? src.discount!.price! : src.basePrice;
  const discountPct =
    src.discount?.percentage ||
    (hasDiscount && src.basePrice
      ? Math.round(
          ((src.basePrice - src.discount!.price!) / src.basePrice) * 100,
        )
      : 0);

  const coverImage = product.coverImage || product.images?.[0] || "";
  const variantImage = variant?.images?.[0];
  const mainImage = variantImage || coverImage;
  const hoverImage =
    variantImage ||
    product.images?.find((img) => img && img !== coverImage) ||
    coverImage;

  const isNew =
    product.tags?.some((t) => t.toLowerCase() === "new") ||
    isRecent(product.createdAt);
  const isEngravable = product.tags?.some((t) =>
    /engrav|custom|personali/i.test(t),
  );

  const variantThumbs = (product.variants ?? []).filter((v) => v.images?.[0]);

  const anyStock =
    (product.quantity ?? 0) > 0 ||
    (product.variants ?? []).some((v) => v.quantity > 0);
  const inStock = variant ? variant.quantity > 0 : anyStock;

  const line = items.find(
    (l) =>
      l.product === product._id && (l.variantId ?? "") === (variant?._id ?? ""),
  );

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const doToggleSave = async () => {
    try {
      if (isSaved) await removeWishlist(product._id).unwrap();
      else await addWishlist(product._id).unwrap();
    } catch (err) {
      notify.error({
        message: "Action failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  const toggleSave = (e: React.MouseEvent) => {
    stop(e);
    if (!isLoggedIn) {
      requireAuth(doToggleSave);
      return;
    }
    doToggleSave();
  };

  const handleAdd = async (e: React.MouseEvent) => {
    stop(e);
    if (!inStock || adding) return;
    setAdding(true);
    try {
      await addItem({
        product: product._id,
        variantId: variant?._id,
        quantity: 1,
        name: product.name + (variant ? ` – ${variant.name}` : ""),
        image: mainImage,
        unitPrice: price,
        stock: variant ? variant.quantity : product.quantity || 9999,
        engravingConfig: product.engraving,
      });
    } catch (err) {
      notify.error({
        message: "Could not add to cart",
        subtitle: getApiErrorMessage(err),
      });
    } finally {
      setAdding(false);
    }
  };

  const changeQty = async (e: React.MouseEvent, next: number) => {
    stop(e);
    if (!line) return;
    try {
      await setItemQty(line, next);
    } catch (err) {
      notify.error({
        message: "Update failed",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  return (
    <Link
      href={`/shop/${product.slug || product._id}`}
      aria-label={product.name}
      className="group relative w-full flex flex-col isolate"
    >
      <div className="relative overflow-hidden w-full aspect-[4/5] bg-N20">
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              fill
            />
            <Image
              src={hoverImage}
              alt=""
              aria-hidden="true"
              fill
              className="absolute inset-0 w-full h-full object-cover scale-105 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </>
        ) : null}

        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 flex flex-col items-start gap-1 sm:gap-1.5">
          {isNew && (
            <span className="text-[8px] sm:text-[9px] tracking-[1px] sm:tracking-[1.5px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-BR500 text-white">
              NEW
            </span>
          )}
          {discountPct > 0 && (
            <span className="text-[8px] sm:text-[9px] tracking-[1px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-LB400 text-BR500">
              −{discountPct}%
            </span>
          )}
          {isEngravable && (
            <span className="text-[8px] sm:text-[9px] tracking-[1px] sm:tracking-[1.5px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-BR400 text-BR400 bg-white/70">
              ENGRAVABLE
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSave}
          aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={isSaved}
          className={`absolute top-2 right-2 z-20 grid place-items-center w-7 h-7 rounded-full bg-white/90 hover:bg-white transition-colors ${
            isSaved ? "text-BR500" : "text-BR400 hover:text-BR500"
          }`}
        >
          <Heart size={14} className={isSaved ? "fill-BR400 text-BR400" : ""} />
        </button>
      </div>

      {
        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
          <Stars value={product.averageRating} />
          <span className="text-[10px] sm:text-[11px] text-N400">
            ({product.totalReviews})
          </span>
        </div>
      }
      <div className="mt-1 flex justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <Typography
            color="N700"
            className="text-xs sm:text-sm font-medium truncate"
          >
            {product.name}
          </Typography>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Typography
              fontWeight="bold"
              color="BR500"
              className="text-xs sm:text-sm"
            >
              {money(price)}
            </Typography>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-N400 line-through">
                {money(src.basePrice)}
              </span>
            )}
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-1 h-10 sm:h-12 max-w-[120px] sm:max-w-[160px] shrink-0">
          {variantThumbs.length > 1 && (
            <button
              type="button"
              onClick={(e) => scrollThumbs(e, -1)}
              aria-label="Previous variants"
              className="shrink-0 grid place-items-center w-5 h-8 text-N400 hover:text-BR500 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          )}

          <div className="overflow-hidden " ref={thumbsRef}>
            <div className="flex gap-1.5">
              {variantThumbs.map((v) => {
                const active = variant?._id === v._id;
                return (
                  <button
                    key={v._id ?? v.name}
                    type="button"
                    onClick={(e) => {
                      stop(e);
                      setVariant(active ? null : v);
                    }}
                    aria-label={v.name}
                    title={v.name}
                    className={`flex-[0_0_auto] w-8 h-10 sm:w-10 sm:h-12 relative overflow-hidden border transition-colors ${
                      active ? "border-BR400" : "border-N30 hover:border-BR200"
                    }`}
                  >
                    <Image
                      src={v.images![0]}
                      alt={v.name}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          {variantThumbs.length > 1 && (
            <button
              type="button"
              onClick={(e) => scrollThumbs(e, 1)}
              aria-label="Next variants"
              className="shrink-0 grid place-items-center w-5 h-8 text-N400 hover:text-BR500 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {line ? (
        <div className="flex mt-3 sm:mt-5 items-stretch bg-BR500 text-white">
          <button
            type="button"
            onClick={(e) => changeQty(e, line.quantity - 1)}
            aria-label="Decrease quantity"
            className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-BR400 transition-colors"
          >
            <Minus size={14} className="sm:w-4 sm:h-4" />
          </button>
          <span className="flex-1 grid place-items-center text-[10px] sm:text-[11px] uppercase tracking-[1px] sm:tracking-[1.5px]">
            {line.quantity} in cart
          </span>
          <button
            type="button"
            onClick={(e) => changeQty(e, line.quantity + 1)}
            aria-label="Increase quantity"
            className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-BR400 transition-colors"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock || adding}
          className="flex items-center mt-3 sm:mt-5 justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 text-[10px] sm:text-xs uppercase tracking-[1px] sm:tracking-[1.5px] bg-BR500 text-white disabled:bg-N300 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={14} className="shrink-0 sm:w-[15px] sm:h-[15px]" />
          <span className="truncate">
            {inStock ? (adding ? "Adding…" : "Add to cart") : "Out of stock"}
          </span>
        </button>
      )}
    </Link>
  );
};
