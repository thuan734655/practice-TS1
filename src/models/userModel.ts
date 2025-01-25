import axiosAPI from "@/api/configAxios";
import { IApiResponse, ILoginResponse, IRegisterResponse } from "../types/apiResponse";
import { dataLogin, dataRegister } from "../types/login";
import { AxiosError } from "axios";

export default class UserModel {
  public static async login(dataLogin: dataLogin): Promise<IApiResponse<ILoginResponse>> {
    try {
      const response = await axiosAPI.post<IApiResponse<ILoginResponse>>('/login', dataLogin);
      return response.data;
    } catch (error:unknown) {
      if (error instanceof AxiosError && error.response) {
        return {
          success: false,
          message: error.response.data?.message || "An unexpected error occurred.", 
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }

  public static async register(dataRegister: dataRegister): Promise<IApiResponse<IRegisterResponse>> {
    try {
      const response = await axiosAPI.post<IApiResponse<IRegisterResponse>>('/register', dataRegister);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        return {
          success: false,
          message: error.response.data?.message || "An unexpected error occurred.",
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }
}
