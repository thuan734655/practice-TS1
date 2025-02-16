export interface IApiResponse<T> {
    data: T;
    totalItems?: number;
    message: string;
    success: boolean;
}
  
export type IUserResponse = {
    user: {
        name: string;
        email: string;
    } | null;
}

export interface IAuthResponse  {
    success: boolean;
    message: string;
}
