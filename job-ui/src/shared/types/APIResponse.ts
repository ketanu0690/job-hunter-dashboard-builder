export interface CoreApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}
