export interface IOrderItemInput {
  product: string;
  variantId?: string;
  quantity: number;
  engraving?: { font?: string; lines: string[] };
}

export interface IReceiverAddress {
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  additionalPhone?: string;
  email?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  addressCode?: string;
}

export interface ICourierRate {
  courierId: string;
  courierName: string;
  courierLogo?: string;
  serviceCode: string;
  amount: number;
  currency: string;
  deliveryEta?: string;
}

export interface IFetchRatesResult {
  requestToken: string;
  receiverAddressCode: string;
  couriers: ICourierRate[];
}

export interface ISelectedCourier {
  courierId: string;
  courierName?: string;
  courierLogo?: string;
  serviceCode: string;
  requestToken: string;
  amount: number;
}

export interface ICreateOrderPayload {
  items: IOrderItemInput[];
  shippingAddress: IReceiverAddress;
  billingAddress?: IReceiverAddress;
  selectedCourier?: ISelectedCourier;
  customerNote?: string;
  paymentProvider?: "paystack" | "stripe";
}

export interface IOrderItem {
  name: string;
  sku?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ITimelineEntry {
  type: string;
  message: string;
  at: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentProvider?: string;
  paymentAuthorizationUrl?: string;
  paidAt?: string;
  shipment?: {
    courier?: string;
    courierLogo?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  shippingAddress?: IReceiverAddress;
  timeline?: ITimelineEntry[];
  createdAt: string;
}

export interface IOrderMetadata {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IMyOrdersResponse {
  status: number;
  message: string;
  data: {
    data: IOrder[];
    metadata: IOrderMetadata;
  };
}
