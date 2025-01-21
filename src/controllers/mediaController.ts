import MediaModel from '../models/mediaModel';
import { IMedia } from '../models/mediaForm';
import { IApiResponse } from '@/types/apiResponse';

class MovieController {
    async getMovies(page: number, limit: number): Promise<IApiResponse> {
        try {
          return  await MediaModel.getAllMovies(page,limit);
        } catch (error) {
            console.error('Controller error getting movies:', error);
            throw error;
        }
    }
    async getMoviesByFilter(filter: string, page: number, limit: number ): Promise<IApiResponse> {
        try {
            return  await MediaModel.getMovieByType(filter,page,limit);
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

    async getMovieByAuthor(author:string, page: number, limit: number): Promise<IApiResponse | null> {
        try {
            return await MediaModel.getMediaByAuthor(author, page, limit);
        } catch (error) {
            console.error('Controller error getting movies by author:', error);
            throw error;
        }
    }

    async deleteMovie(id: number): Promise<boolean> {
        try {
            return await MediaModel.deleteMovie(id);
        } catch (error) {
            console.error(`Controller error deleting movie ${id}:`, error);
            throw error;
        }
    }
    async addMovie(formData: FormData): Promise<IMedia> {
        try {
            const result =  await MediaModel.addMovie(formData);
            
            return result;
        } catch (error) {
            console.error('Controller error adding movie:', error);
            throw error;
        }
    }
    async getMovieById(id: number): Promise<IMedia> {
        try {
            const result = await MediaModel.getMovieById(id);
            
            return result;
        } catch (error) {
            console.error(`Controller error getting movie ${id}:`, error);
            throw error;
        }
    }
    async updateMovie(id: string, formData: FormData): Promise<boolean> {
        try {
            const result = await MediaModel.updateMovieById(id, formData);
            
            return result;
        } catch (error) {
            console.error(`Controller error updating movie ${id}:`, error);
            throw error;
        }
    }
}

export default new MovieController();
