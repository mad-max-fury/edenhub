export interface ICatalogCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ICatalogVariant {
  _id?: string;
  name: string;
  sku?: string;
  basePrice: number;
  quantity: number;
  images?: string[];
  attributes?: Record<string, unknown>;
  discount?: { price?: number; percentage?: number };
}

export interface ICatalogProduct {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  brand?: string;
  videos?: string[];
  viewCount?: number;
  lowStockThreshold?: number;
  category: ICatalogCategory | string;
  basePrice: number;
  discount?: {
    price?: number;
    percentage?: number;
    promotionName?: string;
  };
  coverImage?: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
  quantity: number;
  variants: ICatalogVariant[];
  attributes?: Record<string, unknown>;
  tags?: string[];
  isReturnable?: boolean;
  returnableDays?: number;
  hasWarranty?: boolean;
  warrantyYears?: number;
  engraving?: {
    available: boolean;
    fee: number;
    maxCharacters: number;
    maxLines: number;
    fonts: string[];
  };
  status: string;
  audience?: "men" | "women" | "unisex";
  variationGroup?: string;
  variationLabel?: string;
  variationValue?: string;
  variationSiblings?: ICatalogVariationSibling[];
  relatedProducts?: ICatalogProduct[];
  createdAt?: string;
}

export interface ICatalogVariationSibling {
  _id: string;
  name: string;
  slug?: string;
  coverImage?: string;
  images?: string[];
  basePrice: number;
  quantity: number;
  variationLabel?: string;
  variationValue?: string;
  discount?: { price?: number; percentage?: number };
}

export interface ICatalogMetadata {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ICatalogListResponse {
  status: number;
  message: string;
  data: {
    data: ICatalogProduct[];
    metadata: ICatalogMetadata;
  };
}

export interface ICatalogTreeNode extends ICatalogCategory {
  level: number;
  subcategories?: ICatalogTreeNode[];
}

export interface ICatalogQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  audience?: string;
  tag?: string;
}

export interface IBestSellersQuery {
  limit?: number;
  audience?: string;
  category?: string;
}
