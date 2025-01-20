import { NavChild } from './NavChild';
import { ImageComponent } from './Image';

interface NavItem {
  text: string;
  href: string;
}

interface ImageLink {
  srcImg: string;
  caption?: string;
  alt: string;
  link?: string;
}

export class Footer {
  private readonly listTerms: NavItem[] = [
    { text: 'Privacy Policy', href: '/privacy-policy' },
    { text: 'Terms and Conditions', href: '/terms-conditions' },
    { text: 'Cookie Policy', href: '/cookie-policy' },
  ];

  private readonly listFeedback: NavItem[] = [
    { text: 'Cookie Policy', href: '/cookie-policy' },
    { text: 'Feedback', href: '/feedback' },
    { text: 'FAQs', href: '/faqs' },
  ];

  private readonly listAboutUs: NavItem[] = [
    { text: 'Join Us', href: '/join-us' },
    { text: 'Contact Us', href: '/contact-us' },
  ];

  private readonly socialIcons: ImageLink[] = [
    {
      srcImg: 'https://s3.cloudfly.vn/practice-js/images/icons8-fb-48.png',
      alt: 'icon fb',
      link: 'https://www.facebook.com/tnv05',
    },
    {
      srcImg: 'https://s3.cloudfly.vn/practice-js/images/icons8-ig-48.png',
      alt: 'icon ig',
      link: 'https://www.instagram.com/tnv.16.10/',
    },
    {
      srcImg: 'https://s3.cloudfly.vn/practice-js/images/icons8-gmail-48.png',
      alt: 'icon gmail',
      link: 'mailto:vanthuan678310@gmail.com',
    },
  ];

  public render(): string {
    const navChild = new NavChild();
    const imageComponent = new ImageComponent();

    return `
      <footer id="rootApp">
        <div class="footer--head">
          <div class="head-container">
            ${imageComponent.render([{
              srcImg: 'https://s3.cloudfly.vn/practice-js/images/ic-logo.svg',
              caption: 'Movies',
              alt: 'logo',
              link: '/home'
            }], true)}
          </div>
        </div>
        <div class="footer--body">
          <div class="body-container">
            <div class="body-container--listTerms">
              <p>Terms and Conditions</p>
              <ul>${navChild.render(this.listTerms)}</ul>
            </div>
            <div class="body-container--listFeedback">
              <p>Help and feedback</p>
              <ul>${navChild.render(this.listFeedback)}</ul>
            </div>
            <div class="body-container--AboutUs">
              <p>About us</p>
              <ul>${navChild.render(this.listAboutUs)}</ul>
              <div class="AboutUs-icon">
                ${imageComponent.render(this.socialIcons, true)}
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
