import { BasePage } from './basePage';
import Header from '../components/Header';
import movieController from '../../controllers/mediaController';
import { IMedia } from '../../models/mediaForm';
import LoadMovies from '../components/ListMovie';
import { ICSearch } from '../../resources/assets/icons';
import pagination from '../components/Pagination';
import { ContentRender } from '@/types/general';

export class MoviePage extends BasePage {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      media: [],
      mediaSearch: [],
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: 0,
    };
  }

  public async renderContent(content:ContentRender): Promise<string> {
    this.setState({ media: content.mediaRes, totalItems: content.totalItems});
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
        <p class="section-main--desc-subNav quantity-videos">
        <span>${this.getState("totalItems")} items</span>
        </p>
        <div class="section-main--list-movies" id="movieList">
          ${LoadMovies.render(this.getState("media"))}
        </div>
        <div class="pagination"></div>
      </div>
    `;
  }

  protected attachEventListeners(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.event();
    pagination.render(this.state);
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
        const currentPage = this.getState("currentPage");
        console.log(currentPage);
        if (page !== currentPage) {
          document.querySelectorAll('.pagination-btn').forEach((btn) => {
            btn.classList.remove('active');
          });
          target.classList.add('active');
          this.setState({currentPage: page});
          this.updateFilteredContent();
        }
      }
    });
  }

    private async updateFilteredContent(): Promise<void> {
      await this.fetchMedia();
      pagination.render(this.state);
      this.renderMovieList();
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


  private async fetchMedia(): Promise<void> {
    try {

      const response = await movieController.getMoviesByFilter('movies',this.getState("currentPage"), this.getState("itemsPerPage"));

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
  private scrollToTop(): void {
    document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}
