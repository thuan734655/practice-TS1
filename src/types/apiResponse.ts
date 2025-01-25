export interface IApiResponse<T> {
    data?: T;
    totalItems?: number;
    message: string;
    success?: boolean;
}
  
export interface ILoginResponse {
    user: {
        name: string;
        email: string;
    }
}

export interface IRegisterResponse {
    id: string;
    email: string;
    name: string;
}
  