import { IMedia } from "../models/mediaForm";

export interface IApiResponse {
    meta: IMetaResponse | null;
    data: IMedia[];
}

export interface IMetaResponse {
   meta : {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}