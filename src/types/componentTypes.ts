export interface ImageLink {
  srcImg: string;
  caption?: string;
  alt: string;
  link?: string;
}
export type FieldConfig = {
  label: string;
  type: "text" | "textarea" | "number" | "file" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  maxlength?: number;
  accept?: string;
  step?: number;
  max?: number | string;
  min?: number | string;
  options?: string[];
};

export interface NavItem {
  text: string;
  href: string;
}

export interface paginationData {
  page: number;
  limit: number;
}
export interface RenderPaginationData {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  currentFilter?: string;
  pageMovies?: number;
  pageTvShow?: number;
}
