import { NavChild } from './NavChild';
import { IcLogout, IcLogo } from '../../resources/assets/icons';
import { NavItem } from '../../types/general.js';


export default class Header {
  private readonly listNav: NavItem[] = [
    { text: 'Movies', href: '/movies' },
    { text: 'TV Shows', href: '/tvshows' },
    { text: 'Add', href: '/add' },
  ];

  private readonly listNavIcon: NavItem[] = [
    {
      text: `<figure><img src="${IcLogout}" alt="logout"/><figcaption>Logout</figcaption></figure>`,
      href: '/login'
    },
  ];

  public render(): string {
    
    return `
      <header id="rootApp">
        <div class="header--logo">
          <figure>
            <img class="logo" src="${IcLogo}" alt="logo">
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
