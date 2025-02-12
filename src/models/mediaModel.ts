    import axiosAPI from "@/api/configAxios"
    import type { IMedia } from "@/models/mediaForm"
    import type { IApiResponse } from "@/types/apiResponse"
    import { AxiosError } from "axios"

    class MediaModel {
    static async getAllMovies(page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
        const response = await axiosAPI.get<IApiResponse<IMedia[]>>("/media", {
            params: { page, limit },
        })
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || "Failed to fetch movies",
            data: [],
            }
        }
        return {
            success: false,
            message: "An unexpected error occurred while fetching movies",
            data: [],
        }
        }
    }

    static async getMovieById(id: number): Promise<IApiResponse<IMedia>> {
        try {
        const response = await axiosAPI.get<IApiResponse<IMedia>>(`/media/${id}`)
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || `Failed to fetch movie with id ${id}`,
            data: undefined,
            }
        }
        return {
            success: false,
            message: `An unexpected error occurred while fetching movie with id ${id}`,
            data: undefined,
        }
        }
    }

    static async getMovieByType(type: string, page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
            const response = await axiosAPI.get<IApiResponse<IMedia[]>>(`/media/type/${type}`, { params: paginationData });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, `Failed to fetch movies with type ${type}`, []);
        }
    }

    static async updateMovieById(id: number, data: FormData): Promise<IApiResponse<IMedia>> {
        try {
            const response = await axiosAPI.put<IApiResponse<IMedia>>(`/media/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: unknown) {
            return handleAxiosError(error, `Failed to update movies `, {} as IMedia);
        }
    }

    static async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        try {
        const response = await axiosAPI.get<IApiResponse<IMedia[]>>(`/media/search?query=${encodeURIComponent(query)}`)
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || "Failed to search movies",
            data: [],
            }
        }
        return {
            success: false,
            message: "An unexpected error occurred while searching movies",
            data: [],
        }
        }
    }

    static async deleteMovie(id: number): Promise<IApiResponse<boolean>> {
        try {
        const response = await axiosAPI.delete<IApiResponse<boolean>>(`/media/${id}`)
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || `Failed to delete movie with id ${id}`,
            data: false,
            }
        }
        return {
            success: false,
            message: `An unexpected error occurred while deleting movie with id ${id}`,
            data: false,
        }
        }
    }

    static async addMovie(newMovie: FormData): Promise<IApiResponse<IMedia>> {
        try {
        const response = await axiosAPI.post<IApiResponse<IMedia>>("/media-add", newMovie, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || "Failed to add movie",
            data: undefined,
            }
        }
        return {
            success: false,
            message: "An unexpected error occurred while adding movie",
            data: undefined,
        }
        }
    }

    static async getMediaByAuthor(authorName: string, page = 1, limit = 8): Promise<IApiResponse<IMedia[]>> {
        try {
        const response = await axiosAPI.get<IApiResponse<IMedia[]>>(`/media-author`, {
            params: { page, limit, username: authorName },
        })
        return response.data
        } catch (error:unknown) {
        if (error instanceof AxiosError && error.response) {
            return {
            success: false,
            message: error.response.data?.message || `Failed to fetch movies for author ${authorName}`,
            data: [],
            }
        }
        return {
            success: false,
            message: `An unexpected error occurred while fetching movies for author ${authorName}`,
            data: [],
        }
        }
    }
    }

    export default MediaModel

