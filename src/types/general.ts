import { IMedia } from "@/models/mediaForm";

export type NavItem  = {
    text: string;
    href: string;
  } 
export type ContentRender = {
   mediaRes?: IMedia[] | IMedia | null;
   totalItems?: number;
   author?: string;
   idMedia?: string;
}

export interface ImageLink {
  srcImg: string;
  caption?: string;
  alt: string;
  link?: string;
}

export interface FieldConfig {
  label: string;
  type: "text" | "textarea" | "number" | "file" | "date" | "select"; 
  required?: boolean;
  placeholder?: string;
  maxlength?: number;
  accept?: string; 
  step?: number;
  max?: number | string;
  min?: number | string;
  multiple?: boolean;
  options?: string[];
}

export interface IState {
      mediaRes?: null | IMedia[] | IMedia;
      idMedia?: string;
      author?: string;
      totalItems?: number;
      currentPage?: number;
      currentFilter?: string | null;
      pageMovies?: number | null;
      pageShows?: number | null;
      itemsPerPage?: number;
      searchQuery?: string
      media?: Array<IMedia>;
      searchContent?: [];  
      email?: string;
      password?: string;
      errorMessage?: string;
      name?: string;
      [key: string]: string | number | boolean | IMedia[] | IMedia | null | undefined ;
}
