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

export class AddPage extends BasePage {
  constructor() {
    super();
  }

  public  renderContent(content:ContentRender): string {
    this.setState("media", content.mediaRes);
    this.setState("totalItems", content.totalItems);
    this.setState("author", content.author);
    return `
      ${ Header.render()}
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
          ${this.getState<IMedia[]>("media")?.length ? LoadMovies.render(this.getState<IMedia[]>("media")!) : "<p>Empty</p>"}
        </div>
         <div class="pagination"></div> 
      </section>
      <section class="form-add">
      ${AddForm.render()}
      </section>
    `;
  }
  protected attachEventListeners(): void {
    this.attachSearchEventListener(); 
    this.attachPaginationEventListener();  
    this.attachSubmitEventListener();
    this.attachCloseFormEventListener();
    this.attachAddNewItemEventListener();
    Pagination.render(this.state);  
    LoadMovies.event();
  }

  private renderSearchBox(): string {
    return `
      <div class="search-container">
        <input id="searchInput" class="search-container--input" type="text" placeholder="Search Movies or TV Shows">
        <img class="search-container--icon" src="${ICSearch}" alt="icon search">
      </div>
      <button>search</button>
    `;
  }

  private async fetchMedia(): Promise<void> {
      const author = this.getState<string>("author");
      const currentPage = this.getState<number>("currentPage");
      const itemsPerPage = this.getState<number>("itemsPerPage");

      if(!author || !currentPage || !itemsPerPage) {
        Toast.showError("Error occurred while performing this action!")
      } else {
          const response = await mediaController.getMovieByAuthor(author,{ page: currentPage, limit: itemsPerPage } );

          const mediaRes: IMedia[] = response.data as IMedia[];
          const totalItemsRes = response.totalItems;
          if (Array.isArray(mediaRes)) {
            this.setState<IMedia[]>("media",mediaRes);
            this.setState<number>("totalItems",totalItemsRes || 0);
          } else {
            console.error('Unexpected response format:', mediaRes);
            this.setState<IMedia[]>("media",[]);
          }
  }
}

  public attachSubmitEventListener(): void {
    const form = document.getElementById('add-media-form') as HTMLFormElement;
  
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = buildFormData(form);

        try {
          const newMediaRes:IMedia = await mediaController.addMovie(formData); 
          this.onAddMedia(newMediaRes);
          form.reset();  
        } catch (error) {
          console.error('Error adding media:', error);
        }
      });
    }
  }
  
  public attachCloseFormEventListener(): void {
      const closeFormButton = document.getElementById('close-form');
  
      if (closeFormButton) {
        closeFormButton.addEventListener('click', this.onCloseForm);
      }
  }

  private  attachPaginationEventListener(): void {
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      const currentPage = this.getState<number>("currentPage");
      
      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);

        if (page !== currentPage && currentPage != null) {
          document.querySelectorAll('.pagination-btn').forEach((btn) => {
            btn.classList.remove('active');
          });

          target.classList.add('active');
          this.setState<number>("currentPage", page );
          await this.fetchMedia(); 
          this.renderMovieList();
        }
      }
    });
  }
  private attachSearchEventListener(): void {
    const searchButton = document.querySelector('button');
    const searchInput = document.querySelector('#searchInput') as HTMLInputElement;

    if (searchButton && searchInput) {
      searchInput.addEventListener('input', async () => {
        const searchQuery = searchInput.value;
        this.setState<string>("searchQuery", searchQuery);

        await this.updateSearchContent(searchQuery); 
      });
    }
  }

  private onAddMedia(newMedia: IMedia): void {
    const media = this.getState<IMedia[]>("media");

    if(media) {
      const updatedMedia = [newMedia, ...media ];
      this.setState<IMedia[]>( "media", updatedMedia );
  
      this.renderMovieList();
  
      this.onCloseForm();
    }
  }

  private onCloseForm(): void {
    const formSection = document.querySelector('.form-add') as HTMLElement;
    if (formSection) {
      formSection.style.display = 'none';
    }
  }


  private async updateSearchContent(query: string): Promise<void> {
     if(query.length > 0) {
      const searchContent = await mediaController.searchMovies(query);

      this.setState<IMedia[]> ("searchContent", searchContent.data);
      this.setState<number>("totalItems", searchContent.totalItems || 0);

      this.renderMovieList(true);
     }
     else {
      this.setState<IMedia[]>("searchContent", [] );
      this.renderMovieList();
     }
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');
    if (isSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = this.getState<IMedia[]>("media")?.length ? LoadMovies.render(this.getState<IMedia[]>("searchContent")!) : "<p>Empty</p>";
        LoadMovies.event();
        this.scrollToTop();
      }
    } else {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = this.getState<IMedia[]>("media")?.length ? LoadMovies.render(this.getState<IMedia[]>("media")!) : "<p>Empty</p>";
        LoadMovies.event();
        this.scrollToTop();
      }
    }
  }

  private attachAddNewItemEventListener(): void {
    const addNewItemButton = document.getElementById('add-new-item');
    if (addNewItemButton) {
      addNewItemButton.addEventListener('click', () => this.toggleFormVisibility());
    }
  }

  private toggleFormVisibility(): void {
    const isFormVisible = this.getState<boolean>("isFormVisible");

    if(isFormVisible) {
    this.setState<boolean>("isFormVisible",isFormVisible );
    const formSection = document.querySelector('.form-add') as HTMLElement;
    if (formSection) {
      formSection.style.display = this.getState("isFormVisible") ? 'block' : 'none';
    }
  }
  }
  private scrollToTop(): void {
    document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}

