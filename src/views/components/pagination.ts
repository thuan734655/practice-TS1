export default class Pagination {
    public static render(state: Record<string, any>): void {
        const paginationElement = document.querySelector('.pagination');
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        
        const createPageButton = (pageNum: number): string => `
            <button class="pagination-btn ${pageNum === this.getPage(state) ? 'active' : ''}" data-page="${pageNum}">
                ${pageNum}
            </button>
        `;
  
        const currentPage = this.getPage(state);

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        if (totalPages <= 1) {
            if (paginationElement) {
                paginationElement.innerHTML = ""; 
            }
        } else {
            if (paginationElement) {
                const paginationContent = `${Array.from({ length: endPage - startPage + 1 }, (_, i) => createPageButton(startPage + i)).join('')}`;
                paginationElement.innerHTML = paginationContent; 
            }
        }
    }

    private static getPage(state: Record<string, any>): number {
        const { currentFilter, currentPage, pageMovies, pageTvShow } = state;

        if (!currentFilter) {
            return currentPage;
        }

        if (currentFilter === 'all') {
            return currentPage;
        } else if (currentFilter === 'movies') {
            return pageMovies ?? currentPage;  
        } else if (currentFilter === 'tv-shows') {
            return pageTvShow ?? currentPage;
        }

        return currentPage;
    }
}
