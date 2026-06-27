"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, X, ArrowLeft } from "lucide-react";
import { Footer, GlobalMenu, Button } from "@/components";
import { useCompare, removeFromCompare, clearCompare } from "@/hooks/useCompare";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const Stars = ({ value }: { value: number }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-N100"}
      />
    ))}
  </span>
);

export default function ComparePage() {
  const router = useRouter();
  const items = useCompare();

  const allAttrs = new Set<string>();
  items.forEach((p) => {
    if (p.attributes) Object.keys(p.attributes).forEach((k) => allAttrs.add(k));
  });
  const attrKeys = Array.from(allAttrs);

  return (
    <>
      <GlobalMenu />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-N500 hover:text-N800">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-bold text-N900">
              Compare Products ({items.length})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs text-R500 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-N400 mb-4">No products to compare.</p>
            <Button variant="brown-light" onClick={() => router.push("/shop")}>
              Browse products
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left p-3 text-N400 text-xs uppercase tracking-wider w-32">
                    Feature
                  </th>
                  {items.map((p) => (
                    <th key={p._id} className="p-3 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2 relative">
                        <button
                          onClick={() => removeFromCompare(p._id)}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-N50 hover:bg-R50 text-N400 hover:text-R500 grid place-items-center"
                        >
                          <X size={12} />
                        </button>
                        <Link href={`/shop/${p.slug || p._id}`}>
                          <div className="w-24 h-24 rounded overflow-hidden bg-N10 relative">
                            {(p.coverImage || p.images?.[0]) && (
                              <Image
                                src={p.coverImage || p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </Link>
                        <Link
                          href={`/shop/${p.slug || p._id}`}
                          className="text-xs font-medium text-N800 text-center hover:text-BR500 line-clamp-2"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-N20">
                {/* Price */}
                <tr className="bg-N10/50">
                  <td className="p-3 text-N500 font-medium">Price</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center">
                      <span className="font-bold text-N900">
                        {money(p.discount?.price || p.basePrice)}
                      </span>
                      {p.discount?.price && p.discount.price > 0 && (
                        <span className="text-xs text-N400 line-through ml-1.5">
                          {money(p.basePrice)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Rating */}
                <tr>
                  <td className="p-3 text-N500 font-medium">Rating</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <Stars value={p.averageRating} />
                        <span className="text-xs text-N400">({p.totalReviews})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Brand */}
                <tr className="bg-N10/50">
                  <td className="p-3 text-N500 font-medium">Brand</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center text-N700">
                      {p.brand || "—"}
                    </td>
                  ))}
                </tr>
                {/* Stock */}
                <tr>
                  <td className="p-3 text-N500 font-medium">In Stock</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center">
                      {p.quantity > 0 ? (
                        <span className="text-G600">Yes ({p.quantity})</span>
                      ) : (
                        <span className="text-R500">Out of stock</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Variants */}
                <tr className="bg-N10/50">
                  <td className="p-3 text-N500 font-medium">Variants</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center text-N700">
                      {p.variants?.length
                        ? p.variants.map((v) => v.name).join(", ")
                        : "—"}
                    </td>
                  ))}
                </tr>
                {/* Warranty */}
                <tr>
                  <td className="p-3 text-N500 font-medium">Warranty</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center text-N700">
                      {p.hasWarranty ? `${p.warrantyYears ?? 0} year(s)` : "No"}
                    </td>
                  ))}
                </tr>
                {/* Returns */}
                <tr className="bg-N10/50">
                  <td className="p-3 text-N500 font-medium">Returns</td>
                  {items.map((p) => (
                    <td key={p._id} className="p-3 text-center text-N700">
                      {p.isReturnable
                        ? `${p.returnableDays ?? 0} days`
                        : "No returns"}
                    </td>
                  ))}
                </tr>
                {/* Dynamic attributes */}
                {attrKeys.map((key, i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-N10/50" : ""}>
                    <td className="p-3 text-N500 font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    {items.map((p) => (
                      <td key={p._id} className="p-3 text-center text-N700">
                        {p.attributes?.[key] != null
                          ? String(p.attributes[key])
                          : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
