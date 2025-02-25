import { RenderPaginationData } from '@/types/componentTypes';

export default class Pagination {
  public static render(state: RenderPaginationData): void {
    const paginationElement = document.querySelector('.pagination') as HTMLElement;
    const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);

    const createPageButton = (pageNum: number): string => `
            <button class="pagination-btn ${pageNum === state.currentPage ? 'active' : ''}" data-page="${pageNum}">
                ${pageNum}
            </button>
        `;

    if (totalPages <= 1) {
      paginationElement.innerHTML = '';
    } else {
      const currentPage = this.getPage(state);

      let html = '';
      let startPage, endPage;

      // if we have 5 pages => 1,2, 5 pages are missing because they are near the end or beginning
      switch (true) {
        case totalPages <= 4:
          startPage = 1;
          endPage = totalPages;
          break;
        case currentPage === 1:
          startPage = 1;
          endPage = 4;
          break;
        case currentPage >= totalPages - 1:
          startPage = totalPages - 3;
          endPage = totalPages;
          break;
        default:
          startPage = currentPage - 1;
          endPage = currentPage + 2;
          break;
      }

      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        html += createPageButton(pageNum);
      }

      if (paginationElement) {
        paginationElement.innerHTML = html;
      }
    }
  }

  private static getPage(state: RenderPaginationData): number {
    const { currentFilter, currentPage, pageMovies, pageTvShow } = state;

    if (!currentFilter) {
      return currentPage;
    }

    if (currentFilter === 'TV Show' && pageTvShow) {
      return pageTvShow;
    } else if (currentFilter === 'Movies' && pageMovies) {
      return pageMovies;
    } else {
      return currentPage;
    }
  }

  public static isVisiblePagination(state: boolean): void {
    const paginationElement = document.querySelector('.pagination') as HTMLElement;
    if (paginationElement) {
      paginationElement.style.visibility = state ? 'visible' : 'hidden';
    }
  }
}
