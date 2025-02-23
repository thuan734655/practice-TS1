import { BasePage } from './basePage.ts';
import { IcEmail, IcEye, IcKeySquare, IcSaly } from '../../resources/assets/icons/index.ts';
import { dataRegister } from '../../types/authTypes.ts.ts';
import AuthController from '@/controllers/authController.ts';
import { Toast } from '@/utils/toast.ts';
import Header from '../components/Header.ts';

export class AuthPage extends BasePage {
  constructor() {
    super();
  }

  public renderContent(): string {
    return `
      ${Header.render()}
      <section class="section-main-login" id="rootLogin">
        <div class="section-main-login__left">
          <div class="left-box">
            <div class="left-box--bgr"></div>
            <div class="left-box--image">
              <img src="${IcSaly}" alt="icon human">
            </div>
          </div>
        </div>
        <div class="section-main-login__right">
          <div class="right-box">
            <div class="right-box--head">
              <p>Login</p>
            </div>
            <div class="right-box--body">
              <div class="input-login">
                <img src="${IcEmail}" alt="icon email">
                <input class="input-email" type="email" placeholder="Email" required>
                <p id="error-email" class="error-message">Invalid email format</p> 
              </div>
              <div class="input-login">
                <img class="icon-key" src="${IcKeySquare}" alt="icon key">
                <input class="input-password" type="password" placeholder="Password" required>
                <p id="error-password" class="error-message">Password must be at least 6 characters</p> 
                <img select="false" class="icon-eye" src="${IcEye}" alt="icon eye">
              </div>
              <button class="btn-login" type="button">Login</button>
            </div>
            <div class="right-box--footer">
              <p class="register">If you don't have an account yet, please <span>register</span>.</p>
            </div>   
          </div>
        </div>
      </section>
      
      <!-- Register  -->
      ${this.RenderRegisterComponent()}
    `;
  }
  private RenderRegisterComponent() {
    return `
    <div class="register-popup hidden">
      <div class="register-container">
        <p class="close-button">X</p>
        <h1>Register</h1>
        <form id="registerForm">

        <div class="register-input-email"> 
          <input type="email" id="register_email" placeholder="Email" required>
          <p id="error-register-email" class="error-message">Invalid email format</p>
        </div>

        <div class="register-input-password"> 
        <input type="password" id="register_password" placeholder="Password" required>
          <img select="false" class="icon-eye register-eyes" src="${IcEye}" alt="icon eye">
          <p id="error-register-password" class="error-message">error</p>
        </div>

        <div class="register-input-name">
         <input type="text" id="full-name" placeholder="Full Name" required>
          <p id="error-register-name" class="error-message">error</p>
        </div>
         
          <button class="submit-register">Register</button>
        </form>
        <div class="footer">Already have an account? <span class="back-to-login">Log in</span></div>
      </div>
    </div>
  `;
  }

  public afterRender(): void {
    this.attachLoginEventListener();
    this.attachRegisterEvents();
  }

  private attachLoginEventListener(): void {
    const loginButton = document.querySelector('.btn-login');
    const eyeIcon = document.querySelector('.icon-eye');
    const passwordInput = document.querySelector('.input-password');
    const emailInput = document.querySelector('.input-email');

    if (loginButton && eyeIcon && passwordInput && emailInput && passwordInput) {
      loginButton.addEventListener('click', async () => {
        const email = (emailInput as HTMLInputElement).value;
        const password = (passwordInput as HTMLInputElement).value;

        this.login(email, password);
      });

      eyeIcon.addEventListener('click', () => {
        const isPasswordVisible = (passwordInput as HTMLInputElement).type === 'text';
        (passwordInput as HTMLInputElement).type = isPasswordVisible ? 'password' : 'text';
      });
    }
  }

  private attachRegisterEvents(): void {
    const registerLink = document.querySelector('.right-box--footer span') as HTMLElement;
    const popup = document.querySelector('.register-popup') as HTMLElement;
    const closeButton = document.querySelector('.close-button') as HTMLElement;
    const backToLogin = document.querySelector('.back-to-login') as HTMLElement;
    const registerForm = document.querySelector('#registerForm') as HTMLElement;
    const input_email = document.querySelector('#register_email') as HTMLInputElement;
    const input_pass = document.querySelector('#register_password') as HTMLInputElement;
    const input_name = document.querySelector('#full-name') as HTMLInputElement;
    const eyeIcon = document.querySelector('.register-eyes') as HTMLElement;

    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = input_email.value;
      const password = input_pass.value;
      const name = input_name.value;
      this.register(email, password, name);
    });

    registerLink.addEventListener('click', () => {
      popup.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    backToLogin.addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    eyeIcon.addEventListener('click', () => {
      const isPasswordVisible = (input_pass).type === 'text';
      (input_pass ).type = isPasswordVisible ? 'password' : 'text';
    });
  }

  private async login(email: string, password: string): Promise<void> {
    const dataLogin = { email: email, password: password };
    const result = await AuthController.login(dataLogin);

    if (result == null) return;

    if (result.success) {
      Toast.showSuccess('Login Success');
    } else {
      Toast.showError(result.message);
    }
  }
  private async register(email: string, password: string, name: string): Promise<void> {
    const dataRegister: dataRegister = { email: email, password: password, name: name };
    const result = await AuthController.register(dataRegister);

    if (result == null) return;

    if (result.success) {
      Toast.showSuccess('Login Success');
    } else {
      Toast.showError(result.message);
    }
  }
}
