export interface Response<T = null> {
  status: number;
  message: string;
  data: T;
}
export interface IApiError {
  status: string | number;
  message: string;
  errors: string[];
  success?: boolean;
}
export interface IPaginatedResponse<T> {
  message: string;
  data: {
    docs: Array<T>;
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
  status: number;
}
