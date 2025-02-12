import { BasePage } from "./basePage";
import Header from "../components/Header";
import { ICSearch } from "../../resources/assets/icons";
import LoadMovies from "../components/ListMovie";
import mediaController from "../../controllers/mediaController";
import { IMedia } from "../../types/mediaForm";
import AddForm from "../components/AddForm";
import Pagination from "../components/Pagination";
import { ContentRender } from "@/types/basePageTypes";
import { buildFormData } from "@/helper/formHelper";
import { Toast } from "@/utils/toast";
import { RenderPaginationData } from "@/types/componentTypes";

export class AddPage extends BasePage {
  constructor() {
    super();
    this.setState<boolean>("isFormVisible", true);
    this.setState<number>("currentPage", 1);
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia[]>("media", content.mediaRes as IMedia[]);
    this.setState<number>("totalItems", content.totalItems as number);
    this.setState<string>("author", content.author as string);

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
        ${AddForm.render()}
        </section>
        `;
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
  private renderPagination(): void {
    const totalItems = this.getState<number>("totalItems");
    const currentPage = this.getState<number>("currentPage");
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
  protected attachEventListeners(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    this.attachSubmitEventListener();
    this.attachCloseFormEventListener();
    this.attachAddNewItemEventListener();
    this.renderPagination();
    LoadMovies.event();
  }

  private async fetchMedia(): Promise<void> {
    const author = this.getState<string>("author");
    const currentPage = this.getState<number>("currentPage");
    const itemsPerPage = this.getState<number>("itemsPerPage");

    if (!author || !currentPage || !itemsPerPage) {
      Toast.showError("Error occurred while performing this action!");
    } else {
      const response = await mediaController.getMovieByAuthor(author, {
        page: currentPage,
        limit: itemsPerPage,
      });

      const mediaRes: IMedia[] = response.data as IMedia[];
      const totalItemsRes = response.totalItems;
      if (Array.isArray(mediaRes)) {
        this.setState<IMedia[]>("media", mediaRes);
        this.setState<number>("totalItems", totalItemsRes || 0);
      } else {
        console.error("Unexpected response format:", mediaRes);
        this.setState<IMedia[]>("media", []);
      }
    }
  }

  public attachSubmitEventListener(): void {
    const form = document.getElementById("add-media-form") as HTMLFormElement;

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = buildFormData(form);
        const newMediaRes: IMedia = await mediaController.addMovie(formData);
        this.onAddMedia(newMediaRes);
        this.setState<boolean>("isFormVisible", false);
        this.onCloseForm();
        form.reset();
      });
    }
  }

  public attachCloseFormEventListener(): void {
    const closeFormButton = document.getElementById("close-form");

    if (closeFormButton) {
      closeFormButton.addEventListener("click", this.onCloseForm);
    }
  }

  private attachPaginationEventListener(): void {
    const paginationElement = document.querySelector(".pagination");

    if (!paginationElement) return;

    paginationElement.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      const currentPage = this.getState<number>("currentPage");

      if (target.classList.contains("pagination-btn")) {
        const page = parseInt(target.dataset.page || "1", 10);

        if (page !== currentPage && currentPage != null) {
          paginationElement
            .querySelectorAll(".pagination-btn")
            .forEach((btn) => {
              btn.classList.remove("active");
            });

          target.classList.add("active");
          this.setState<number>("currentPage", page);

          this.updateContentPagination();
        }
      }
    });
  }

  private attachSearchEventListener(): void {
    const searchButton = document.querySelector("button");
    const searchInput = document.querySelector(
      "#searchInput"
    ) as HTMLInputElement;

    if (searchButton && searchInput) {
      searchInput.addEventListener("input", async () => {
        const searchQuery = searchInput.value;
        this.setState<string>("searchQuery", searchQuery);

        await this.updateSearchContent(searchQuery);
      });
    }
  }

  private onAddMedia(newMedia: IMedia): void {
    const media = this.getState<IMedia[]>("media");

    if (media) {
      const updatedMedia = [newMedia, ...media];
      this.setState<IMedia[]>("media", updatedMedia);
      this.renderMovieList();

      this.onCloseForm();
    }
  }

  private onCloseForm(): void {
    const formSection = document.querySelector(".form-add") as HTMLElement;
    if (formSection) {
      formSection.style.display = "none";
    }
  }

  private async updateSearchContent(query: string): Promise<void> {
    if (query.length > 0) {
      const searchContent = await mediaController.searchMovies(query);

      this.setState<IMedia[]>("searchContent", searchContent.data);
      this.setState<number>("totalItems", searchContent.totalItems || 0);
      // search == true
      this.renderMovieList(true);
    } else {
      this.setState<IMedia[]>("searchContent", []);
      this.renderMovieList();
    }
  }
  private async updateContentPagination(): Promise<void> {
    await this.fetchMedia();
    this.renderMovieList();
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector(
      ".section-main--list-movies"
    );
    if (isSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = this.getState<IMedia[]>("media")?.length
          ? LoadMovies.render(this.getState<IMedia[]>("searchContent")!)
          : "<p>Empty</p>";
        this.renderPagination();
        console.log(listMoviesElement);
        LoadMovies.event();
        this.scrollToTop();
      }
    } else {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = this.getState<IMedia[]>("media")?.length
          ? LoadMovies.render(this.getState<IMedia[]>("media")!)
          : "<p>Empty</p>";
        LoadMovies.event();
        this.scrollToTop();
      }
    }
  }

  private attachAddNewItemEventListener(): void {
    const addNewItemButton = document.getElementById("add-new-item");
    if (addNewItemButton) {
      addNewItemButton.addEventListener("click", () =>
        this.toggleFormVisibility()
      );
    }
  }

  private toggleFormVisibility(): void {
    const isFormVisible = this.getState<boolean>("isFormVisible");
    if (isFormVisible != null) {
      this.setState<boolean>("isFormVisible", isFormVisible);
      const formSection = document.querySelector(".form-add") as HTMLElement;
      if (formSection) {
        formSection.style.display = isFormVisible ? "block" : "none";
        4;
        this.setState<boolean>("isFormVisible", !isFormVisible);
      }
    }
  }
  private scrollToTop(): void {
    document
      .querySelector(".section-main--list-movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }
}
