export interface IQuestionAnswer {
  _id: string;
  user: { _id: string; firstName: string; lastName: string };
  body: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface IQuestion {
  _id: string;
  product: string;
  user: { _id: string; firstName: string; lastName: string };
  question: string;
  answers: IQuestionAnswer[];
  votes: number;
  votedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionListResponse {
  status: string;
  data: {
    data: IQuestion[];
    metadata: {
      totalCount: number;
      currentPage: number;
      totalPages: number;
      pageSize: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}
