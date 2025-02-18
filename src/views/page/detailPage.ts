import header from '../components/Header';
import { ContentRender } from '@/types/basePageTypes';
import { BasePage } from './basePage';
import { IcStar } from '../../resources/assets/icons';
import { IMedia } from '@/types/mediaForm';
import { BASE_URL } from '@/constants/baseURL';
import BoxMovie from '../components/BoxMovie';
import BoxTVShow from '../components/BoxTVShow';
import TruncateText from '@/utils/truncateText';

class TvShowsDetailsPage extends BasePage {
  constructor() {
    super();
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia>('mediaRes', content.mediaRes as IMedia);
    this.setState<number>('idMedia', content.idMedia as number);

    return `
      ${header.render()}
     <section class="section-main-tvshow"  id= "rootApp"> 
       <div class="section-main-tvshow__container">
        <div class="section-main-tvshow__container--top">
        <div class="top-container">
           <figure>
           <img src="${BASE_URL}${(content.mediaRes as IMedia).background}" alt="background">
           </figure>
         <div class="top-detail">
          <div class="top-detail-container">
           <div class="top-detail-container--nav">
            <a class="nav-MaileHereko link" href="/home">MaileHereko</a>
            <p>/</p>
            <a class="nav-TVShows link" href="/tvshows">TV Shows</a>
           </div> 
           <div class="top-detail-container--name-movie">${TruncateText.render((content.mediaRes as IMedia).movie_name, 100,'movie_name')}</div>
          </div>
         </div> <!-- end top-detail --> 
        </div>
        </div> <!-- end section-main__container--top --> 
        <div class="section-main-tvshow__container--bottom">
        <div class="bottom-container">
         <div class="bottom-container--left">
        <figure>
           <img src="${BASE_URL}${(content.mediaRes as IMedia).avatar}" alt="Avatar">
        </figure>
         </div>
         <div class="bottom-container--right">
          <div class="right--head">
           <p class="head--title">${TruncateText.render((content.mediaRes as IMedia).title, 100,'title')}</p>
           <p class="head--desc">${TruncateText.render( (content.mediaRes as IMedia).description, 100,'desc')}</p>
           <figure>
           <img src="${IcStar}" alt="Star">
           <figcaption>
           ${(content.mediaRes as IMedia).rating}
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
       <div class = "box-full-text"></div>
      </section>
    `;
  }

  public afterRender(): void {
    this.attachBoxFullTextEventListeners();
  }
  private attachBoxFullTextEventListeners() {
    const media = this.getState<IMedia>('mediaRes');
    if(media) {
      TruncateText.eventListener(`truncate-text-title`, media.title);
      TruncateText.eventListener(`truncate-text-desc`, media.description);
      TruncateText.eventListener(`truncate-text-movie_name`, media.movie_name);
      TruncateText.eventListener(`truncate-text-geners`, media.genres.join(', '));
    }
  }
  public TvShowOrMovie(): string {
    const media = this.getState<IMedia>('mediaRes');
    if (media != null) {
      return media.type === 'TV Show' ? BoxTVShow.render(media) : BoxMovie.render(media);
    }
    return '';
  }
}

export default TvShowsDetailsPage;
