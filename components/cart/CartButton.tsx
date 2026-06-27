"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { CartIcon } from "@/assets/svgs";
import { useCart, type CartLine } from "@/hooks/useCart";
import { useAuthModal } from "@/components/authModal/AuthModal";
import { useGetBestSellersQuery } from "@/redux/api/catalog";
import { getApiErrorMessage } from "@/utils/helpers";
import { Typography } from "../typography";
import { notify } from "../notifications/notify";
import Image from "next/image";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;
const FREE_SHIP = 150000;
// Fallbacks used only when a product has no explicit engraving config.
const FONTS = ["Times", "Gill Sans", "Modern Bold"];
const MAX_CHARS = 22;

export const CartButton = () => {
  const router = useRouter();
  const { requireAuth } = useAuthModal();
  const {
    items,
    subtotal,
    count,
    setItemQty,
    removeItem,
    setEngraving,
    addItem,
  } = useCart();
  const { data: bestRes } = useGetBestSellersQuery({ limit: 6 });

  const [open, setOpen] = useState(false);

  const [engravingLine, setEngravingLine] = useState<CartLine | null>(null);
  const [eFont, setEFont] = useState(FONTS[1]);
  const [eLines, setELines] = useState<string[]>(["", "", ""]);
  const [savingEngraving, setSavingEngraving] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (engravingLine) setEngravingLine(null);
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, engravingLine]);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const guard = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
    } catch (err) {
      notify.error({ message: msg, subtitle: getApiErrorMessage(err) });
    }
  };

  // Active engraving config from the line being edited, with fallbacks.
  const activeCfg = engravingLine?.engravingConfig;
  const activeFee = activeCfg?.fee ?? 0;
  const activeFonts = activeCfg?.fonts?.length ? activeCfg.fonts : FONTS;
  const activeMaxChars = activeCfg?.maxCharacters ?? MAX_CHARS;

  const openEngraving = (line: CartLine) => {
    const cfg = line.engravingConfig;
    const fonts = cfg?.fonts?.length ? cfg.fonts : FONTS;
    const maxLines = Math.max(1, cfg?.maxLines ?? 3);
    setEFont(line.engraving?.font || fonts[0]);
    setELines(
      Array.from({ length: maxLines }, (_, i) => line.engraving?.lines[i] ?? ""),
    );
    setEngravingLine(line);
  };

  const saveEngraving = async () => {
    if (!engravingLine) return;
    setSavingEngraving(true);
    try {
      await setEngraving(engravingLine, { font: eFont, lines: eLines });
      setEngravingLine(null);
    } catch (err) {
      notify.error({
        message: "Could not save engraving",
        subtitle: getApiErrorMessage(err),
      });
    } finally {
      setSavingEngraving(false);
    }
  };

  const removeEngraving = async (line: CartLine) =>
    guard(() => setEngraving(line, { lines: [] }), "Could not update");

  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP) * 100));

  const recommendations = (bestRes?.data ?? [])
    .filter((p) => !items.some((it) => it.product === p._id))
    .slice(0, 4);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Cart"
        aria-expanded={open}
        className="grid place-items-center aspect-square h-[50px] rounded-full bg-card hover:bg-LB400 text-N0 transition-colors"
      >
        <CartIcon />
      </button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-BR500 text-white text-[10px] font-bold grid place-items-center pointer-events-none">
          {count}
        </span>
      )}

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[440px] max-w-[94vw] bg-white z-[70] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-N20">
          {engravingLine ? (
            <button
              type="button"
              onClick={() => setEngravingLine(null)}
              className="flex items-center gap-2 text-BR500"
            >
              <ChevronLeft size={20} />
              <Typography fontWeight="medium">Add engraving</Typography>
              <span className="text-N400 text-sm">+{money(activeFee)}</span>
            </button>
          ) : (
            <Typography variant="h-s" fontWeight="medium" color="BR500">
              Shopping Cart
            </Typography>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="text-N500 hover:text-BR500 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {engravingLine ? (
          <>
            <div className="flex-1 overflow-auto hideScrollBar p-5 flex flex-col gap-5">
              <div>
                <Typography variant="p-s" color="N500" className="mb-2">
                  Preview
                </Typography>
                <div className="aspect-[16/9] rounded-xl bg-N10 grid place-items-center p-6">
                  <div
                    className={`text-center text-BR500 leading-snug ${
                      eFont === "Times" ? "font-serif" : ""
                    } ${eFont === "Modern Bold" ? "font-bold tracking-wide" : ""}`}
                  >
                    {eLines.filter(Boolean).length ? (
                      eLines.map((l, i) => (l ? <div key={i}>{l}</div> : null))
                    ) : (
                      <span className="text-N400 text-sm">
                        Your engraving preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Typography
                  fontWeight="bold"
                  color="BR500"
                  className="mb-2 text-sm"
                >
                  Select font style
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {activeFonts.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setEFont(f)}
                      className={`flex-1 rounded-lg border py-3 text-center transition-colors ${
                        eFont === f
                          ? "border-BR500 bg-LB50"
                          : "border-N30 hover:border-BR200"
                      }`}
                    >
                      <div
                        className={`text-sm ${f === "Times" ? "font-serif" : ""} ${
                          f === "Modern Bold" ? "font-bold" : ""
                        }`}
                      >
                        {f}
                      </div>
                      <div className="text-[10px] text-N400">ABC abc</div>
                    </button>
                  ))}
                </div>
              </div>

              {eLines.map((val, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Typography variant="p-s" fontWeight="medium" color="N600">
                      Line {i + 1}
                    </Typography>
                    <span className="text-[11px] text-N400">
                      {activeMaxChars} character max
                    </span>
                  </div>
                  <input
                    value={val}
                    maxLength={activeMaxChars}
                    placeholder={`Line ${i + 1} text`}
                    onChange={(e) =>
                      setELines((prev) =>
                        prev.map((l, j) => (j === i ? e.target.value : l)),
                      )
                    }
                    className="w-full border border-N40 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-BR400 transition-colors"
                  />
                </div>
              ))}

              <Typography
                variant="p-s"
                color="N500"
                className="leading-relaxed"
              >
                Add engraving for {money(activeFee)}. Please allow 3–5 business
                days. No exchanges or refunds. Keep it clean — we may reject
                offensive or inappropriate requests.
              </Typography>
            </div>

            <div className="p-4 border-t border-N20">
              <button
                type="button"
                onClick={saveEngraving}
                disabled={savingEngraving}
                className="w-full py-4 text-sm uppercase tracking-[1.5px] bg-BR500 text-white hover:bg-BR400 transition-colors disabled:opacity-60"
              >
                {savingEngraving ? "Saving…" : "Add Engraving"}
              </button>
            </div>
          </>
        ) : items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <ShoppingBag size={36} className="text-N300" />
              <Typography color="N500">Your cart is empty.</Typography>
              <button
                type="button"
                onClick={() => go("/shop")}
                className="text-sm text-BR500 underline hover:text-BR400 transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto hideScrollBar divide-y divide-N20">
              {items.map((it) => (
                <div key={it.id} className="p-4 flex gap-3">
                  <div className="w-20 relative h-20 bg-N10 rounded-lg overflow-hidden shrink-0">
                    {it.image && (
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Typography
                        color="BR500"
                        className="text-sm font-medium leading-snug"
                      >
                        {it.name}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        color="BR500"
                        className="text-sm"
                      >
                        {money(it.lineTotal)}
                      </Typography>
                    </div>

                    {it.engraving && it.engraving.lines.length > 0 && (
                      <Typography
                        variant="p-s"
                        color="N500"
                        className="text-xs"
                      >
                        Engraving: {it.engraving.lines.join(" / ")} (+
                        {money(it.engraving.fee * it.quantity)})
                      </Typography>
                    )}

                    {(it.engravingConfig?.available || it.engraving) && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEngraving(it)}
                          className="flex items-center gap-1 text-xs text-BR500 border border-N30 rounded-md px-2.5 py-1.5 hover:border-BR400 transition-colors"
                        >
                          <Plus size={13} />
                          {it.engraving
                            ? "Edit engraving"
                            : `Add Engraving - ${money(
                                it.engravingConfig?.fee ?? 0,
                              )}`}
                        </button>
                        {it.engraving && (
                          <button
                            type="button"
                            onClick={() => removeEngraving(it)}
                            className="text-xs text-N400 hover:text-R400 underline"
                          >
                            remove
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border border-N40 rounded-lg">
                        <button
                          type="button"
                          onClick={() =>
                            guard(
                              () => setItemQty(it, it.quantity - 1),
                              "Update failed",
                            )
                          }
                          className="p-2 text-N500 hover:text-BR500 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            guard(
                              () => setItemQty(it, it.quantity + 1),
                              "Update failed",
                            )
                          }
                          className="p-2 text-N500 hover:text-BR500 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          guard(() => removeItem(it), "Remove failed")
                        }
                        className="grid place-items-center w-9 h-9 rounded-lg bg-BR500 text-white hover:bg-BR400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recommendations.length > 0 && (
                <div className="p-4">
                  <Typography
                    fontWeight="bold"
                    color="BR500"
                    className="text-sm mb-3"
                  >
                    You may also like
                  </Typography>
                  <div className="flex gap-3 overflow-x-auto hideScrollBar pb-1">
                    {recommendations.map((p) => {
                      const recPrice =
                        p.discount?.price && p.discount.price > 0
                          ? p.discount.price
                          : p.basePrice;
                      return (
                        <div
                          key={p._id}
                          className="w-32 shrink-0 flex flex-col gap-1.5"
                        >
                          <div className="w-full aspect-square relative rounded-lg bg-N10 overflow-hidden">
                            {p.coverImage && (
                              <Image
                                src={p.coverImage}
                                alt={p.name}
                                fill
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <Typography
                            color="BR500"
                            className="text-xs truncate"
                          >
                            {p.name}
                          </Typography>
                          <Typography
                            fontWeight="bold"
                            color="BR500"
                            className="text-xs"
                          >
                            {money(recPrice)}
                          </Typography>
                          <button
                            type="button"
                            onClick={() =>
                              guard(
                                () =>
                                  addItem({
                                    product: p._id,
                                    quantity: 1,
                                    name: p.name,
                                    image: p.coverImage,
                                    unitPrice: recPrice,
                                    stock: p.quantity || 9999,
                                    engravingConfig: p.engraving,
                                  }),
                                "Could not add",
                              )
                            }
                            className="text-[11px] uppercase tracking-[1px] border border-BR400 text-BR500 rounded py-1.5 hover:bg-LB50 transition-colors"
                          >
                            Add to cart
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-N20 flex flex-col gap-3">
              <Typography variant="p-s" color="N500">
                Taxes and shipping calculated at checkout.
              </Typography>
              <div className="flex items-center justify-between">
                <Typography fontWeight="bold" color="BR500">
                  Subtotal
                </Typography>
                <Typography fontWeight="bold" color="BR500" className="text-lg">
                  {money(subtotal)}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go("/cart")}
                  className="flex-1 py-3.5 text-xs uppercase tracking-[1px] border border-BR400 text-BR500 hover:bg-LB50 transition-colors"
                >
                  View cart
                </button>
                <button
                  type="button"
                  onClick={() =>
                    requireAuth(() => go("/checkout"))
                  }
                  className="flex-[1.5] py-3.5 text-xs uppercase tracking-[1.5px] bg-BR500 text-white hover:bg-BR400 transition-colors"
                >
                  Check out
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
