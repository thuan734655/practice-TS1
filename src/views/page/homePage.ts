import { BasePage } from './basePage';
import Header from '../components/Header';
import LoadMovies from '../components/ListMovie';
import { ContentRender } from '@/types/basePageTypes';
import { IMedia } from '@/types/mediaForm';
import { Toast } from '@/utils/toast';
import { RenderPaginationData } from '@/types/componentTypes';
import Pagination from '../components/Pagination';
import { scrollToTop } from '@/utils/scrollToTop';
import SearchComponent from '../components/Search';
import mediaController from '../../controllers/mediaController';
import DeleteMedia from '../components/deleteMedia';

export class HomePage extends BasePage {
  constructor() {
    super();
    this.setState<string>('currentFilter', 'All');
    this.setState<number>('currentPage', 1);
    this.setState<number>('pageMovies', 1);
    this.setState<number>('pageTvShow', 1);
    this.setState<number>('itemsPerPage', 8);
    this.setState<boolean>('isConfirmBoxShow', true);
    this.setState<string>('titleConfirm', 'Are you sure you want to delete?');
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia[]>('media', content.mediaRes as IMedia[]);
    this.setState<number>('totalItems', content.totalItems as number);

    return `
      ${Header.render()}
      <div class="home-page" id="rootApp">
        <div class="section-main--title">
          <h3>MaileHereko</h3>
        </div>
        <div class="section-main--desc">
          <p>List of movies and TV Shows I have watched to date.<br>Explore what I have watched and also feel free to make a suggestion. 😉</p>
        </div>
        ${SearchComponent.render()}
        ${this.renderFilterButtons()}
        <p class="section-main--desc-subNav quantity-videos">
         ${this.renderQuantity()}
        </p>
        <div class="section-main--list-movies" id="movieList">
            ${this.getState<IMedia[]>('media')?.length ? LoadMovies.render(this.getState<IMedia[]>('media')!) : '<p>Empty</p>'}
        </div>
        <div class="pagination"></div>
        <div class="confirm-container"></div>
      </div>
    `;
  }
  private renderQuantity(): string {
    const currentFilter = this.getState<string>('currentFilter') || 'All';
    const totalItems = this.getState<number>('totalItems') || 0;
    return `${currentFilter} <span>(${totalItems})</span>`;
  }

  private renderFilterButtons(): string {
    const filters = ['All', 'Movies', 'TV Show'];
    const currentFilter = this.getState<string>('currentFilter') || 'All';

    return `
    <div class="section-main--subNav">
      <div class="subNav-container">
        ${filters
          .map(
            filter => `
            <button id="${filter}" class="subNav-container--btn-${filter == 'TV Show' ? 'tv-shows' : filter} ${currentFilter === filter ? 'button-active' : ''}">
              ${filter}
            </button>
          `
          )
          .join('')}
      </div>
    </div>
  `;
  }
  private renderPagination(): void {
    const totalItems = this.getState<number>('totalItems');
    const itemsPerPage = this.getState<number>('itemsPerPage');
    const currentPage = this.getPage();
    const pageMovies = this.getState<number>('pageMovies');
    const pageTvShow = this.getState<number>('pageTvShow');
    const currentFilter = this.getState<number>('currentFilter');

    if (totalItems && itemsPerPage && currentFilter && pageMovies && pageTvShow && currentPage) {
      const statePagination: RenderPaginationData = {
        totalItems,
        itemsPerPage,
        currentPage,
        pageMovies,
        pageTvShow,
      };
      Pagination.render(statePagination);
    }
  }
  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');

    if (!listMoviesElement) return;

