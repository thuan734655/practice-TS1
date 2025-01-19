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

    async getMovieByAuthor( page: number, limit: number): Promise<IApiResponse> {
        try {
            const userData = localStorage.getItem('user');
            const author = userData ? JSON.parse(userData).name : null;

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
            let parsedUser : string = "";
            const authorName = localStorage.getItem('user');
            if(authorName) {
                 parsedUser = JSON.parse(authorName).name;
            }
      
            const newFormData = new FormData();
            newFormData.append('description', formData.get('description') as string);
            newFormData.append('rating', formData.get('rating') as string);
            newFormData.append('type', formData.get('type') as string);
            newFormData.append('status', formData.get('status') as string);
            newFormData.append('release_date', formData.get('release_date') as string);
            newFormData.append('last_air_date', formData.get('last_air_date') as string);
            newFormData.append('first_air_date', formData.get('first_air_date') as string);
            newFormData.append('number_of_episodes', formData.get('number_of_episodes') as string);
            newFormData.append('number_of_seasons', formData.get('number_of_seasons') as string);
            newFormData.append('episode_run_time', formData.get('episode_run_time') as string);
            newFormData.append('genres', (formData.get('genres') as string));
            newFormData.append('movie_name', formData.get('movie-name') as string);
            newFormData.append('author', parsedUser as string);
            newFormData.append('background', formData.get('background') as string);
            newFormData.append('avatar', formData.get('avatar') as string)

            const result =  await MediaModel.addMovie(newFormData);
            
            return result;
        } catch (error) {
            console.error('Controller error adding movie:', error);
            throw error;
        }
    }
}

export default new MovieController();
