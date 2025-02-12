import MediaModel from '../models/mediaModel';
import { IMedia } from '../models/mediaForm';
import { IApiResponse } from '@/types/apiResponse';
import { Toast } from '@/utils/toast';

class MovieController {
    async getMovies(page: number, limit: number): Promise<IApiResponse<IMedia[]>> {
        try {
          const result =   await MediaModel.getAllMovies(page,limit);
            if(!result.success) {
                Toast.showError(result.message);
            }
            return result as IApiResponse<IMedia[]>;
        } catch (error) {
            console.error('Controller error getting movies:', error);
            throw error;
        }
    }
    async getMoviesByFilter(filter: string, page: number, limit: number ): Promise<IApiResponse<IMedia[]>> {
        try {
            const result =   await MediaModel.getMovieByType(filter,page,limit);
            if(!result.success) {
                Toast.showError(result.message);
            }
            return result as IApiResponse<IMedia[]>;
        } catch (error) {
            console.error('Controller error getting movies:', error);
            throw error;
        }
    }
    async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
        try {
            const result =  await MediaModel.searchMovies(query);
            if(!result.success) {
                Toast.showError(result.message );
            }
            return result as IApiResponse<IMedia[]>;
        } catch (error) {
            console.error('Controller error searching movies:', error);
            throw error;
        }
    }

    async getMovieByAuthor(author:string, page: number, limit: number): Promise<IApiResponse<IMedia[]>> {
        try {
            const result =  await MediaModel.getMediaByAuthor(author, page, limit);
            if(!result.success) {
                Toast.showError(result.message);
            }
            return result as IApiResponse<IMedia[]>;
        } catch (error) {
            console.error('Controller error getting movies by author:', error);
            throw error;
        }   
    }

    async deleteMovie(id: number): Promise<boolean> {
        try {
            const result =  await MediaModel.deleteMovie(id);
            if(!result.success ) {
                Toast.showError(result.message);
            }
            return result.success as boolean;
        } catch (error) {
            console.error(`Controller error deleting movie ${id}:`, error);
            throw error;
        }
    }
    async addMovie(formData: FormData): Promise<IMedia> {
        try {
            const result =  await MediaModel.addMovie(formData);
            if(!result.success) {
                Toast.showError(result.message );
            }
            return result.data as IMedia;
        } catch (error) {
            console.error('Controller error adding movie:', error);
            throw error;
        }
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

