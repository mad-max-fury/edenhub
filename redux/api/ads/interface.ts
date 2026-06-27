import { ICatalogProduct } from "../catalog/interface";

export interface IAd {
  _id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  placement: "hero" | "shop" | "both";
  products: ICatalogProduct[];
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}
