import header from '../components/Header';
import { ContentRender } from "@/types/general";
import { BasePage } from "./basePage";
import { IcStar } from '../../resources/assets/icons';
import loadBoxTVShow from '../components/BoxTVShow';
import loadBoxMovie from '../components/BoxMovie';

class TvShowsDetailsPage extends BasePage {
  constructor() {
    super();
    this.state = {
      mediaRes: null,
      idMedia: ""
    };
  }

  public async renderContent(content: ContentRender): Promise<string> {
    this.setState({ mediaRes: content?.mediaRes, idMedia: content?.idMedia });
    return `
      ${header.render()}
     <section class="section-main-tvshow"  id= "rootApp"> 
       <div class="section-main-tvshow__container">
        <div class="section-main-tvshow__container--top">
        <div class="top-container">
           <figure>
           <img src="https://practice-ts-server.onrender.com/${this.getState("mediaRes").background}" alt="background">
           </figure>
         <div class="top-detail">
          <div class="top-detail-container">
           <div class="top-detail-container--nav">
            <a class="nav-MaileHereko link" href="/home">MaileHereko</a>
            <p>/</p>
            <a class="nav-TVShows link" href="/tvshows">TV Shows</a>
           </div> 
           <div class="top-detail-container--name-movie">${this.getState("mediaRes").movie_name}</div>
          </div>
         </div> <!-- end top-detail --> 
        </div>
        </div> <!-- end section-main__container--top --> 
        <div class="section-main-tvshow__container--bottom">
        <div class="bottom-container">
         <div class="bottom-container--left">
        <figure>
           <img src="https://practice-ts-server.onrender.com/${this.getState("mediaRes").avatar}" alt="Avatar">
        </figure>
         </div>
         <div class="bottom-container--right">
          <div class="right--head">
           <p class="head--title">${this.getState("mediaRes").title}</p>
           <p class="head--desc">${this.getState("mediaRes").description}</p>
           <figure>
           <img src="${IcStar}" alt="Star">
           <figcaption>
           ${this.getState("mediaRes").rating}
           </figcaption>
           </figure>
           </div> <!-- end right--head --> 
          <div class="right--body">
           ${this.getState("mediaRes").type === 'Movie' ? loadBoxMovie(this.getState("mediaRes")) :loadBoxTVShow(this.getState("mediaRes")) }
          </div>
         </div>
        </div>
        </div><!-- end section-main-tvshow__container--bottom -->
       </div> 
      </section>
    `;
  }

  // Gắn sự kiện vào các phần tử
  protected attachEventListeners(): void {
    const navLinks = document.querySelectorAll('.link');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = (event.target as HTMLElement).getAttribute('data-href');
        if (target) {
          window.location.href = target;
        }
      });
    });
  }

  public afterRender(): void {
    super.afterRender();
    console.log('TvShowsDetailsPage rendered successfully.');
  }
}

export default TvShowsDetailsPage;
