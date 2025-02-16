import { IMedia } from "@/types/mediaForm";

export type ContentRender = {
      mediaRes?: IMedia[] | IMedia ;
      totalItems?: number;
      author?: string;
      idMedia?: number;
   }

export interface StateValue {
      type: string;
      value: unknown;
    }
    