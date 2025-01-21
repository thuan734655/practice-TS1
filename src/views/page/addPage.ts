import { BasePage } from './basePage';
import Header from '../components/Header';
import { ICSearch } from '../../resources/assets/icons';
import LoadMovies from '../components/ListMovie';
import mediaController from '../../controllers/mediaController';
import { IMedia } from '../../models/mediaForm';
import AddForm from '../components/AddForm';
import Pagination from '../components/Pagination';
import { ContentRender } from '@/types/general';
import { buildFormData } from '@/helper/formHelper';

export class AddPage extends BasePage {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      media: [],
      totalItems: 0,
      itemsPerPage: 8,
      currentPage: 1,
      isFormVisible: false,
      searchContent: [],
      author: "",
    };
  }

  public async renderContent(content:ContentRender): Promise<string> {
    this.setState({ media: content?.mediaRes, totalItems: content?.totalItems, author: content?.author});
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
          ${this.getState("media") !== undefined ? LoadMovies.render(this.getState("media")) : '<p class = "does_not_exist"  >video does not exist.</p>'}
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
    try {
      const response = await mediaController.getMovieByAuthor(this.getState("author"),this.getState("currentPage"), this.getState("itemsPerPage"));

      if(response !== null) {
        const mediaRes: IMedia[] = response?.data;
      const totalItemsRes = response.totalItems;
      if (Array.isArray(mediaRes)) {
        this.setState({ media: mediaRes, totalItems: totalItemsRes || 0 });
      } else {
        console.error('Unexpected response format:', mediaRes);
        this.setState({ media: [] });
      }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ media: [] });
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
      if (target.classList.contains('pagination-btn')) {
        const page = parseInt(target.dataset.page || '1', 10);

        if (page !== this.getState("currentPage")) {
          document.querySelectorAll('.pagination-btn').forEach((btn) => {
            btn.classList.remove('active');
          });

          target.classList.add('active');
          this.setState({ currentPage: page });
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
        this.setState({ searchQuery });
        console.log("Searching for:", searchQuery);
        await this.updateSearchContent(searchQuery); 
      });
    }
  }

  private onAddMedia(newMedia: IMedia): void {
    const updatedMedia = [newMedia, ...this.getState("media")];
    this.setState({ media: updatedMedia });

    this.renderMovieList();

    this.onCloseForm();
  }

  private onCloseForm(): void {
    const formSection = document.querySelector('.form-add') as HTMLElement;
    if (formSection) {
      formSection.style.display = 'none';
    }
  }


  private async updateSearchContent(query: string): Promise<void> {
    try {
     if(query.length > 0) {
      const searchContent = await mediaController.searchMovies(query);
      this.setState({ searchContent: searchContent, totalItems: searchContent.length });
      this.renderMovieList(true);
     }
     else {
      this.setState({ searchContent: [] });
      this.renderMovieList();
     }
    } catch (error) {
      console.error('Error during search:', error);
      this.setState({ searchContent: [] });
    }
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector('.section-main--list-movies');
    if (isSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies.render(this.getState("searchContent"));
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

  private attachAddNewItemEventListener(): void {
    const addNewItemButton = document.getElementById('add-new-item');
    if (addNewItemButton) {
      addNewItemButton.addEventListener('click', () => this.toggleFormVisibility());
    }
  }

  private toggleFormVisibility(): void {
    this.setState({ isFormVisible: !this.getState("isFormVisible") });
    const formSection = document.querySelector('.form-add') as HTMLElement;
    if (formSection) {
      formSection.style.display = this.getState("isFormVisible") ? 'block' : 'none';
    }
  }
  private scrollToTop(): void {
    document.querySelector('.section-main--list-movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}

