import MediaModel from '../models/mediaModel';
import { IMedia } from '../models/mediaForm';
import { IApiResponse } from '@/types/apiResponse';

class MovieController {
    async getMovies(page: number, limit: number): Promise<IApiResponse> {
        try {
            let response;

            response =  await MediaModel.getAllMovies(page,limit);
            return response;
        } catch (error) {
            console.error('Controller error getting movies:', error);
            throw error;
        }
    }
    async getMoviesByFilter(filter: string, page: number, limit: number ): Promise<IApiResponse> {
        try {
            let response;

            response =  await MediaModel.getMovieByType(filter,page,limit);

            return response || [];
        } catch (error) {
            console.error('Controller error getting movies:', error);
            throw error;
        }
    }
    async searchMovies(query: string): Promise<IMedia[]> {
        try {
            return await MediaModel.searchMovies(query);
        } catch (error) {
            console.error('Controller error searching movies:', error);
            throw error;
        }
    }

    async deleteMovie(id: number): Promise<boolean> {
        try {
            const existingMovie = await MediaModel.getMovieById(id);
            if (!existingMovie) {
                throw new Error(`Movie with id ${id} not found`);
            }
            return await MediaModel.deleteMovie(id);
        } catch (error) {
            console.error(`Controller error deleting movie ${id}:`, error);
            throw error;
        }
    }
}

export default new MovieController();
