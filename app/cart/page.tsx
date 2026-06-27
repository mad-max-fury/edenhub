"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button, Footer, GlobalMenu, Typography, notify } from "@/components";
import { useAuthModal } from "@/components/authModal/AuthModal";
import { useCart, type CartLine } from "@/hooks/useCart";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useGetBestSellersQuery } from "@/redux/api/catalog";
import { getApiErrorMessage } from "@/utils/helpers";
import { CartItemRow } from "./components/CartItemRow";
import { CartSummary } from "./components/CartSummary";
import { EngravingModal } from "./components/EngravingModal";
import { ProductRail } from "./components/ProductRail";
import { getStockStatus } from "./components/StockBadge";

const CartPage = () => {
  const router = useRouter();
  const { requireAuth } = useAuthModal();
  const {
    items,
    subtotal,
    count,
    isLoading,
    setItemQty,
    removeItem,
    setEngraving,
  } = useCart();

  const [engravingLine, setEngravingLine] = useState<CartLine | null>(null);
  const [saving, setSaving] = useState(false);

  const recentlyViewed = useRecentlyViewed();
  const { data: bestRes } = useGetBestSellersQuery({ limit: 12 });

  const cartIds = items.map((it) => it.product);
  const recentRail = recentlyViewed
    .filter((p) => !cartIds.includes(p._id))
    .slice(0, 10);
  const recentIds = recentRail.map((p) => p._id);
  const alsoViewedRail = (bestRes?.data ?? [])
    .filter((p) => !cartIds.includes(p._id) && !recentIds.includes(p._id))
    .slice(0, 10);

  const hasOutOfStock = items.some((it) => getStockStatus(it).tone === "out");

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); } catch (err) { notify.error({ message: msg, subtitle: getApiErrorMessage(err) }); }
  };
  const changeQty = (line: CartLine, quantity: number) => guard(() => setItemQty(line, quantity), "Update failed");
  const remove = (line: CartLine) => guard(() => removeItem(line), "Remove failed");
  const removeEngraving = (line: CartLine) => guard(() => setEngraving(line, { lines: [] }), "Could not update");
  const saveEngraving = async (data: { font: string; lines: string[] }) => {
    if (!engravingLine) return;
    setSaving(true);
    try { await setEngraving(engravingLine, data); setEngravingLine(null); }
    catch (err) { notify.error({ message: "Could not save engraving", subtitle: getApiErrorMessage(err) }); }
    finally { setSaving(false); }
  };

  return (
    <>
      <GlobalMenu />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-N900">Shopping Cart</h1>
            {!isLoading && items.length > 0 && (
              <span className="text-sm text-N400">({count} item{count === 1 ? "" : "s"})</span>
            )}
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-sm text-N500 hover:text-N800">
            <ArrowLeft size={14} /> Continue shopping
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div className="flex flex-col gap-0 border border-N30 rounded divide-y divide-N20">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse bg-N10 m-4 rounded" />)}
            </div>
            <div className="h-56 bg-N10 rounded animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <ShoppingBag size={40} className="text-N200" />
            <p className="text-sm text-N500">Your cart is empty.</p>
            <Button variant="brown-light" onClick={() => router.push("/shop")}>
              Start shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            {/* Items */}
            <div className="border border-N30 rounded">
              {/* Table header — desktop */}
              <div className="hidden sm:flex items-center px-4 py-2.5 border-b border-N30 bg-N10 text-xs text-N400 uppercase tracking-wide">
                <span className="flex-1">Product</span>
                <span className="w-28 text-center">Quantity</span>
                <span className="w-24 text-right">Total</span>
                <span className="w-10" />
              </div>

              <div className="divide-y divide-N20 px-4">
                {items.map((it) => (
                  <CartItemRow
                    key={it.id}
                    line={it}
                    onChangeQty={changeQty}
                    onRemove={remove}
                    onEditEngraving={setEngravingLine}
                    onRemoveEngraving={removeEngraving}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <CartSummary
              count={count}
              subtotal={subtotal}
              hasOutOfStock={hasOutOfStock}
              onCheckout={() => requireAuth(() => router.push("/checkout"))}
            />
          </div>
        )}

        {/* Product recommendations */}
        {!isLoading && (
          <>
            <ProductRail title="Recently viewed" products={recentRail} />
            <ProductRail title="You may also like" subtitle="Popular picks other shoppers love" products={alsoViewedRail} />
          </>
        )}
      </main>
      <Footer />

      {engravingLine && (
        <EngravingModal key={engravingLine.id} line={engravingLine} saving={saving} onClose={() => setEngravingLine(null)} onSave={saveEngraving} />
      )}
    </>
  );
};

export default CartPage;
