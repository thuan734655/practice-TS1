import { Validate } from "../helper/validate";
<<<<<<< Updated upstream
import AuthModel from "../models/authModel";
import { Router } from "../router/router";
import { dataLogin } from "../types/login";
=======
import UserModel from "../models/userModel";
import { Router } from "../router/router";
import { dataLogin, dataRegister } from "../types/login";
>>>>>>> Stashed changes
import { Toast } from "../utils/toast";

export default class UserController {
    public static async login(dataLogin: dataLogin) {
        try {
            const validationError = Validate.validateCredentials(dataLogin.email, dataLogin.password);
            if (validationError) {
                Toast.showError(validationError);
                return;
            }

<<<<<<< Updated upstream
            const result = await AuthModel.login(dataLogin);
=======
            const result = await UserModel.login(dataLogin);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
}
=======
    public static async register(dataRegister: dataRegister) {
        try {
            const validationError = Validate.validateCredentials(dataRegister.email, dataRegister.password, dataRegister.name);
            if (validationError) {
                Toast.showError(validationError);
                return;
            }
            const result = await UserModel.register(dataRegister);
            console.log(result)
            if (result.success) {
                Toast.showSuccess('Registration successful! Please login.');
                Router.getInstance().navigateTo('/login');
            } else {
                Toast.showError(result.message);
            }
            
        } catch (error) {
            console.log('Login failed. Please try again!');
            throw error;
        }
    }
}
>>>>>>> Stashed changes
