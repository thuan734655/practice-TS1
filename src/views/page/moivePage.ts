import { BasePage } from './basePage';
import Header from '../components/Header';
import LoadMovies from '../components/ListMovie';
import { ContentRender } from '@/types/basePageTypes';
import { IMedia } from '@/types/mediaForm';
import { Toast } from '@/utils/toast';
import Pagination from '../components/Pagination';
import { RenderPaginationData } from '@/types/componentTypes';
import { scrollToTop } from '@/utils/scrollToTop';
import SearchComponent from '../components/Search';
import mediaController from '../../controllers/mediaController';
import DeleteMedia from '../components/deleteMedia';

export class MoviePage extends BasePage {
  constructor() {
    super();
    this.setState<number>('currentPage', 1);
    this.setState<number>('itemsPerPage', 8);
    this.setState<boolean>('isConfirmBoxShow', true);
    this.setState<string>('titleConfirm', 'Are you sure you want to delete?');
  }

  public renderContent(content: ContentRender): string {
    const media = content.mediaRes as IMedia[];
    this.setState<IMedia[]>('media', media);
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
        <p class="section-main--desc-subNav quantity-videos">
        <span>${this.getState('totalItems')} items</span>
        </p>
        <div class="section-main--list-movies" id="movieList">
          ${this.getState<IMedia[]>('media')?.length ? LoadMovies.render(media) : '<p>Empty</p>'}
        </div>
        <div class="pagination"></div>
        <div class="confirm-container"></div>
      </div>
    `;
  }

  private renderPagination(): void {
    const totalItems = this.getState<number>('totalItems');
    const currentPage = this.getState<number>('currentPage');
    const itemsPerPage = this.getState<number>('itemsPerPage');

    const statePagination: RenderPaginationData = {
      totalItems,
      itemsPerPage,
      currentPage,
    };
    Pagination.render(statePagination);
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
    this.attachDeleteEventListener();
    scrollToTop();
  }

  public afterRender(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.attachEventListener();
    this.renderPagination();
    this.attachDeleteEventListener();
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
        const currentPage = this.getState('currentPage');

        if (page !== currentPage) {
          paginationElement.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.classList.remove('active');
          });

          target.classList.add('active');
          this.setState<number>('currentPage', page);
          this.updateFilteredContent();
        }
      }
    });
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

  private async updateFilteredContent(): Promise<void> {
    await this.fetchMedia();
    this.renderPagination();
    this.renderMovieList();
  }

  private async fetchMedia(): Promise<void> {
    const limit = this.getState<number>('itemsPerPage');
    const currentPage = this.getState<number>('currentPage');

    const response = await mediaController.getMoviesByFilter('movie', {
      limit,
      page: currentPage,
    });

    const mediaRes = response.data;
    const totalItemsRes = response.totalItems;

    if (mediaRes) {
      this.setState<IMedia[]>('media', mediaRes);
      this.setState<number>('totalItems', totalItemsRes || 0);
    } else {
      Toast.showError('Error occurred while performing this action!');
    }
  }

  private async updateSearchContent(query: string): Promise<void> {
    const searchContent = await mediaController.searchMovies(query);

    this.setState<IMedia[]>('mediaSearch', searchContent.data);
    this.setState<number>('totalItems', searchContent.data?.length);
    this.renderMovieList(true);
  }

  private updateQuantityVideos(): void {
    const quantityVideosElement = document.querySelector('.quantity-videos') as HTMLElement;
    const totalItems = this.getState<number>('totalItems');

    quantityVideosElement.innerHTML = `<span>${totalItems} items</span>`;
  }
}
