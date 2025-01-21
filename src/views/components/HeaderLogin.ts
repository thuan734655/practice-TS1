import { IcLogo, IcLogout } from '../../resources/assets/icons/index.js';
import {NavChild} from './NavChild.js';
import { NavItem } from '../../types/general.js';

const listNav: NavItem[] = [
  { text: 'Dashboard', href: '/dashboard' },
  { text: 'Suggestions', href: '/suggestions' },
  { text: 'Add', href: '/add' },
];

const listNavIcon: NavItem[] = [
  {
    text: `<figure> <img src="${IcLogout}" alt="Logout"> <figcaption>Logout</figcaption> </figure>`,
    href: '/login',
  },
];

const headerLogin = (): string => {
  return `
  <div class="header-login">
      <div class="header-login--logo logo">
          <figure>
              <img src="${IcLogo}" alt="logo">
          </figure>
      </div>
      <div class="header-login--nav">
         <ul> ${NavChild.render(listNav)} </ul>
         <ul>  ${NavChild.render(listNavIcon)} </ul>
      </div>
  </div>
  `;
};

export default headerLogin;
