import { BasePage } from './basePage';
import headerLogin from '../components/HeaderLogin';
import { IcEmail, IcEye, IcKeySquare, IcSaly } from '../../resources/assets/icons';
import { dataLogin, dataRegister } from '../../types/login';
import UserController from '../../controllers/userController';
export class LoginPage extends BasePage {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      name: ""
    };
  }

  public async renderContent(): Promise<string> {
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
              </div>
              <div class="input-login">
                <img class="icon-key" src="${IcKeySquare}" alt="icon key">
                <input class="input-password" type="password" placeholder="Password" required>
                <img select="false" class="icon-eye" src="${IcEye}" alt="icon eye">
              </div>
              <button class="btn-login" type="button">Login</button>
              <div id="errorMessages" style="color: red;">${this.state.errorMessage}</div>
            </div>   
            <div class="right-box--footer">
              <p class="register">If you don't have an account yet, please <span>register</span>.</p>
            </div>   
          </div>
        </div>
      </section>
      
      <!-- Register Popup -->
      <div class="register-popup hidden">
        <div class="register-container">
          <p class="close-button">X</p>
          <h1>Register</h1>
          <form id="registerForm">
            <input type="email" id="register_email" placeholder="Email" required>
            <input type="password" id="register_password" placeholder="Password" required>
            <input type="text" id="full-name" placeholder="Full Name" required>
            <button class="submit-register" >Register</button>
          </form>
          <div id="errorMessage" class="error-message"></div>
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
    if (loginButton) {
      loginButton.addEventListener('click', async () => {
        const emailInput = document.querySelector('.input-email') as HTMLInputElement;
        const passwordInput = document.querySelector('.input-password') as HTMLInputElement;

        if (emailInput && passwordInput) {
          const email = emailInput.value;
          const password = passwordInput.value;

          // Update state with the values
          this.setState({ email, password });

          this.login();
        }
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
        this.setState({email,password,name});
        this.register();
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

  private async login(): Promise<void> {
    try {
      const dataLogin: dataLogin = { email: this.getState("email"), password: this.getState("password") };
      await UserController.login(dataLogin);
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ errorMessage: 'An error occurred during login. Please try again.' });
    }
  }
  private async register(): Promise<void> {
    try {
      const dataRegister : dataRegister = { email: this.getState("email"), password: this.getState("password"), name: this.getState("name") };
      await UserController.register(dataRegister);
      
    } catch (error) {
      console.error('Register failed:', error);
      this.setState({ errorMessage: 'An error occurred during registration. Please try again.' });   
    }
  }
}
