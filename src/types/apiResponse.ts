import { IMedia } from "../models/mediaForm";

export interface IApiResponse {
    data: IMedia[];
    totalItems: number;
}

