import { RenderPaginationData } from "@/types/componentTypes";

export default class Pagination {
  public static render(state: RenderPaginationData): void {
    const paginationElement = document.querySelector(".pagination");
    const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);

    const createPageButton = (pageNum: number): string => `
            <button class="pagination-btn ${
              pageNum === state.currentPage ? "active" : ""
            }" data-page="${pageNum}">
                ${pageNum}
            </button>
        `;

    if (totalPages <= 1) {
      if (paginationElement) {
        paginationElement.innerHTML = "";
      }
    } else {
      if (paginationElement) {
        const currentPage = this.getPage(state);
        console.log(currentPage, "current page", totalPages);
        
        let html = "";
        let startPage, endPage;
        
        // if we have 5 pages => 1,2, 5 pages are missing because they are near the end or beginning
        if (totalPages <= 4) {
          startPage = 1;
          endPage = totalPages;
        } else if (currentPage <= 2) {
          startPage = 1;
          endPage = 4;
        } else if (currentPage >= totalPages - 1) {
          startPage = totalPages - 3;
          endPage = totalPages;
        } else {
          startPage = currentPage - 1;
          endPage = currentPage + 2;
        }
        
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          html += createPageButton(pageNum);
        }
        
        if (paginationElement) {
          paginationElement.innerHTML = html;
        }
        
      }
    }
  }

  private static getPage(state: RenderPaginationData): number {
    const { currentFilter, currentPage, pageMovies, pageTvShow } = state;

    if (!currentFilter) {
      return currentPage;
    }

    if (currentFilter === "TV Show" && pageTvShow) {
      return pageTvShow 
    } else if (currentFilter === "Movies" && pageMovies) {
      return pageMovies 
    } else {
      return currentPage;
    }
  }
}
