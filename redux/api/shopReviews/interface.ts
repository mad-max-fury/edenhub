export interface IShopReview {
  _id: string;
  name: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
  status: string;
  createdAt?: string;
}

export interface ICreateShopReview {
  name: string;
  email?: string;
  title?: string;
  comment: string;
  rating: number;
  image?: string;
}
