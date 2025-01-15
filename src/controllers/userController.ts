import { Validate } from "../helper/validate";
import AuthModel from "../models/authModel";
import { Router } from "../router/router";
import { dataLogin } from "../types/login";
import { Toast } from "../utils/toast";

export default class UserController {
    public static async login(dataLogin: dataLogin) {
        try {
            const validationError = Validate.validateCredentials(dataLogin.email, dataLogin.password);
            if (validationError) {
                Toast.showError(validationError);
                return;
            }

            const result = await AuthModel.login(dataLogin);

            if (result.success) {
                Router.getInstance().navigateTo("/home");
                localStorage.setItem("user", JSON.stringify(result.user));
                Toast.showSuccess("Login successful!");
            } else {
                Toast.showError("Login failed. Please try again!");
            }
        } catch (error) {
            console.error('Login failed:', error);
            Toast.showError('Login failed. Please try again!');
            throw error;
        }
    }
}