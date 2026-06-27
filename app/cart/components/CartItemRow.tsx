import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, PenLine, Plus, Trash2 } from "lucide-react";
import type { CartLine } from "@/hooks/useCart";
import { money } from "./constants";
import { getStockStatus, StockBadge } from "./StockBadge";

interface CartItemRowProps {
  line: CartLine;
  onChangeQty: (line: CartLine, quantity: number) => void;
  onRemove: (line: CartLine) => void;
  onEditEngraving: (line: CartLine) => void;
  onRemoveEngraving: (line: CartLine) => void;
}

export const CartItemRow = ({
  line,
  onChangeQty,
  onRemove,
  onEditEngraving,
  onRemoveEngraving,
}: CartItemRowProps) => {
  const { tone } = getStockStatus(line);
  const outOfStock = tone === "out";
  const stock = Number(line.stock ?? 0);
  const atMax = stock > 0 && line.quantity >= stock;
  const engravingOffered = !!line.engravingConfig?.available;
  const engravingFee = line.engravingConfig?.fee ?? 0;

  return (
    <div className={`flex gap-4 py-4 ${outOfStock ? "opacity-60" : ""}`}>
      {/* Image */}
      <Link href={`/shop/${line.product}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-N10 relative overflow-hidden">
          {line.image && (
            <Image src={line.image} alt={line.name} fill className="object-cover" />
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/shop/${line.product}`} className="text-sm text-N800 hover:text-N900 block truncate">
              {line.name}
            </Link>
            <div className="text-xs text-N400 mt-0.5">{money(line.unitPrice)} each</div>
          </div>
          <span className="text-sm font-semibold text-N900 shrink-0">{money(line.lineTotal)}</span>
        </div>

        {/* Engraving info */}
        {line.engraving && line.engraving.lines.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-N500 bg-N10 rounded px-2.5 py-1.5">
            <PenLine size={11} className="shrink-0" />
            <span className="truncate">
              {line.engraving.font || "Gill Sans"}: &ldquo;{line.engraving.lines.join(" / ")}&rdquo;
            </span>
            <span className="text-N400 shrink-0">+{money(line.engraving.fee * line.quantity)}</span>
          </div>
        )}

        {/* Controls row */}
        <div className="flex items-center justify-between mt-3 gap-2">
          {/* Qty stepper */}
          <div className="flex items-center border border-N30 rounded h-8">
            <button
              onClick={() => onChangeQty(line, line.quantity - 1)}
              className="w-8 h-full grid place-items-center text-N500 hover:text-N800 transition-colors"
              aria-label="Decrease"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm text-N800 border-x border-N30">{line.quantity}</span>
            <button
              onClick={() => onChangeQty(line, line.quantity + 1)}
              disabled={atMax || outOfStock}
              className="w-8 h-full grid place-items-center text-N500 hover:text-N800 transition-colors disabled:text-N200 disabled:cursor-not-allowed"
              aria-label="Increase"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <StockBadge line={line} />

            {(engravingOffered || line.engraving) && (
              <button
                onClick={() => onEditEngraving(line)}
                className="text-xs text-N400 hover:text-BR500 px-2 py-1 rounded transition-colors"
                title={line.engraving ? "Edit engraving" : `Add engraving · ${money(engravingFee)}`}
              >
                <PenLine size={13} />
              </button>
            )}

            {line.engraving && (
              <button
                onClick={() => onRemoveEngraving(line)}
                className="text-[11px] text-N400 hover:text-R400 underline"
              >
                ×
              </button>
            )}

            <button
              onClick={() => onRemove(line)}
              className="w-8 h-8 grid place-items-center rounded text-N300 hover:text-R500 hover:bg-R50 transition-colors"
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
