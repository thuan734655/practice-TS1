import axiosAPI from "@/api/configAxios";
import type { IMedia } from "@/types/mediaForm";
import type { IApiResponse } from "@/types/apiResponse";
import { AxiosError } from "axios";

class MediaModel {
    private static handleAxiosError<T>(error: unknown, defaultMessage: string, defaultData: T): IApiResponse<T> {
        if (error instanceof AxiosError && error.response) {
            return {
                success: false,
                message: error.response.data?.message || defaultMessage,
                data: defaultData,
            };
        }
        return {
            success: false,
            message: "An unexpected error occurred",
            data: defaultData,
        };
    }

    static async getAllMovies(page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media", { params: { page, limit } });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, "Failed to fetch movies", []);
        }
    }

    static async getMovieById(id: string | number): Promise<IApiResponse<IMedia>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia>>(`/media/${id}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, `Failed to fetch movie with id ${id}`, null);
        }
    }

    static async getMovieByType(type: string, page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>(`/media/type/${type}`, { params: { page, limit } });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, `Failed to fetch movies with type ${type}`, []);
        }
    }

    static async updateMovieById(id: string | number, data: FormData): Promise<IApiResponse<boolean>> {
        try {
            const response = await axiosAPI.put<IApiResponse<boolean>>(`/media/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, `Failed to update movie with id ${id}`, false);
        }
    }

    static async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media/search", { params: { query } });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, "Failed to search movies", []);
        }
    }

    static async deleteMovie(id: string | number): Promise<IApiResponse<boolean>> {
        try {
            const response = await axiosAPI.delete<IApiResponse<boolean>>(`/media/${id}`);
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, `Failed to delete movie with id ${id}`, false);
        }
    }

    static async addMedia(newMovie: FormData): Promise<IApiResponse<IMedia>> {
        try {
            const response = await axiosAPI.post<IApiResponse<IMedia>>("/media-add", newMovie, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, "Failed to add media", undefined);
        }
    }

    static async getMediaByAuthor(authorName: string, page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media-author", {
                params: { page, limit, username: authorName },
            });
            return response.data;
        } catch (error: unknown) {
            return this.handleAxiosError(error, `Failed to fetch media for author ${authorName}`, []);
        }
    }
}

export default MediaModel;
