import { BasePage } from './basePage';
import headerLogin from '../components/HeaderLogin';
import { IcEmail, IcEye, IcKeySquare, IcSaly } from '../../resources/assets/icons';
import { dataRegister } from '../../types/authTypes.ts';
import UserController from '../../controllers/userController';
import { RegisterComponent } from '../components/Register';
import { Toast } from '@/utils/toast.ts';

export class LoginPage extends BasePage {
  constructor() {
    super();
  }

  public  renderContent(): string {
    return `
      ${headerLogin()}
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
      ${RegisterComponent()}
    `;
}


  protected attachEventListeners(): void {
    this.attachLoginEventListener();
    this.attachRegisterPopupEvents();
  }

  private attachLoginEventListener(): void {
    const loginButton = document.querySelector('.btn-login') as HTMLButtonElement;
    const eyeIcon = document.querySelector('.icon-eye') as HTMLImageElement;
    const passwordInput = document.querySelector('.input-password') as HTMLInputElement;
  
    if (loginButton) {
      loginButton.addEventListener('click', async () => {
        const emailInput = document.querySelector('.input-email') as HTMLInputElement;
  
        if (emailInput && passwordInput) {
          const email = emailInput.value;
          const password = passwordInput.value;
  
          this.login(email,password);
        }
      });
    }
  
    if (eyeIcon && passwordInput) {
      eyeIcon.addEventListener('click', () => {
        const isPasswordVisible = passwordInput.type === 'text';
        passwordInput.type = isPasswordVisible ? 'password' : 'text';
      });
    }
  }
  
  

  private attachRegisterPopupEvents(): void {
    const registerLink = document.querySelector('.right-box--footer span') as HTMLElement;
    const popup = document.querySelector('.register-popup') as HTMLElement;
    const closeButton = document.querySelector('.close-button') as HTMLElement;
    const backToLogin = document.querySelector('.back-to-login') as HTMLElement;
    const submit_register = document.querySelector('.submit-register') as HTMLInputElement;
    const input_email = document.querySelector('#register_email') as HTMLInputElement;
    const input_pass = document.querySelector('#register_password') as HTMLInputElement;
    const input_name = document.querySelector('#full-name') as HTMLInputElement;


    if(submit_register && popup) {
      submit_register.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = input_email.value;
        const password = input_pass.value;
        const name = input_name.value;
        this.register(email, password, name);
      })
    }

    if (registerLink && popup) {
      registerLink.addEventListener('click', () => {
        popup.classList.remove('hidden');
      });
    }

    if (closeButton && popup) {
      closeButton.addEventListener('click', () => {
        popup.classList.add('hidden');
      });
    }

    if (backToLogin && popup) {
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
      const result = await UserController.register(dataRegister);
      if(result.success) {
        const popup = document.querySelector(".register-popup") as HTMLElement; 
        popup.classList.add('hidden');
        Toast.showSuccess("Register Success");
      }
      else {
        Toast.showError(result.message);
      }
      
  }
}

