import header from '../components/Header';
import { ContentRender } from "@/types/basePageTypes";
import { BasePage } from "./basePage";
import { IcStar } from '../../resources/assets/icons';
import { IMedia } from '@/types/mediaForm';
import { BASE_URL } from '@/constants/baseURL';
import BoxMovie from '../components/BoxMovie';
import BoxTVShow from '../components/BoxTVShow';

class TvShowsDetailsPage extends BasePage {
  constructor() {
    super();
  }

  public  renderContent(content: ContentRender): string {
    this.setState<IMedia>("mediaRes", content.mediaRes as IMedia);
    this.setState<number>("idMedia", content.idMedia as number );
   
    return `
      ${header.render()}
     <section class="section-main-tvshow"  id= "rootApp"> 
       <div class="section-main-tvshow__container">
        <div class="section-main-tvshow__container--top">
        <div class="top-container">
           <figure>
           <img src="${BASE_URL}${this.getState<IMedia>("mediaRes")?.background ?? ""}" alt="background">
           </figure>
         <div class="top-detail">
          <div class="top-detail-container">
           <div class="top-detail-container--nav">
            <a class="nav-MaileHereko link" href="/home">MaileHereko</a>
            <p>/</p>
            <a class="nav-TVShows link" href="/tvshows">TV Shows</a>
           </div> 
           <div class="top-detail-container--name-movie">${this.getState<IMedia>("mediaRes")?.movie_name ?? "" }</div>
          </div>
         </div> <!-- end top-detail --> 
        </div>
        </div> <!-- end section-main__container--top --> 
        <div class="section-main-tvshow__container--bottom">
        <div class="bottom-container">
         <div class="bottom-container--left">
        <figure>
           <img src="${BASE_URL}${this.getState<IMedia>("mediaRes")?.avatar ?? ""}" alt="Avatar">
        </figure>
         </div>
         <div class="bottom-container--right">
          <div class="right--head">
           <p class="head--title">${this.getState<IMedia>("mediaRes")?.title ?? "" }</p>
           <p class="head--desc">${this.getState<IMedia>("mediaRes")?.description ?? ""}</p>
           <figure>
           <img src="${IcStar}" alt="Star">
           <figcaption>
           ${this.getState<IMedia>("mediaRes")?.rating ?? "" }
           </figcaption>
           </figure>
           </div> <!-- end right--head --> 
          <div class="right--body">
           ${this.TvShowOrMovie()}
          </div>
         </div>
        </div>
        </div><!-- end section-main-tvshow__container--bottom -->
       </div> 
      </section>
    `;
  }

  public afterRender(): void {
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
  public TvShowOrMovie(): string {
    const media = this.getState<IMedia>("mediaRes");
    if(media != null) {
      if ( media.type == "TV Show") {
        return BoxMovie.render(media);
      } else {
        return BoxTVShow.render(media);
      }
    }
    return "";
  }
}

export default TvShowsDetailsPage;
