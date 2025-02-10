export interface ImageLink  {
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
    multiple?: boolean;
    options?: string[];
  }

  export interface NavItem {
    text: string;
    href: string;
  } 

  export interface paginationData {
    page: number;
    limit: number;
  }
  