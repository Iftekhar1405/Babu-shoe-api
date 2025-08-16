export type ReplaceField<T, K extends keyof T, R> = Omit<T, K> & { [P in K]: R };


export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email?: string;
        role?: string;
        name?: string
        // Add other user properties as needed
    };
}
