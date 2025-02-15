export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T | null;
  error?: any;
};
