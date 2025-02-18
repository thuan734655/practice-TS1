import { ICSearch } from "@/resources/assets/icons";

export const renderSearchBox = (): string => {
    return `
      <div class="section-main--search">
        <div class="search-container">
          <input id="searchInput" class="search-container--input" type="text" placeholder="Search Movies or TV Shows">
          <img class="search-container--icon" src="${ICSearch}" alt="icon search">
        </div>
      </div>
    `;
  }