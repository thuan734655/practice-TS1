import axiosAPI from "@/api/configAxios";
import type { IMedia } from "@/types/mediaForm";
import type { IApiResponse } from "@/types/apiResponseTypes";
import handleAxiosError from "@/helper/handleAxiosError";
import { paginationData } from "@/types/componentTypes";

class MediaModel {
    static async getAllMovies(paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media", { params: paginationData });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, "Failed to fetch movies", []);
        }
    }

    static async getMovieById(id: number): Promise<IApiResponse<IMedia>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia>>(`/media/${id}`);
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, `Failed to fetch movie with id ${id}`, {} as IMedia);
        }
    }

    static async getMovieByType(type: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>(`/media/type/${type}`, { params: paginationData });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, `Failed to fetch movies with type ${type}`, []);
        }
    }

    static async updateMovieById(id: number, data: FormData): Promise<boolean> {
        try {
            const response = await axiosAPI.put<IApiResponse<boolean>>(`/media/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.success;
        } catch (error: unknown) {
            return false;
        }
    }

    static async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media/search", { params: { query } });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, "Failed to search movies", []);
        }
    }

    static async deleteMovie(id: number): Promise<boolean> {
        try {
            const response = await axiosAPI.delete<IApiResponse<boolean>>(`/media/${id}`);
            return response.data.success;
        } catch (error: unknown) {
            return false;
        }
    }

    static async addMedia(newMovie: FormData): Promise<IApiResponse<IMedia>> {
        try {
            const response = await axiosAPI.post<IApiResponse<IMedia>>("/media-add", newMovie, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, "Failed to add media", {} as IMedia);
        }
    }

    static async getMediaByAuthor(authorName: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media-author", {
                params: { paginationData, username: authorName },
            });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, `Failed to fetch media for author ${authorName}`, []);
        }
    }
}

export default MediaModel;
