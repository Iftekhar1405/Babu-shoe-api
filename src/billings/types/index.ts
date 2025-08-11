export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    // Add other user properties as needed
  };
}