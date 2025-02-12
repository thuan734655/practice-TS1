import { BasePage } from "./basePage";
import Header from "../components/Header";
import movieController from "../../controllers/mediaController";
import LoadMovies from "../components/ListMovie";
import { ICSearch } from "../../resources/assets/icons";
import { ContentRender } from "@/types/basePageTypes";
import { IMedia } from "@/types/mediaForm";
import { Toast } from "@/utils/toast";
import { RenderPaginationData } from "@/types/componentTypes";
import Pagination from "../components/Pagination";

export class HomePage extends BasePage {
  constructor() {
    super();
    this.setState<string>("currentFilter", "All");
    this.setState<number>("currentPage", 1);
    this.setState<number>("pageMovies", 1);
    this.setState<number>("pageTvShow", 1);
    this.setState<number>("itemsPerPage", 8);
  }

  public renderContent(content: ContentRender): string {
    this.setState<IMedia[]>("media", content.mediaRes as IMedia[]);
    this.setState<number>("totalItems", content.totalItems as number);

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
         ${this.renderQuantity()}
        </p>
        <div class="section-main--list-movies" id="movieList">
            ${
              this.getState<IMedia[]>("media")?.length
                ? LoadMovies.render(this.getState<IMedia[]>("media")!)
                : "<p>Empty</p>"
            }
        </div>
        <div class="pagination"></div>
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
  private renderQuantity(): string {
    const currentFilter = this.getState<string>("currentFilter");
    const totalItems = this.getState<number>("totalItems");
    if (currentFilter && currentFilter) {
      return ` 
        ${currentFilter} <span>(${totalItems})</span>
   `;
    } else {
      return "";
    }
  }

  private renderFilterButtons(): string {
    const filters = ["All", "Movies", "TV Show"];
    const currentFilter = this.getState<string>("currentFilter");
    if (currentFilter) {
      return `
      <div class="section-main--subNav">
        <div class="subNav-container">
          ${filters
            .map((filter) => {
              if (filter == "TV Show") {
                return `
                  <button id="${filter}" class="subNav-container--btn-tv-shows ${
                  currentFilter === filter ? "button-active" : ""
                }">
                  TV Shows
                  </button>`;
              } else {
                return `
                  <button id="${filter}" class="subNav-container--btn-${filter} ${
                  currentFilter === filter ? "button-active" : ""
                }">
                    ${
                      filter === "tv-shows"
                        ? "TV Shows"
                        : filter.charAt(0).toUpperCase() + filter.slice(1)
                    }
                  </button>`;
              }
            })
            .join("")}
        </div>
      </div>
    `;
    }
    return "";
  }
  private renderPagination(): void {
    const totalItems = this.getState<number>("totalItems");
    const itemsPerPage = this.getState<number>("itemsPerPage");
    const currentPage = this.getPage();
    const pageMovies = this.getState<number>("pageMovies");
    const pageTvShow = this.getState<number>("pageTvShow");
    const currentFilter = this.getState<number>("currentFilter");
    if (
      totalItems &&
      itemsPerPage &&
      currentFilter &&
      pageMovies &&
      pageTvShow &&
      currentPage 
    ) {
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

  protected attachEventListeners(): void {
    this.attachFilterEventListeners();
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.event();
    this.renderPagination();
  }

  private attachFilterEventListeners(): void {
    const filters = ["All", "Movies", "TV Show"];
    filters.forEach((filter) => {
      const button = document.getElementById(filter);
      if (button) {
        button.addEventListener("click", async () => {
          const currentFilter = this.getState<string>("currentFilter");

          if (currentFilter) {
            if (currentFilter != filter) {
              console.log(currentFilter, filter);
              this.setState<string>("currentFilter", filter);
              this.updateActiveFilterButton();
              await this.updateFilteredContent();
            }
          }
        });
      }
    });
  }

  private attachSearchEventListener(): void {
    const searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", async (e) => {
        const query = (e.target as HTMLInputElement).value;
        console.log(query);
        if (query == "") {
          this.renderMovieList();
        } else {
          await this.updateSearchContent(query);
        }
      });
    }
  }

  private attachPaginationEventListener(): void {
    const paginationElement = document.querySelector(".pagination");

    if (!paginationElement) return; 

    paginationElement.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("pagination-btn")) {
        const page = parseInt(target.dataset.page || "1", 10);
        const currentPage = this.getPage();

        if (page !== currentPage) {
          paginationElement.querySelectorAll(".pagination-btn").forEach((btn) => {
            btn.classList.remove("active");
          });
          target.classList.add("active");
          this.setPage(page);
          this.updateFilteredContent();
        }
      }
    });
  }

  private async fetchMedia(): Promise<void> {
    const filter = this.getState<string>("currentFilter");
    const page = this.getPage();
    const limit = this.getState<number>("itemsPerPage");

    if (filter && page && limit) {
      const response =
        filter != "All"
          ? await movieController.getMoviesByFilter(filter, { page, limit })
          : await movieController.getMovies({ page, limit });
      const mediaRes = response.data;
      const totalItemsRes = response.totalItems;

      if (mediaRes) {
        this.setState<IMedia[]>("media", mediaRes);
        this.setState<number>("totalItems", totalItemsRes || 0);
      } else {
        Toast.showError("Error occurred while performing this action!");
      }
    } else {
      Toast.showError("Error occurred while performing this action!");
    }
  }

  private updateActiveFilterButton(): void {
    const filter = this.getState<string>("currentFilter");
    if (filter) {
      document
        .querySelectorAll(".subNav-container button")
        .forEach((btn) => btn.classList.remove("button-active"));
      const button = document.getElementById(filter);
      button?.classList.add("button-active");
    }
  }

  private async updateFilteredContent(): Promise<void> {
    await this.fetchMedia();
    this.renderPagination();
    this.renderMovieList();
    this.updateQuantityVideos();
  }

  private async updateSearchContent(query: string): Promise<void> {
    const searchContent = await movieController.searchMovies(query);
    const currentFilter = this.getState<string>("currentFilter");

    if (searchContent && currentFilter) {
      console.log(currentFilter);
      const filteredContent = searchContent.data?.filter(
        (item) => item.type == currentFilter || currentFilter == "All"
      );
      this.setState<IMedia[]>("mediaSearch", filteredContent);
      this.setState<number>("totalItems", filteredContent?.length || 0);

      this.renderMovieList(true);
    }
  }

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector(
      ".section-main--list-movies"
    );
    const mediaSearch = this.getState<IMedia[]>("mediaSearch");
    const media = this.getState<IMedia[]>("media");
    if (isSearch && mediaSearch) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies.render(mediaSearch);
        LoadMovies.event();
        this.scrollToTop();
      }
    } else if (media) {
      if (listMoviesElement) {
        listMoviesElement.innerHTML = LoadMovies.render(media);
        LoadMovies.event();
        this.scrollToTop();
      }
    }
  }

  private updateQuantityVideos(): void {
    const quantityVideosElement = document.querySelector(".quantity-videos");
    const currentFilter = this.getState<string>("currentFilter");
    const totalItems = this.getState<number>("totalItems");

    if (quantityVideosElement && currentFilter && totalItems) {
      quantityVideosElement.innerHTML = `${currentFilter} <span>(${totalItems})</span>`;
    }
  }

  private setPage(page: number): void {
    const currentFilter = this.getState<string>("currentFilter");
    if (currentFilter) {
      currentFilter === "All"
        ? this.setState<number>("currentPage", page)
        : currentFilter === "Movies"
        ? this.setState<number>("pageMovies", page)
        : this.setState<number>("pageTvShow", page);
    } else {
      console.error("Error setting page");
    }
  }

  private getPage(): number {
    const currentFilter = this.getState<string>("currentFilter");

    if (currentFilter) {
      if (currentFilter === "All") {
        const currentPage = this.getState<number>("currentPage");
        return currentPage !== null ? currentPage : 1;
      }

      if (currentFilter === "Movies") {
        const pageMovies = this.getState<number>("pageMovies");
        return pageMovies !== null ? pageMovies : 1;
      }

      const pageTvShow = this.getState<number>("pageTvShow");
      return pageTvShow !== null ? pageTvShow : 1;
    }
    return 1;
  }

  private scrollToTop(): void {
    document
      .querySelector(".section-main--list-movies")
      ?.scrollIntoView({ behavior: "smooth" });
  }
}
