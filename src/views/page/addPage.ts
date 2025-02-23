import { BasePage } from './basePage';
import Header from '../components/Header';
import { ICSearch } from '../../resources/assets/icons';
import LoadMovies from '../components/ListMovie';
import mediaController from '../../controllers/mediaController';
import { IMedia } from '../../types/mediaForm';
import AddForm from '../components/AddForm';
import Pagination from '../components/Pagination';
import { ContentRender } from '@/types/basePageTypes';
import { buildFormData } from '@/helper/formHelper';
import { RenderPaginationData } from '@/types/componentTypes';
import { scrollToTop } from '@/utils/scrollToTop';
import { fieldConfigMovies, fieldConfigsTVShow } from '@/constants/formFieldConfig';
import DeleteMedia from '../components/deleteMedia';

export class AddPage extends BasePage {
  constructor() {
    super();
    this.setState<boolean>('isFormVisible', true);
    this.setState<number>('currentPage', 1);
    this.setState<number>('itemsPerPage', 8);
    this.setState<boolean>('isSearch', true);
    this.setState<boolean>('isConfirmBoxShow', true);
    this.setState<string>('titleConfirm', 'Are you sure you want to delete?');
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia[]>('media', content.mediaRes as IMedia[]);
    this.setState<number>('totalItems', content.totalItems as number);
    this.setState<string>('author', content.author as string);

    return `
    ${Header.render()}
    <section class="section-main" id="rootApp">
      <div class="section-main--title">
        <h3>Add new item</h3>
      </div>
      <div class="section-main__box-search-and-mylist">
        <div class="section-main__box-search-and-mylist--search">
          ${this.renderSearchBox()}
        </div>
        <div class="section-main__box-search-and-mylist--mylist">
          <p id="add-new-item">Add new item</p>
        </div>
      </div>
      <div class="section-main--list-movies">
        ${LoadMovies.render(content.mediaRes as IMedia[])}
      </div>
        <div class="pagination"></div> 
        </section>
        <section class="form-add">
        ${AddForm.render(fieldConfigsTVShow)}
        </section>
        <div class="confirm-container"></div>
        `;
  }
  private renderSearchBox(): string {
    return `
    <div class="search-container">
      <input id="searchInput" class="search-container--input" type="text" placeholder="Search Movies or TV Shows">
      <img class="search-container--icon" src="${ICSearch}" alt="icon search">
    </div>
    <button class ="btn-search">search</button>
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
      const mediaSearch = this.getState<IMedia[]>('searchContent');
      listMoviesElement.innerHTML = mediaSearch ? LoadMovies.render(mediaSearch) : "<p class = 'empty'>Empty</p>";
      Pagination.isVisiblePagination(false);
    } else {
      const media = this.getState<IMedia[]>('media');
      listMoviesElement.innerHTML = media ? LoadMovies.render(media) : "<p class = 'empty'>Empty</p>";
      Pagination.isVisiblePagination(true);
    }

    LoadMovies.attachEventListener();
    scrollToTop();
  }

  public afterRender(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    this.attachSubmitEventListener();
    this.attachCloseFormEventListener();
    this.attachAddNewItemEventListener();
    this.renderPagination();
    this.attachDeleteEventListener();
    this.attachChangeTypeMediaEventListener();
    LoadMovies.attachEventListener();
  }

  private attachChangeTypeMediaEventListener(): void {
    const mediaTypeSelect = document.getElementById('media-type') as HTMLSelectElement;
    const formAddElement = document.querySelector('.form-add') as HTMLSelectElement;

    if (mediaTypeSelect && formAddElement) {
      mediaTypeSelect.addEventListener('change', () => {
        const mediaType = mediaTypeSelect.value;
        mediaType === 'Movie' ? (formAddElement.innerHTML = AddForm.render(fieldConfigMovies)) : (formAddElement.innerHTML = AddForm.render(fieldConfigsTVShow));

        this.attachSubmitEventListener();
        this.attachCloseFormEventListener();
      });
    }
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
        }

        // Hide confirmation box after action is completed
        this.setState<boolean>('isConfirmBoxShow', DeleteMedia.toggleConfirmBox(this.getState<boolean>('isConfirmBoxShow')));
      }
    });
  }

  private attachSubmitEventListener(): void {
    const form = document.getElementById('add-media-form') as HTMLFormElement;

    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = buildFormData(form);
        const newMediaRes = await mediaController.addMovie(formData);

        if (!newMediaRes) return;

        this.setState<boolean>('isFormVisible', false);
        this.onAddMedia(newMediaRes!);
        this.toggleFormVisibility();
        form.reset();
      });
    }
  }

  private attachCloseFormEventListener(): void {
    const closeFormButton = document.getElementById('close-form');

    if (closeFormButton) {
      closeFormButton.addEventListener('click', () => {
        this.toggleFormVisibility();
      });
    }
  }

  private attachPaginationEventListener(): void {
    const paginationElement = document.querySelector('.pagination');
    if (!paginationElement) return;

    paginationElement.addEventListener('click', async e => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('pagination-btn')) return;

      const page = parseInt(target.dataset.page || '1', 10);
      if (page === this.getState<number>('currentPage')) return;

      const activeBtn = paginationElement.querySelector('.pagination-btn.active');
      if (activeBtn) activeBtn.classList.remove('active');

      target.classList.add('active');
      this.setState<number>('currentPage', page);

      this.updateContentPagination();
    });
  }

  private attachSearchEventListener(): void {
    const searchInput = document.querySelector<HTMLInputElement>('#searchInput');
    const searchButton = document.querySelector<HTMLButtonElement>('.btn-search');

    if (!searchInput || !searchButton) return;

    const updateSearchState = (isSearching: boolean) => {
      this.setState<boolean>('isSearch', isSearching);
      searchButton.textContent = isSearching ? 'Search' : 'Cancel';
    };
    searchInput.addEventListener('input', () => {
      updateSearchState(searchInput.value.trim() != '');
    });

    searchButton.addEventListener('click', async () => {
      const isSearching = this.getState<boolean>('isSearch');

      // button: search -> cancel
      if (isSearching) {
        this.updateSearchContent(searchInput.value.trim());
        updateSearchState(false);
      } else { // button: cancel -> search
        searchInput.value = '';
        this.updateSearchContent('');
        updateSearchState(true);
      }
    });
  }

  private attachAddNewItemEventListener(): void {
    const addNewItemButton = document.getElementById('add-new-item');
    if (addNewItemButton) {
      addNewItemButton.addEventListener('click', () => this.toggleFormVisibility());
    }
  }

  private async updateSearchContent(searchQuery: string): Promise<void> {
    if (searchQuery.length > 0) {
      const searchContent = await mediaController.searchMovies(searchQuery);

      this.setState<IMedia[]>('searchContent', searchContent.data);
      this.setState<number>('totalItems', searchContent.totalItems || 0);

      this.renderMovieList(true);
    } else {
      this.setState<IMedia[]>('searchContent', []);
      this.renderMovieList();
    }
  }
  private async updateContentPagination(): Promise<void> {
    await this.fetchMedia();
    this.renderMovieList();
  }

  private onAddMedia(newMedia: IMedia): void {
    const medias = this.getState<IMedia[]>('media');
    const itemsPerPage = this.getState<number>('itemsPerPage');

    const newMediaList = medias ? [newMedia, ...medias] : [newMedia];

    if (newMediaList.length > itemsPerPage) {
      newMediaList.pop();
    }

    this.setState<IMedia[]>('media', newMediaList);
    this.renderMovieList();
  }

  private async fetchMedia(): Promise<void> {
    const author = this.getState<string>('author');
    const currentPage = this.getState<number>('currentPage');
    const itemsPerPage = this.getState<number>('itemsPerPage');

    const response = await mediaController.getMovieByAuthor(author, {
      page: currentPage,
      limit: itemsPerPage,
    });

    const mediaRes: IMedia[] = response.data as IMedia[];
    const totalItemsRes = response.totalItems;

    if (Array.isArray(mediaRes)) {
      this.setState<IMedia[]>('media', mediaRes);
      this.setState<number>('totalItems', totalItemsRes || 0);
    } else {
      console.error('Unexpected response format:', mediaRes);
      this.setState<IMedia[]>('media', []);
    }
  }

  private toggleFormVisibility(): void {
    const isFormVisible = this.getState<boolean>('isFormVisible');

    const formSection = document.querySelector('.form-add') as HTMLElement;
    if (formSection) {
      formSection.style.display = isFormVisible ? 'block' : 'none';

      this.setState<boolean>('isFormVisible', !isFormVisible);
    }
  }
}
