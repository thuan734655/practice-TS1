import { BasePage } from './BasePage';
import headerLogin from '../components/HeaderLogin';
import { IcEmail, IcEye, IcKeySquare,IcSaly } from '../../resources/assets/icons';
import { dataLogin } from '../../types/login';
import UserController from '@/controllers/userController';

export class LoginPage extends BasePage  {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  protected async renderContent(): Promise<string> {
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
      <section class="section-main-register"></section>
    `;
  }

  protected async updateView(): Promise<void> {
    const rootElement = document.querySelector('#rootLogin');
    if (rootElement) {
      try {
        rootElement.innerHTML = await this.render();
        this.afterRender();
      } catch (error) {
        console.error('Error updating login view:', error);
        rootElement.innerHTML = this.renderError();
      }
    }
  }

  public afterRender(): void {
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    this.attachLoginEventListener();
  }

  private attachLoginEventListener(): void {
    const loginButton = document.querySelector('.btn-login') as HTMLButtonElement;
    const section = document.querySelector('.section-main-login');
    if (loginButton && section) {
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

  private async login(): Promise<void> {
    try {
      const dataLogin: dataLogin = {email: this.state.email, password: this.state.password};
      await UserController.login(dataLogin);
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ errorMessage: 'An error occurred during login. Please try again.' });
    }
  }
}
