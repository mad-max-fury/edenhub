import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { CartLine } from "@/hooks/useCart";

export type StockTone = "in" | "low" | "out";

export const getStockStatus = (
  line: Pick<CartLine, "stock" | "quantity">,
): { tone: StockTone; label: string } => {
  const stock = Number(line.stock ?? 0);
  if (stock <= 0) return { tone: "out", label: "Out of stock" };
  if (line.quantity > stock)
    return { tone: "low", label: `Only ${stock} left in stock` };
  if (stock <= 5) return { tone: "low", label: `Low stock · ${stock} left` };
  return { tone: "in", label: "In stock" };
};

const TONES = {
  in: { cls: "bg-G50 text-G500", Icon: CheckCircle2 },
  low: { cls: "bg-Y50 text-Y500", Icon: AlertTriangle },
  out: { cls: "bg-R50 text-R500", Icon: XCircle },
} as const;

export const StockBadge = ({ line }: { line: CartLine }) => {
  const { tone, label } = getStockStatus(line);
  const { cls, Icon } = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${cls}`}
    >
      <Icon size={11} />
      {label}
    </span>
  );
};
