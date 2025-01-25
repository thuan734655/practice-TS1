import { Toast } from "@/utils/toast";
import { Validate } from "../helper/validate";
import UserModel from "../models/userModel";
import { Router } from "../router/router";
import { dataLogin, dataRegister } from "../types/login";
import { IApiResponse, ILoginResponse, IRegisterResponse } from "../types/apiResponse";
import { setDataLocalStorage } from "./localStorage";

export default class UserController {
  public static async login(dataLogin: dataLogin) {
    const emailValidationError = Validate.validateEmail(dataLogin.email);
    const passwordValidationError = Validate.validatePassword(dataLogin.password);

    if (emailValidationError) {
      this.showError("email", emailValidationError);
    } else {
      this.clearError("email");
    }

    if (passwordValidationError) {
      this.showError("password", passwordValidationError);
    } else {
      this.clearError("password");
    }

    if (emailValidationError || passwordValidationError) {
      return;
    }

    const result: IApiResponse<ILoginResponse> = await UserModel.login(dataLogin);

    if (result.success && result.data) {
      Router.getInstance().navigateTo("/home");
      setDataLocalStorage("name", result.data.user.name);
      this.clearError("email");
      this.clearError("password");
      Toast.showSuccess("Login successful!");
    } else {
      Toast.showError(result.message || "Login failed. Please try again!");
    }
  }

  public static async register(dataRegister: dataRegister) {
    const emailValidationError = Validate.validateEmail(dataRegister.email);
    const passwordValidationError = Validate.validatePassword(dataRegister.password);
    const nameValidationError = Validate.validateName(dataRegister.name);

    if (emailValidationError) {
      this.showError("register-email", emailValidationError);
    } else {
      this.clearError("register-email");
    }

    if (passwordValidationError) {
      this.showError("register-password", passwordValidationError);
    } else {
      this.clearError("register-password");
    }

    if (nameValidationError) {
      this.showError("register-name", nameValidationError);
    } else {
      this.clearError("register-name");
    }

    if (emailValidationError || passwordValidationError || nameValidationError) {
      return;
    }

    const result: IApiResponse<IRegisterResponse> = await UserModel.register(dataRegister);

    if (result.success) {
      Router.getInstance().navigateTo('/login');
      this.clearError("register-email");
      this.clearError("register-password");
      this.clearError("register-name");
      Toast.showSuccess("Registration successful!");
    } else {
      Toast.showError(result.message || "Registration failed. Please try again!");
    }
  }

  private static showError(inputName: string, errorMessage: string) {
    const errorElement = document.querySelector(`#error-${inputName}`) as HTMLParagraphElement;
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
    }
  }

  private static clearError(inputName: string) {
    const errorElement = document.querySelector(`#error-${inputName}`) as HTMLParagraphElement;
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }
}
