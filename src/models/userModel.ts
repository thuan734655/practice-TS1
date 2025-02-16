import axiosAPI from "@/api/configAxios";
import { IApiResponse, IUserResponse } from "../types/apiResponseTypes.ts";
import { dataLogin, dataRegister } from "../types/authTypes.ts";
import handleAxiosError from "@/helper/handleAxiosError";

export default class UserModel {
  public static async login(dataLogin: dataLogin): Promise<IApiResponse<IUserResponse>> {
    try {
      const response = await axiosAPI.post<IApiResponse<IUserResponse>>('/login', dataLogin);
      return response.data;
    } catch (error:unknown) {
      console.log(error);
      return handleAxiosError(error, `Failed to login`, { user: null });
    }
  }

  public static async register(dataRegister: dataRegister): Promise<IApiResponse<boolean>> {
    try {
      const response = await axiosAPI.post<IApiResponse<boolean>>('/register', dataRegister);
      return response.data;
    } catch (error: unknown) {
      return handleAxiosError(error, `Failed to register`, false);
  }
}
}

