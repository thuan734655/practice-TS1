import { BasePage } from './BasePage';
import Header from '../components/Header';
import movieController from '../../controllers/mediaController';
import { IMedia } from '../../models/mediaForm';
import LoadMovies from '../components/ListMovie';
import { ICSearch } from '../../resources/assets/icons';

interface IHomePageState {
  currentFilter: 'all' | 'movies' | 'tv-shows';
  searchQuery: string;
  media: IMedia[];
  itemsPerPage: number;
  currentPage: number;

}

export class HomePage extends BasePage {
  private isEventListenersAttached = false;

  constructor() {
    super();
    this.state = {
      currentFilter: 'all',
      searchQuery: '',
      media: [], 
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: 0,
    };
  }

  protected async renderContent(): Promise<string> {
    if (!this.state.totalItems) {
      await this.fetchMedia();
    }
    return `
      ${new Header().render()}
      <div class="home-page" id="rootApp">
        <div class="section-main--title">
          <h3>MaileHereko</h3>
        </div>
        <div class="section-main--desc">
          <p>List of movies and TV Shows I have watched to date.<br>Explore what I have watched and also feel free to make a suggestion. 😉</p>
        </div>
        <div class="section-main--search">
          <div class="search-container">
            <input id="searchInput" class="search-container--input" type="text" placeholder="Search Movies or TV Shows">
            <img class="search-container--icon" src="${ICSearch}" alt="icon search">
          </div>
        </div>

        ${this.renderFilterButtons()}
        <p class="section-main--desc-subNav quantity-videos">
          ${this.state.currentFilter.toUpperCase()} <span>(${this.state.totalItems})</span>
        </p>
        <div class="section-main--list-movies" id="movieList">
        ${LoadMovies(this.state.media)}
        </div>
        
      ${this.renderPagination()}
      </div>
    `;
  }

  private renderFilterButtons(): string {
    const filters: ('all' | 'movies' | 'tv-shows')[] = ['all', 'movies', 'tv-shows'];
    return `
      <div class="section-main--subNav">
        <div class="subNav-container">
          ${filters
            .map(
              (filter) => `
              <button id="${filter}" class="subNav-container--btn-${filter} ${this.state.currentFilter === filter ? 'button-active' : ''}">
                ${filter === 'tv-shows' ? 'TV Shows' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  private async fetchMedia(filter?: string): Promise<void> {
    try {
      const response = filter
        ? await movieController.getMoviesByFilter(filter,this.state.currentPage,this.state.itemsPerPage)
        : await movieController.getMovies(this.state.currentPage,this.state.itemsPerPage);

      const  mediaRes:IMedia[] = response.data;
      const totalItemsRes = response.totalItems;
      if (Array.isArray(mediaRes)) {
        this.setState({ media: mediaRes, totalItems: totalItemsRes || 0});
      } else {
        console.error('Unexpected response format:', mediaRes);
        this.setState({ media: []});
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ media: []});
    }
  }

  private async renderMovieList(): Promise<string> {
    if (!this.state.media) {
      return `<p class="no-movies">No movies or TV shows found.</p>`;
    }
   await this.fetchMedia();
    return `
      ${LoadMovies(this.state.media)}
    `;
  }

  private renderPagination(): string {
    const currentPage = this.state.currentPage;
    const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage );
    if (totalPages <= 1) return '';

    const createPageButton = (pageNum: number, label: string = pageNum.toString()): string => `
      <button class="pagination-btn ${pageNum === currentPage ? 'active' : ''}" data-page="${pageNum}">
        ${label}
      </button>
    `;

    let paginationHtml = '<div class="pagination">';
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += createPageButton(i);
    }

    paginationHtml += '</div>';
    return paginationHtml;
  }

  private attachEventListeners(): void {
    if (this.isEventListenersAttached) return;

    const filters: ('all' | 'movies' | 'tv-shows')[] = ['all', 'movies', 'tv-shows'];
    filters.forEach((filter) => {
      const button = document.getElementById(filter);
      if (button) {
        button.addEventListener('click', async () => {
          if (this.state.currentFilter !== filter) {
            this.setState({ currentFilter: filter });
            await this.fetchMedia(filter === 'all' ? undefined : filter);
            this.updateFilteredContent();
          }
        });
      }
    });

    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        this.setState({ searchQuery: query });
        this.updateFilteredContent();
      });
    }

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);
        if (page !== this.state.currentPage) {
          this.setState({ currentPage: page });
          this.updateFilteredContent();
          document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    this.isEventListenersAttached = true;
  }

  private  async updateFilteredContent(): Promise<void> {
    const listMoviesElement = document.querySelector('.section-main--list-movies');

    if (listMoviesElement) {
      const html =  await this.renderMovieList();
      listMoviesElement.innerHTML = html;
     console.log(listMoviesElement);
    }
  }
}