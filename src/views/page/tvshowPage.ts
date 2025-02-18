import { BasePage } from "./basePage";
import Header from "../components/Header";
import movieController from "../../controllers/mediaController";
import { IMedia } from "../../types/mediaForm";
import LoadMovies from "../components/ListMovie";
import { ContentRender } from "@/types/basePageTypes";
import { Toast } from "@/utils/toast";
import Pagination from "../components/Pagination";
import { RenderPaginationData } from "@/types/componentTypes";
import { scrollToTop } from "@/utils/scrollToTop";
import { renderSearchBox } from "../components/Search";

export class TvShowPage extends BasePage {
  constructor() {
    super();
    this.setState<number>("itemsPerPage", 8);
    this.setState<number>("currentPage", 1);
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
        ${renderSearchBox()}
        <p class="section-main--desc-subNav quantity-videos">
        <span>${this.getState("totalItems")} items</span>
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

  private renderMovieList(isSearch?: Boolean): void {
    const listMoviesElement = document.querySelector(".section-main--list-movies" );
    const mediaSearch = this.getState<IMedia[]>("mediaSearch");
    const media = this.getState<IMedia[]>("media");
    if (!listMoviesElement) {
      return;
    }
    if (isSearch) {
      if (listMoviesElement) {
        (listMoviesElement as HTMLElement).innerHTML = mediaSearch
          ? LoadMovies.render(mediaSearch)
          : "<p class = 'empty'>Empty</p>";
        LoadMovies.attachEventListener();
        scrollToTop();
        Pagination.isVisiblePagination(false);
      }
    } else if (media) {
      if (listMoviesElement) {
        (listMoviesElement as HTMLElement).innerHTML = media
          ? LoadMovies.render(media)
          : "<p class = 'empty'>Empty</p>";
        LoadMovies.attachEventListener();
        scrollToTop();
        Pagination.isVisiblePagination(true);
      }
    }
  }

  public afterRender(): void {
    this.attachSearchEventListener();
    this.attachPaginationEventListener();
    LoadMovies.attachEventListener();
    this.renderPagination();
  }

  private attachSearchEventListener(): void {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", async (e) => {
        const query = (e.target as HTMLInputElement).value;
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
        const currentPage = this.getState("currentPage");

        if (page !== currentPage) {
          paginationElement.querySelectorAll(".pagination-btn").forEach((btn) => {
            btn.classList.remove("active");
          });

          target.classList.add("active");
          this.setState<number>("currentPage", page);
          this.updateFilteredContent();
        }
      }
    });
  }


  private async updateFilteredContent(): Promise<void> {
    await this.fetchMedia();
    this.renderPagination();
    this.renderMovieList();
  }

  private async fetchMedia(): Promise<void> {
    const limit = this.getState<number>("itemsPerPage");
    const currentPage = this.getState<number>("currentPage");

    if (limit && currentPage) {
      const response = await movieController.getMoviesByFilter("TV Show", {
        limit,
        page: currentPage,
      });

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

  private async updateSearchContent(query: string): Promise<void> {
    const searchContent = await movieController.searchMovies(query);

    this.setState<IMedia[]>("mediaSearch", searchContent.data);
    this.setState<number>("totalItems", searchContent.data?.length);
    this.renderMovieList(true);
  }
}