    if (isSearch) {
      const mediaSearch = this.getState<IMedia[]>('mediaSearch');
      listMoviesElement.innerHTML = mediaSearch.length > 0 ? LoadMovies.render(mediaSearch) : "<p class = 'empty'>Empty</p>";
      Pagination.isVisiblePagination(false);
    } else {
      const media = this.getState<IMedia[]>('media');
      listMoviesElement.innerHTML = media.length > 0 ? LoadMovies.render(media) : "<p class = 'empty'>Empty</p>";
      Pagination.isVisiblePagination(true);
    }
    LoadMovies.attachEventListener();
    scrollToTop();
  }

  public afterRender(): void {
    this.attachFilterEventListeners();
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.attachEventListener();
    this.renderPagination();
    this.attachDeleteEventListener();
  }
  private attachDeleteEventListener(): void {
    // Select the parent container that holds all movie items
    const listMoviesContainer = document.querySelector('.section-main--list-movies');

    if (!listMoviesContainer) return;

    listMoviesContainer.addEventListener('click', async event => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('btn-delete')) {
        const deleteButton = target as HTMLButtonElement;

        // Find the closest movie container
        const container = deleteButton.closest('.list-movies-container') as HTMLElement;
        if (!container) return;

        // Show confirmation box
        const isConfirmBoxVisible = DeleteMedia.toggleConfirmBox(this.getState<boolean>('isConfirmBoxShow'), this.getState<string>('titleConfirm'));
        this.setState<boolean>('isConfirmBoxShow', isConfirmBoxVisible);

        const confirmDelete = await DeleteMedia.confirmAction();
        if (confirmDelete) {
          const mediaAfterDelete = await DeleteMedia.deleteMedia(deleteButton, container, this.getState<IMedia[]>('media'));
          this.setState<IMedia[]>('media', mediaAfterDelete);

          this.setState<number>('totalItems', this.getState<number>('totalItems') - 1);
          this.updateQuantityVideos();
          this.renderPagination();
        }

        // Hide confirmation box after action is completed
        this.setState<boolean>('isConfirmBoxShow', DeleteMedia.toggleConfirmBox(this.getState<boolean>('isConfirmBoxShow')));
      }
    });
  }
  private attachFilterEventListeners(): void {
    document.querySelectorAll('.subNav-container button').forEach(button => {
      button.addEventListener('click', async () => {
        const filter = button.id;
        if (this.getState<string>('currentFilter') !== filter) {
          this.resetSearchInput();
          this.setState<string>('currentFilter', filter);
          this.updateActiveFilterButton();
          this.updateFilteredContent();
        }
      });
    });
  }

  private attachSearchEventListener(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (!searchInput) return;

    let debounceTimer: NodeJS.Timeout;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const query = (e.target as HTMLInputElement).value.trim();
        query ? await this.updateSearchContent(query) : this.renderMovieList();
      }, 400);
    }); 
  }
  private attachPaginationEventListener(): void {
    const paginationElement = document.querySelector('.pagination');

    if (!paginationElement) return;

    paginationElement.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);
        const currentPage = this.getPage();

        if (page !== currentPage) {
          paginationElement.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          target.classList.add('active');
          this.setPage(page);
          this.updateFilteredContent();
        }
      }
    });
  }

  private async fetchMedia(): Promise<void> {
    const filter = this.getState<string>('currentFilter');
    const page = this.getPage();
    const limit = this.getState<number>('itemsPerPage');

    if (filter && page && limit) {
      const response = filter != 'All' ? await mediaController.getMoviesByFilter(filter, { page, limit }) : await mediaController.getMovies({ page, limit });
      const mediaRes = response.data;
      const totalItemsRes = response.totalItems;

      if (mediaRes) {
        this.setState<IMedia[]>('media', mediaRes);
        this.setState<number>('totalItems', totalItemsRes || 0);
      } else {
        Toast.showError('Error occurred while performing this action!');
      }
    } else {
      Toast.showError('Error occurred while performing this action!');
    }
  }

  private updateActiveFilterButton(): void {
    const filter = this.getState<string>('currentFilter');
    if (filter) {
      document.querySelectorAll('.subNav-container button').forEach(btn => btn.classList.remove('button-active'));
      const button = document.getElementById(filter);
      button?.classList.add('button-active');
    }
  }

  private async updateFilteredContent(): Promise<void> {
    await this.fetchMedia();
    this.renderPagination();
    this.renderMovieList();
    this.updateQuantityVideos();
  }

  private async updateSearchContent(query: string): Promise<void> {
    const searchContent = await mediaController.searchMovies(query);

    this.setState<IMedia[]>('mediaSearch', searchContent.data);
    this.setState<number>('totalItems', searchContent?.totalItems || 0);

    this.renderMovieList(true);
  }

  private updateQuantityVideos(): void {
    const quantityVideosElement = document.querySelector('.quantity-videos');
    const currentFilter = this.getState<string>('currentFilter');
    const totalItems = this.getState<number>('totalItems');

    if (quantityVideosElement && currentFilter && totalItems) {
      quantityVideosElement.innerHTML = `${currentFilter} <span>(${totalItems})</span>`;
    }
  }

  private setPage(page: number): void {
    const currentFilter = this.getState<string>('currentFilter');
    if (currentFilter) {
      currentFilter === 'All' ? this.setState<number>('currentPage', page) : currentFilter === 'Movies' ? this.setState<number>('pageMovies', page) : this.setState<number>('pageTvShow', page);
    } else {
      console.error('Error setting page');
    }
  }

  private getPage(): number {
    const currentFilter = this.getState<string>('currentFilter');

    if (currentFilter) {
      if (currentFilter === 'All') {
        const currentPage = this.getState<number>('currentPage');
        return currentPage !== null ? currentPage : 1;
      }

      if (currentFilter === 'Movies') {
        const pageMovies = this.getState<number>('pageMovies');
        return pageMovies !== null ? pageMovies : 1;
      }

      const pageTvShow = this.getState<number>('pageTvShow');
      return pageTvShow !== null ? pageTvShow : 1;
    }
    return 1;
  }
  private resetSearchInput(): void {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      (searchInput as HTMLInputElement).value = '';
    }
  }
}
