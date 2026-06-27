export interface IDisputeMessage {
  _id?: string;
  sender: "customer" | "admin";
  senderId?: { _id: string; firstName: string; lastName: string };
  body: string;
  images: string[];
  createdAt: string;
}

export interface IDispute {
  _id: string;
  customer: { _id: string; firstName: string; lastName: string; email: string };
  order: {
    _id: string;
    orderNumber: string;
    grandTotal: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    paymentReference?: string;
    paymentProvider?: string;
  };
  type: string;
  reason: string;
  description?: string;
  images: string[];
  status: "open" | "under_review" | "resolved" | "rejected" | "refunded";
  resolution?: string;
  refundAmount?: number;
  resolvedAt?: string;
  resolvedBy?: { _id: string; firstName: string; lastName: string };
  messages: IDisputeMessage[];
  createdAt: string;
  updatedAt: string;
}
