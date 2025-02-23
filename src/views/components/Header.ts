import { NavChild } from './NavChild';
import { IcLogo, IcLogout } from '../../resources/assets/icons/index.js';
import { getDataLocalStorage } from '@/utils/localStorage.js';
import { NavItem } from '@/types/componentTypes.js';

export default class Header {
  static listNav: NavItem[] = [
    { text: 'Home', href: '/home' },
    { text: 'Movies', href: '/movies' },
    { text: 'TV Shows', href: '/tvshows' },
    { text: 'Add', href: `/add/${getDataLocalStorage('name')}` },
  ];

  static listNavIcon: NavItem[] = [
    {
      text: `<figure><img src="${IcLogout}" alt="logout"/><figcaption>Logout</figcaption></figure>`,
      href: '/login',
    },
  ];
  public static render(): string {
    const hrefAdd = this.listNav.find(nav => nav.text == 'Add');
    if (hrefAdd) {
      hrefAdd.href = `/add/${getDataLocalStorage('name')}`;
    }
    return `
      <header id="rootApp">
        <div class="header--logo">
          <figure>
            <a href="/home"> <img class="logo" src="${IcLogo}" alt="logo"> </a>
          </figure>
        </div>
        <div class="header--nav">
          <ul>${NavChild.render(this.listNav)}</ul>
          <ul>${NavChild.render(this.listNavIcon)}</ul>
        </div>
      </header>
    `;
  }
}
