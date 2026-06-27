export interface IReviewAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface IReview {
  _id: string;
  product: string | { _id: string; name: string; coverImage?: string };
  user: IReviewAuthor | string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  images: string[];
  likes: number;
  likedBy: string[];
  helpful: number;
  replies: IReviewReply[];
  createdAt: string;
}

export interface IReviewReply {
  _id?: string;
  user: IReviewAuthor | string;
  comment: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface IReviewMetadata {
  pageSize: number;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IProductReviewsResponse {
  status: number;
  message: string;
  data: {
    data: IReview[];
    metadata: IReviewMetadata;
    canReview?: boolean;
  };
}

export interface ICreateReviewPayload {
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface IPendingReview {
  product: string;
  name: string;
  image?: string;
  orderNumber: string;
  deliveredAt: string;
}

export interface IMyReviews {
  pending: IPendingReview[];
  reviewed: IReview[];
}
