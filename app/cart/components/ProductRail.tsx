import type { ICatalogProduct } from "@/redux/api/catalog";
import { ShopProductCard } from "@/app/shop/components/shopProductCard";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: ICatalogProduct[];
}

export const ProductRail = ({ title, subtitle, products }: ProductRailProps) => {
  if (products.length === 0) return null;
  return (
    <section className="mt-12">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-N900">{title}</h3>
        {subtitle && <p className="text-xs text-N400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto hideScrollBar pb-2 -mx-1 px-1">
        {products.map((p) => (
          <div key={p._id} className="w-[160px] sm:w-[200px] shrink-0">
            <ShopProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};
