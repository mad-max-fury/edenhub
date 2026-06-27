export interface IEngraving {
  font?: string;
  lines: string[];
  fee: number;
}

// The product's engraving offer (what the customer can configure).
export interface IEngravingConfig {
  available: boolean;
  fee: number;
  maxCharacters: number;
  maxLines: number;
  fonts: string[];
}

export interface ICartItem {
  _id: string;
  product: string;
  variantId?: string;
  name: string;
  image?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stock: number;
  engraving?: IEngraving;
  engravingConfig?: IEngravingConfig;
}

export interface ISetEngraving {
  itemId: string;
  font?: string;
  lines: string[];
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  count: number;
}

export interface IAddCartItem {
  product: string;
  variantId?: string;
  quantity?: number;
  // Client-only hints used for the optimistic cache update (ignored by the API).
  name?: string;
  image?: string;
  unitPrice?: number;
  stock?: number;
  engravingConfig?: IEngravingConfig;
}
