import { BasePage } from './basePage';
import header from '../components/Header.js';
import { IcError } from '../../resources/assets/icons/index.js';
import { Router } from '@/router/router.js';

export class ErrorPage extends BasePage {

  public renderContent(): string {
    return `
      ${header.render()}
      <section class="error-page">
       <div class="error-page__container">
        <div class="error-page__container--head">
         <figure>
          <img src="${IcError}" alt="error image">
         </figure>
        </div>
        <div class="error-page__container--body">
          <p class="body--title">Lost your way?</p>
          <p class="body--desc">Oops! This is awkward. You are looking for something that doesn't actually exist.</p>
          <button class="body--button">Go Home</button>
        </div>
       </div>
      </section>
    `;
  }

  public afterRender(): void {
    this.attachEventListeners();
  }

  protected attachEventListeners(): void {
    document
      .querySelector('.body--button')
      ?.addEventListener('click', () => {
        Router.getInstance().navigateTo('/home')
      });
  }
}
