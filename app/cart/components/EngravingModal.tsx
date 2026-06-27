import { useState } from "react";
import { X } from "lucide-react";
import { Typography } from "@/components";
import type { CartLine } from "@/hooks/useCart";
import { FONTS, MAX_CHARS, money } from "./constants";

interface EngravingModalProps {
  line: CartLine;
  saving: boolean;
  onClose: () => void;
  onSave: (data: { font: string; lines: string[] }) => void;
}

export const EngravingModal = ({
  line,
  saving,
  onClose,
  onSave,
}: EngravingModalProps) => {
  // Per-product engraving config, with sensible fallbacks.
  const cfg = line.engravingConfig;
  const fee = cfg?.fee ?? 0;
  const fonts = cfg?.fonts?.length ? cfg.fonts : FONTS;
  const maxChars = cfg?.maxCharacters ?? MAX_CHARS;
  const maxLines = Math.max(1, cfg?.maxLines ?? 3);

  const [font, setFont] = useState(line.engraving?.font || fonts[0]);
  const [lines, setLines] = useState<string[]>(
    Array.from({ length: maxLines }, (_, i) => line.engraving?.lines[i] ?? ""),
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-N20">
          <div>
            <Typography fontWeight="bold" color="BR500">
              Add engraving
            </Typography>
            <Typography color="N400" className="text-xs">
              +{money(fee)} · {line.name}
            </Typography>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-N500 hover:text-BR500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Preview */}
          <div className="aspect-[16/9] rounded-xl bg-N10 grid place-items-center p-6">
            <div
              className={`text-center text-BR500 leading-snug ${
                font === "Times" ? "font-serif" : ""
              } ${font === "Modern Bold" ? "font-bold tracking-wide" : ""}`}
            >
              {lines.filter(Boolean).length ? (
                lines.map((l, i) => (l ? <div key={i}>{l}</div> : null))
              ) : (
                <span className="text-N400 text-sm">Your engraving preview</span>
              )}
            </div>
          </div>

          {/* Fonts */}
          <div>
            <Typography fontWeight="bold" color="BR500" className="mb-2 text-sm">
              Select font style
            </Typography>
            <div className="flex flex-wrap gap-2">
              {fonts.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFont(f)}
                  className={`flex-1 rounded-lg border py-3 text-center transition-colors ${
                    font === f
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

          {/* Lines */}
          {lines.map((val, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <Typography variant="p-s" fontWeight="medium" color="N600">
                  Line {i + 1}
                </Typography>
                <span className="text-[11px] text-N400">
                  {maxChars} character max
                </span>
              </div>
              <input
                value={val}
                maxLength={maxChars}
                placeholder={`Line ${i + 1} text`}
                onChange={(e) =>
                  setLines((prev) =>
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
            className="leading-relaxed text-xs"
          >
            Add engraving for {money(fee)}. Please allow 3–5 business days. No
            exchanges or refunds on engraved items.
          </Typography>
        </div>

        <div className="p-4 border-t border-N20 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm uppercase tracking-[1px] border border-BR400 text-BR500 rounded-lg hover:bg-LB50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ font, lines })}
            disabled={saving}
            className="flex-[1.5] py-3 text-sm uppercase tracking-[1.5px] bg-BR500 text-white rounded-lg hover:bg-BR400 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save engraving"}
          </button>
        </div>
      </div>
    </div>
  );
};
