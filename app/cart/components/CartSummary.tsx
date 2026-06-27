import { AlertTriangle, Lock, Shield } from "lucide-react";
import { Button, Typography } from "@/components";
import { money } from "./constants";

interface CartSummaryProps {
  count: number;
  subtotal: number;
  hasOutOfStock: boolean;
  onCheckout: () => void;
}

export const CartSummary = ({
  count,
  subtotal,
  hasOutOfStock,
  onCheckout,
}: CartSummaryProps) => (
  <section className="border border-N30 rounded p-5 flex flex-col gap-0 lg:sticky lg:top-6">
    <h3 className="text-sm font-semibold text-N900 mb-4">Order Summary</h3>

    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between">
        <span className="text-N400">Subtotal ({count} items)</span>
        <span className="text-N700">{money(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-N400">Shipping</span>
        <span className="text-N400">Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-semibold border-t border-N20 pt-3 mt-1">
        <span className="text-N900">Estimated Total</span>
        <span className="text-N900">{money(subtotal)}</span>
      </div>
    </div>

    {hasOutOfStock && (
      <div className="flex items-start gap-2 rounded bg-R50 text-R500 px-3 py-2.5 mt-4">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <span className="text-xs leading-relaxed">
          Some items are out of stock. Remove them to continue.
        </span>
      </div>
    )}

    <Button
      variant="brown-light"
      className="w-full mt-4"
      disabled={hasOutOfStock || count === 0}
      onClick={onCheckout}
    >
      Proceed to Checkout
    </Button>

    <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-N400">
      <Shield size={11} />
      <span>Secure checkout · SSL encrypted</span>
    </div>
  </section>
);
