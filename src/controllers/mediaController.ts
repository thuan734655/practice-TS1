import { paginationData } from '@/types/componentTypes';
import MediaModel from '../models/mediaModel';
import { IMedia } from '../types/mediaForm';
import { IApiResponse } from '@/types/apiResponseTypes';

class MovieController {
    async getMovies(paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getAllMovies(paginationData);
    }

    async getMoviesByFilter(filter: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getMovieByType(filter, paginationData);
    }

    async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.searchMovies(query);
    }

    async getMovieByAuthor(author: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
        return await MediaModel.getMediaByAuthor(author, paginationData);
    }

    async deleteMovie(id: number): Promise<boolean> {
        const result = await MediaModel.deleteMovie(id);
        return result;
    }

    async addMovie(formData: FormData): Promise<IMedia> {
        const result = await MediaModel.addMedia(formData);
        return result.data;
    }

    async getMovieById(id: number): Promise<IMedia> {
        const result = await MediaModel.getMovieById(id);
        return result.data;
    }

    async updateMovie(id: number, formData: FormData): Promise<IMedia> {
        const result = await MediaModel.updateMovieById(id, formData);
        return result.data;
    }
}

export default new MovieController();
