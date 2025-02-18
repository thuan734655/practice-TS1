import { Validate } from "../helper/validateAuth.ts";
import UserModel from "../models/userModel";
import { Router } from "../router/router";
import { dataLogin, dataRegister } from "../types/authTypes.ts";
import { setDataLocalStorage } from "../utils/localStorage";
import { clearError, showError } from "@/utils/formErrorHandler.ts";
import { IAuthResponse } from "@/types/apiResponseTypes.ts";

export default class UserController {
  public static async login(dataLogin: dataLogin): Promise<IAuthResponse> {
    const emailValidationError = Validate.validateEmail(dataLogin.email);
    const passwordValidationError = Validate.validatePassword(dataLogin.password);
    
    if (emailValidationError) {
      showError("email");
    } else {
      clearError("email");
    }

    if (passwordValidationError) {
      showError("password");
    } else {
      clearError("password");
    }

    if (emailValidationError || passwordValidationError) {
      return { success: false, message: "Invalid email or password" };
    }

    const result = await UserModel.login(dataLogin);

    if (result.success) {
      setDataLocalStorage("name", result.data.user?.name ?? "");
      Router.getInstance().navigateTo("/home");
      return { success: true, message: "Login successful"};
    } else {
      return { success: false, message: result.message || "Login failed. Please try again!"};
    }
  }

  public static async register(dataRegister: dataRegister): Promise<IAuthResponse> {
    const emailValidationError = Validate.validateEmail(dataRegister.email);
    const passwordValidationError = Validate.validatePassword(dataRegister.password);
    const nameValidationError = Validate.validateName(dataRegister.name);

    if (emailValidationError) {
      showError("register-email");
    } else {
      clearError("register-email");
    }

    if (passwordValidationError) {
      showError("register-password");
    } else {
      clearError("register-password");
    }

    if (nameValidationError) {
      showError("register-name");
    } else {
      clearError("register-name");
    }

    if (emailValidationError || passwordValidationError || nameValidationError) {
      return { success: false, message: "Invalid email, password, or name"};
    }

    const result = await UserModel.register(dataRegister);

    if (result.success) {
      Router.getInstance().navigateTo('/login');
      return { success: true, message: "Registration successful" };
    } else {
      return { success: false, message: result.message || "Registration failed. Please try again!"};
    }
  }
}