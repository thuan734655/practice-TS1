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
    const mediaRes = content.mediaRes as IMedia;
    this.setState<IMedia>('mediaRes', mediaRes);
    this.setState<number>('idMedia', content.idMedia as number);

    return `
      ${header.render()}
     <section class="section-main-tvshow"  id= "rootApp"> 
       <div class="section-main-tvshow__container">
        <div class="section-main-tvshow__container--top">
        <div class="top-container">
           <figure>
           <img src="${BASE_URL}${mediaRes.background}" alt="background">
           </figure>
         <div class="top-detail">
          <div class="top-detail-container">
           <div class="top-detail-container--nav">
            <a class="nav-MaileHereko link" href="/home">MaileHereko</a>
            <p>/</p>
            <a class="nav-TVShows link" href="/tvshows">TV Shows</a>
           </div> 
           <div class="top-detail-container--name-movie">${TruncateText.render(mediaRes.movie_name, 100, 'movie_name')}</div>
          </div>
         </div> <!-- end top-detail --> 
        </div>
        </div> <!-- end section-main__container--top --> 
        <div class="section-main-tvshow__container--bottom">
        <div class="bottom-container">
         <div class="bottom-container--left">
        <figure>
           <img src="${BASE_URL}${mediaRes.avatar}" alt="Avatar">
        </figure>
         </div>
         <div class="bottom-container--right">
          <div class="right--head">
           <p class="head--title">${TruncateText.render(mediaRes.title, 100, 'title')}</p>
           <p class="head--desc">${TruncateText.render(mediaRes.description, 100, 'desc')}</p>
           <figure>
           <img src="${IcStar}" alt="Star">
           <figcaption>
           ${mediaRes.rating}
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
    if (!media) return;

    const truncateFields = [
        { key: 'title', value: media.title },
        { key: 'desc', value: media.description },
        { key: 'movie_name', value: media.movie_name },
        { key: 'Genres', value: media.genres.join(', ') },
        { key: 'Status', value: media.status }
    ];

    truncateFields.forEach(field => {
        TruncateText.eventListener(`truncate-text-${field.key}`, field.value);
    });
}
  public TvShowOrMovie(): string {
    const media = this.getState<IMedia>('mediaRes');
    if (!media) return '';

    return media.type === 'TV Show' ? BoxTVShow.render(media) : BoxMovie.render(media);
}

}

export default TvShowsDetailsPage;
