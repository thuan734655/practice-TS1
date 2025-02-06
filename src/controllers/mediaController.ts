import MediaModel from '../models/mediaModel';
import { IMedia } from '../types/mediaForm';
import { IApiResponse } from '@/types/apiResponse';

class MovieController {
    async getMovies(page: number, limit: number): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getAllMovies(page, limit);
    }

    async getMoviesByFilter(filter: string, page: number, limit: number): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getMovieByType(filter, page, limit);
    }

    async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.searchMovies(query);
    }

    async getMovieByAuthor(author: string, page: number, limit: number): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getMediaByAuthor(author, page, limit);
    }

    async deleteMovie(id: number): Promise<boolean> {
        const result = await MediaModel.deleteMovie(id);
        return result.success;
    }

    async addMovie(formData: FormData): Promise<IMedia> {
        const result = await MediaModel.addMovie(formData);
        return result.data as IMedia;
    }

    async getMovieById(id: number): Promise<IMedia> {
        const result = await MediaModel.getMovieById(id);
        return result.data as IMedia;
    }

    async updateMovie(id: string, formData: FormData): Promise<boolean> {
        const result = await MediaModel.updateMovieById(id, formData);
        return result.success;
    }
}

export default new MovieController();
