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
import { Toast } from '@/utils/toast';
import { RenderPaginationData } from '@/types/componentTypes';
import { scrollToTop } from '@/utils/scrollToTop';
import { fieldConfigMovies, fieldConfigsUpdateAndTVShow } from '@/constants/formFieldConfig';

export class AddPage extends BasePage {
  constructor() {
    super();
    this.setState<boolean>('isFormVisible', true);
    this.setState<number>('currentPage', 1);
    this.setState<number>('itemsPerPage', 8);
    this.setState<boolean>('isSearch', true);
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia[]>('media', content.mediaRes as IMedia[]);
    this.setState<number>('totalItems', content.totalItems as number);
    this.setState<string>('author', content.author as string);
    console.log(this.getState<number>('totalItems'));

    console.log(content.mediaRes);
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
        ${AddForm.render(fieldConfigsUpdateAndTVShow)}
        </section>

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
    if (totalItems && currentPage) {
      const itemsPerPage = 8;
      const statePagination: RenderPaginationData = {
        totalItems,
        itemsPerPage,
        currentPage,
      };
      Pagination.render(statePagination);
    }
  }
  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');
    if (isSearch) {
      const mediaSearch = this.getState<IMedia[]>('searchContent');
      if (listMoviesElement) {
        listMoviesElement.innerHTML = mediaSearch ? LoadMovies.render(mediaSearch) : "<p class = 'empty'>Empty</p>";
        LoadMovies.attachEventListener();
        this.attachDeleteEventListener();
        scrollToTop();
        Pagination.isVisiblePagination(false);
      }
    } else {
      const media = this.getState<IMedia[]>('media');
      console.log(media, listMoviesElement);
      if (listMoviesElement && media) {
        listMoviesElement.innerHTML = media ? LoadMovies.render(media) : "<p class = 'empty'>Empty</p>";
        LoadMovies.attachEventListener();
        this.attachDeleteEventListener();
        scrollToTop();
        Pagination.isVisiblePagination(true);
      }
    }
  }
  public afterRender(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    this.attachSubmitEventListener();
    this.attachCloseFormEventListener();
    this.attachAddNewItemEventListener();
    this.renderPagination();
    LoadMovies.attachEventListener();
    this.attachDeleteEventListener();
    this.attachChangeTypeMediaEventListener();
  }
  private attachChangeTypeMediaEventListener(): void {
    const mediaTypeSelect = document.getElementById('media-type');
    const formAddElement = document.querySelector('.form-add');
    if (mediaTypeSelect && formAddElement) {
      mediaTypeSelect.addEventListener('change', () => {
        const mediaType = (mediaTypeSelect as HTMLSelectElement).value;
        mediaType === 'Movie' ? (formAddElement.innerHTML = AddForm.render(fieldConfigMovies)) : (formAddElement.innerHTML = AddForm.render(fieldConfigsUpdateAndTVShow));

        this.attachSubmitEventListener();
        this.attachCloseFormEventListener();
      });
    }
  }
  public attachDeleteEventListener(): void {
    const movieContainers = document.querySelectorAll('.list-movies-container');

    movieContainers.forEach(container => {
      const deleteButton = container.querySelector('.btn-delete');
      const media = this.getState<IMedia[]>('media');

      if (deleteButton && media) {
        deleteButton.addEventListener('click', async () => {
          const mediaId = deleteButton.getAttribute('data-id');
          if (!mediaId) return;

          const result: boolean = await mediaController.deleteMovie(parseInt(mediaId, 10));
          if (result) {
            container.remove(); // update view
            // update state
            this.setState<IMedia[]>(
              'media',
              media.filter(item => {
                console.log(item.id, mediaId);
                return item.id != parseInt(mediaId, 10);
              })
            );

            Toast.showSuccess('Media has been deleted successfully');
          } else {
            Toast.showError('Failed to delete media');
          }
        });
      }
    });
  }

  public attachSubmitEventListener(): void {
    const form = document.getElementById('add-media-form') as HTMLFormElement;

    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = buildFormData(form);
        const newMediaRes = await mediaController.addMovie(formData);

        if (newMediaRes != null) {
          this.setState<boolean>('isFormVisible', false);
          this.onAddMedia(newMediaRes);
          this.toggleFormVisibility();
          form.reset();
        }
      });
    }
  }

  public attachCloseFormEventListener(): void {
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
      const currentPage = this.getState<number>('currentPage');

      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);

        if (page !== currentPage && currentPage != null) {
          paginationElement.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.classList.remove('active');
          });

          target.classList.add('active');
          this.setState<number>('currentPage', page);

          this.updateContentPagination();
        }
      }
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
      updateSearchState(searchInput.value.trim() !== '');
    });

    searchButton.addEventListener('click', async () => {
      const isSearching = this.getState<boolean>('isSearch');

      if (isSearching) {
        this.updateSearchContent(searchInput.value.trim());
        updateSearchState(false);
      } else {
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
    const media = this.getState<IMedia[]>('media');
    const itemsPerPage = this.getState<number>('itemsPerPage');
    if (media != null && itemsPerPage != null) {
      const updatedMedia = media ? [newMedia, ...media] : [newMedia];

      if (updatedMedia.length > itemsPerPage) {
        updatedMedia.pop();
      }

      this.setState<IMedia[]>('media', updatedMedia);
      this.renderMovieList();
    }
  }

  private async fetchMedia(): Promise<void> {
    const author = this.getState<string>('author');
    const currentPage = this.getState<number>('currentPage');
    const itemsPerPage = this.getState<number>('itemsPerPage');

    if (!author || !currentPage || !itemsPerPage) {
      Toast.showError('Error occurred while performing this action!');
    } else {
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
  }

  private toggleFormVisibility(): void {
    const isFormVisible = this.getState<boolean>('isFormVisible');
    if (isFormVisible != null) {
      this.setState<boolean>('isFormVisible', isFormVisible);
      const formSection = document.querySelector('.form-add') as HTMLElement;
      if (formSection) {
        formSection.style.display = isFormVisible ? 'block' : 'none';

        this.setState<boolean>('isFormVisible', !isFormVisible);
      }
    }
  }
}
