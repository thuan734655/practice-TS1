import { BasePage } from './basePage';
import { IcEmail, IcEye, IcKeySquare, IcSaly } from '../../resources/assets/icons';
import { dataRegister } from '../../types/authTypes.ts';
import UserController from '../../controllers/userController';
import { Toast } from '@/utils/toast.ts';
import Header from '../components/Header.ts';

export class LoginPage extends BasePage {
  constructor() {
    super();
  }

  public  renderContent(): string {
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
          <input type="email" id="register_email" placeholder="Email" required>
          <p id="error-register-email" class="error-message">Invalid email format</p>
          <input type="password" id="register_password" placeholder="Password" required>
          <p id="error-register-password" class="error-message">Password must be at least 6 characters</p>
          <input type="text" id="full-name" placeholder="Full Name" required>
          <p id="error-register-name" class="error-message">Name is </p>
          <button class="submit-register">Register</button>
        </form>
        <div class="footer">Already have an account? <span class="back-to-login">Log in</span></div>
      </div>
    </div>
  `;
}

  public afterRender(): void {
    this.attachLoginEventListener();
    this.attachRegisterPopupEvents();
  }

  private attachLoginEventListener(): void {
    const loginButton = document.querySelector('.btn-login');
    const eyeIcon = document.querySelector('.icon-eye');
    const passwordInput = document.querySelector('.input-password');
    const emailInput = document.querySelector('.input-email');

  
    if (loginButton && eyeIcon && passwordInput && emailInput && passwordInput) {
      loginButton.addEventListener('click', async () => {
          const email = (emailInput as HTMLInputElement).value; ;
          const password = (passwordInput as HTMLInputElement).value;
  
          this.login(email,password);
      });

      eyeIcon.addEventListener('click', () => {
        const isPasswordVisible = (passwordInput as HTMLInputElement).type === 'text';
        (passwordInput as HTMLInputElement).type = isPasswordVisible ? 'password' : 'text';
      });
    }

  }
  
  

  private attachRegisterPopupEvents(): void {
    const registerLink = document.querySelector('.right-box--footer span');
    const popup = document.querySelector('.register-popup');
    const closeButton = document.querySelector('.close-button');
    const backToLogin = document.querySelector('.back-to-login');
    const registerForm = document.querySelector('#registerForm');
    const input_email = document.querySelector('#register_email');
    const input_pass = document.querySelector('#register_password');
    const input_name = document.querySelector('#full-name') 

    if(registerForm && popup && registerLink && closeButton && backToLogin ) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (input_email as HTMLInputElement).value;
        const password = (input_pass  as HTMLInputElement).value;
        const name = (input_name  as HTMLInputElement).value;
        this.register(email, password, name);
      })

      registerLink.addEventListener('click', () => {
        popup.classList.remove('hidden');
      });

      closeButton.addEventListener('click', () => {
        popup.classList.add('hidden');
      });

      backToLogin.addEventListener('click', () => {
        popup.classList.add('hidden');
      });
    }
  }

  private async login(email:string, password: string): Promise<void> {
      const dataLogin = { email: email, password: password };
      const result = await UserController.login(dataLogin);
      if(result.success) {
        Toast.showSuccess("Login Success");
      }
      else {
        Toast.showError(result.message);
      }
  }
  private async register(email:string,password: string,name:string): Promise<void> {
     const dataRegister : dataRegister = { email: email , password: password, name: name};
    const result =  await UserController.register(dataRegister);
    if(result.success) {
      Toast.showSuccess("Login Success");
    }
    else {
      Toast.showError(result.message);
    }
  }
}
