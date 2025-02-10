import { BasePage } from './basePage';
import headerLogin from '../components/HeaderLogin';
import { IcEmail, IcEye, IcKeySquare, IcSaly } from '../../resources/assets/icons';
import { dataRegister } from '../../types/authTypes.ts';
import UserController from '../../controllers/userController';
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
    const registerForm = document.querySelector('#registerForm') as HTMLFormElement;
    const input_email = document.querySelector('#register_email') as HTMLInputElement;
    const input_pass = document.querySelector('#register_password') as HTMLInputElement;
    const input_name = document.querySelector('#full-name') as HTMLInputElement;

    //submit action
    if(registerForm && popup) {
      registerForm.addEventListener('submit', async (e) => {
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
    try {
      const dataRegister : dataRegister = { email: email , password: password, name: name};
      await UserController.register(dataRegister);
      
    } catch (error) {
      console.error('Register failed:', error);
    }
  }
}

