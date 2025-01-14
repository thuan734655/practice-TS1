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
  mediaSearch: IMedia[];
  itemsPerPage: number;
  currentPage: number;
  pageMovies: number;
  pageTvShow: number;
  totalItems: number;
}

export class HomePage extends BasePage {
  constructor() {
    super();
    this.state = {
      currentFilter: 'all',
      searchQuery: '',
      media: [],
      mediaSearch:[],
      itemsPerPage: 8,
      currentPage: 1,
      pageMovies: 1,
      pageTvShow: 1,
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
        ${this.renderSearchBox()}
        ${this.renderFilterButtons()}
        <p class="section-main--desc-subNav quantity-videos">
          ${this.state.currentFilter.toUpperCase()} <span>(${this.state.totalItems})</span>
        </p>
        <div class="section-main--list-movies" id="movieList">
          ${LoadMovies(this.state.media)}
        </div>
        <div class="pagination">
      </div>
      </div>
    `;
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
              <button id="${filter}" class="subNav-container--btn-${filter} ${this.state.currentFilter === filter ? 'button-active' : ''}">
                ${filter === 'tv-shows' ? 'TV Shows' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  private async fetchMedia(filter?: 'all' | 'movies' | 'tv-shows'): Promise<void> {
    try {
      const page = filter === 'movies' ? this.state.pageMovies : 
                  filter === 'tv-shows' ? this.state.pageTvShow : 
                  this.state.currentPage; 

      const response = filter !== undefined 
        ? await movieController.getMoviesByFilter(filter, page, this.state.itemsPerPage)
        : await movieController.getMovies(page, this.state.itemsPerPage);

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

  private renderPagination(): void {
    const paginationElement = document.querySelector('.pagination');
    const totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);
  
    const createPageButton = (pageNum: number): string => `
      <button class="pagination-btn ${pageNum === this.state.currentPage ? 'active' : ''}" data-page="${pageNum}">
        ${pageNum}
      </button>
    `;

    const startPage = Math.max(1, this.state.currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (totalPages <= 1) {
      if (paginationElement) {
        paginationElement.innerHTML = ""; 
      }
    } else {
      if (paginationElement) {
        const paginationContent = `${Array.from({ length: endPage - startPage + 1 }, (_, i) => createPageButton(startPage + i)).join('')}`;
        paginationElement.innerHTML = paginationContent; 
      }
    }
  }

  private attachEventListeners(): void {
    this.attachFilterEventListeners();
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    this.renderPagination();
  }

  private attachFilterEventListeners(): void {
    const filters: ('all' | 'movies' | 'tv-shows')[] = ['all', 'movies', 'tv-shows'];
    filters.forEach((filter) => {
      const button = document.getElementById(filter);
      if (button) {
        button.addEventListener('click', async () => {
          if (this.state.currentFilter !== filter) {
            this.updateActiveFilterButton(filter);
            await this.updateFilteredContent(filter); 
            this.renderPagination();
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
        if(query === "") {
          this.renderMovieList();
        }else {
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
  
        if (page !== this.state.currentPage) {
          document.querySelectorAll('.pagination-btn').forEach((btn) => {
            btn.classList.remove('active');
          });
  
          target.classList.add('active');
          this.setState({ currentPage: page });
          this.updateFilteredContent(this.state.currentFilter === 'all' ? undefined : this.state.currentFilter);
        }
      }
    });
  }

  private updateActiveFilterButton(filter: 'all' | 'movies' | 'tv-shows'): void {
    document.querySelectorAll('.subNav-container button').forEach((btn) => btn.classList.remove('button-active'));
    const button = document.getElementById(filter);
    button?.classList.add('button-active');
    this.setState({ currentFilter: filter });
  }

  private async updateFilteredContent(filter: 'all' | 'movies' | 'tv-shows'): Promise<void> {
    if (filter === 'all') {
      await this.fetchMedia();
    } else {
      await this.fetchMedia(filter);
    }
    this.renderPagination();
    this.renderMovieList();
    this.updateQuantityVideos();
  }

  private async updateSearchContent(query: string): Promise<void> {
    try {
      const searchContent = await movieController.searchMovies(query);
      const filteredContent = searchContent.filter((item) => item.type === this.state.currentFilter || this.state.currentFilter === 'all');
      this.setState({ mediaSearch: filteredContent, totalItems: filteredContent.length });
      this.renderMovieList(true);
    } catch (error) {
      console.error('Error during search:', error);
      this.setState({ media: [] });
    }
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');
    if(isSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies(this.state.mediaSearch);
        this.scrollToTop();
      }
    } else {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies(this.state.media);
        this.scrollToTop();
      }
    }
  }

  private updateQuantityVideos(): void {
    const quantityVideosElement = document.querySelector('.quantity-videos');
    if (quantityVideosElement) {
      quantityVideosElement.innerHTML = `${this.state.currentFilter.toUpperCase()} <span>(${this.state.totalItems})</span>`;
    }
  }

  private scrollToTop(): void {
    document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}
