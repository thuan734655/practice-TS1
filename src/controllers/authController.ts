import { clearError, showErrorAndEditText } from '@/utils/formErrorHandler.ts';
import UserModel from '../models/authModel.ts';
import { Router } from '../router/router.ts';
import { dataLogin, dataRegister } from '../types/authTypes.ts.ts';
import { setDataLocalStorage } from '../utils/localStorage.ts';
import { IAuthResponse } from '@/types/apiResponseTypes.ts';
import ValidateAuth from '@/helper/validateAuth.ts';

export default class AuthController {
  public static async login(dataLogin: dataLogin): Promise<IAuthResponse | null> {
    const validatePassword = ValidateAuth.validatePassword(dataLogin.password);
    if (validatePassword != '') {
      showErrorAndEditText('password', validatePassword);
      return null;
    }

    clearError('password');

    const result = await UserModel.login(dataLogin);

    if (result.success) {
      setDataLocalStorage('name', result.data.user?.name ?? '');
      Router.getInstance().navigateTo('/home');
      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: result.message || 'Login failed. Please try again!' };
    }
  }

  public static async register(dataRegister: dataRegister): Promise<IAuthResponse | null> {
    const validatePassword = ValidateAuth.validatePassword(dataRegister.password);
    if (validatePassword != '') {
      showErrorAndEditText('register-password', validatePassword);
      return null;
    }

    clearError('register-password');

    const result = await UserModel.register(dataRegister);

    if (result.success) {
      Router.getInstance().navigateTo('/login');
      return { success: true, message: 'Registration successful' };
    }

    return { success: false, message: result.message || 'Registration failed. Please try again!' };
  }
}
