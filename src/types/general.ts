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
} | null;