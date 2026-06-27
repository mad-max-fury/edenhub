export interface IAttachment {
  url: string;
  type: "image" | "video" | "audio" | "document";
  name?: string;
  mimetype?: string;
  size?: number;
}

export interface IMessage {
  _id?: string;
  sender: "customer" | "admin";
  senderId?: string | { _id: string; firstName: string; lastName: string };
  body: string;
  attachments?: IAttachment[];
  read: boolean;
  createdAt: string;
}

export interface IConversationCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IConversation {
  _id: string;
  customer: IConversationCustomer;
  subject: string;
  status: "open" | "closed";
  messages: IMessage[];
  lastMessageAt?: string;
  lastMessagePreview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConversationListResponse {
  status: string;
  data: {
    data: IConversation[];
    metadata: {
      pageSize: number;
      currentPage: number;
      totalCount: number;
      totalPages: number;
      hasPrevious: boolean;
      hasNext: boolean;
    };
  };
}
