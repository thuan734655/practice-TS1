import { BasePage } from './basePage';
import Header from '../components/Header';
import movieController from '../../controllers/mediaController';
import { IMedia } from '../../models/mediaForm';
import LoadMovies from '../components/ListMovie';
import { ICSearch } from '../../resources/assets/icons';
import pagination from '../components/Pagination';
import { ContentRender } from '@/types/general';

export class HomePage extends BasePage {
  constructor() {
    super();
    this.state = {
      currentFilter: 'all',
      searchQuery: '',
      media: [],
      mediaSearch: [],
      itemsPerPage: 8,
      currentPage: 1,
      pageMovies: 1,
      pageTvShow: 1,
      totalItems: 0,
    };
  }

  public async renderContent(content:ContentRender): Promise<string> {
    this.setState({ media: content?.mediaRes, totalItems: content?.totalItems});
    return `
      ${Header.render()}
      <div class="home-page" id="rootApp">
        <div class="section-main--title">
          <h3>MaileHereko</h3>
        </div>
        <div class="section-main--desc">
          <p>List of movies and TV Shows I have watched to date.<br>Explore what I have watched and also feel free to make a suggestion. 😉</p>
        </div>
        ${this.renderSearchBox()}
        ${this.renderFilterButtons()}
        <p class="section-main--desc-subNav quantity-videos">
          ${this.getState("currentFilter").toUpperCase()} <span>(${this.getState("totalItems")})</span>
        </p>
        <div class="section-main--list-movies" id="movieList">
          ${LoadMovies.render(this.getState("media"))}
        </div>
        <div class="pagination"></div>
      </div>
    `;
  }

  protected attachEventListeners(): void {
    this.attachFilterEventListeners();
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.event();
    pagination.render(this.state);
  }

  private attachFilterEventListeners(): void {
    const filters: ('all' | 'movies' | 'tv-shows')[] = ['all', 'movies', 'tv-shows'];
    filters.forEach((filter) => {
      const button = document.getElementById(filter);
      if (button) {
        button.addEventListener('click', async () => {
          if (this.getState("currentFilter") !== filter) {
            this.setState({ currentFilter: filter });
            console.log("Filter", filter);
            this.updateActiveFilterButton();
            await this.updateFilteredContent(); 
            pagination.render(this.state);
          }
        });
      }
    });
  }

  private attachSearchEventListener(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        const query = (e.target as HTMLInputElement).value;
        this.setState({ searchQuery: query });
        if (query === "") {
          this.renderMovieList();
        } else {
          await this.updateSearchContent(query);
        }
      });
    }
  }

  private attachPaginationEventListener(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);
        const currentPage = this.getPage();
        console.log(currentPage);
        if (page !== currentPage) {
          document.querySelectorAll('.pagination-btn').forEach((btn) => {
            btn.classList.remove('active');
          });
          target.classList.add('active');
          this.setPage(page);
          this.updateFilteredContent();
        }
      }
    });
  }

  private renderSearchBox(): string {
    return `
      <div class="section-main--search">
        <div class="search-container">
          <input id="searchInput" class="search-container--input" type="text" placeholder="Search Movies or TV Shows">
          <img class="search-container--icon" src="${ICSearch}" alt="icon search">
        </div>
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
              <button id="${filter}" class="subNav-container--btn-${filter} ${this.getState("currentFilter") === filter ? 'button-active' : ''}">
                ${filter === 'tv-shows' ? 'TV Shows' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  private async fetchMedia(): Promise<void> {
    const filter = this.getState("currentFilter");
    try {
      const page = this.getPage();
      
      const response = filter !== 'all'
        ? await movieController.getMoviesByFilter(filter, page, this.getState("itemsPerPage"))
        : await movieController.getMovies(page, this.getState("itemsPerPage"));

      const mediaRes: IMedia[] = response.data;
      const totalItemsRes = response.totalItems;

      if (Array.isArray(mediaRes)) {
        this.setState({ media: mediaRes, totalItems: totalItemsRes || 0 });
      } else {
        console.error('Unexpected response format:', mediaRes);
        this.setState({ media: [] });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ media: [] });
    }
  }

  private updateActiveFilterButton(): void {
    const filter = this.getState("currentFilter");
    document.querySelectorAll('.subNav-container button').forEach((btn) => btn.classList.remove('button-active'));
    const button = document.getElementById(filter);
    button?.classList.add('button-active');
  }

  private async updateFilteredContent(): Promise<void> {
    await this.fetchMedia();
    pagination.render(this.state);
    this.renderMovieList();
    this.updateQuantityVideos();
  }

  private async updateSearchContent(query: string): Promise<void> {
    try {
      const searchContent = await movieController.searchMovies(query);
      const filteredContent = searchContent.filter((item) => item.type === this.getState("currentFilter") || this.getState("currentFilter") === 'all');
      this.setState({ mediaSearch: filteredContent, totalItems: filteredContent.length });
      this.renderMovieList(true);
    } catch (error) {
      console.error('Error during search:', error);
      this.setState({ media: [] });
    }
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');
    if (isSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies.render(this.getState("mediaSearch"));
        LoadMovies.event();
        this.scrollToTop();
      }
    } else {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies.render(this.getState("media"));
        LoadMovies.event();
        this.scrollToTop();
      }
    }
  }

  private updateQuantityVideos(): void {
    const quantityVideosElement = document.querySelector('.quantity-videos');
    if (quantityVideosElement) {
      quantityVideosElement.innerHTML = `${this.getState("currentFilter").toUpperCase()} <span>(${this.getState("totalItems")})</span>`;
    }
  }

  private setPage(page: number): void {
    const currentFilter = this.getState("currentFilter");
    currentFilter === 'all' 
      ? this.setState({ currentPage: page }) 
      : currentFilter === 'movies' 
      ? this.setState({ pageMovies: page }) 
      : this.setState({ pageTvShow: page });
  }

  private getPage(): number {
    return this.getState("currentFilter") === 'all' 
          ? this.getState("currentPage") 
          : this.getState("currentFilter") === 'movies' 
            ? this.getState("pageMovies") 
            : this.getState("pageTvShow");
  }

  private scrollToTop(): void {
    document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}
