import axiosAPI from '../api/configAxios';
import { IMedia } from "../models/mediaForm";
import { IApiResponse } from '../types/apiResponse';

class MediaModel {
    static async getAllMovies(page: number, limit: number): Promise<IApiResponse> {
        try {
            const response = await axiosAPI.get('/media', {
                params: {
                    page: page || 1, 
                    limit: limit || 8
                }
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    }
    
    static async getMovieById(id: number): Promise<IMedia> {
        try {
            const response = await axiosAPI.get(`/media/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching movie with id ${id}:`, error);
            throw error;
        }
    }

    static async getMovieByType(type: string, page: number, limit: number): Promise<IApiResponse> {
        try {
            const response = await axiosAPI.get(`/media/type/${type}`, {
                params: {
                    page: page || 1,
                    limit: limit || 8
                }
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(`Error fetching movies with type ${type}:`, error);
            throw error;
        }
    }

    static async searchMovies(query: string): Promise<IMedia[]> {
        try {
            const response = await axiosAPI.get(`/media/search?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    static async deleteMovie(id: number): Promise<boolean> {
        try {
            await axiosAPI.delete(`/media/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
        }
    }

    static async addMovie(newMovie: FormData): Promise<IMedia> {
        try {
            const response = await axiosAPI.post('/media-add', newMovie,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Movie added successfully:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error adding movie:', error);
            throw error;
        }
    }

    static async getMediaByAuthor(authorName: string, page: number, limit: number): Promise<IApiResponse> {
        try {
            const response = await axiosAPI.get(`media-author`, {
                params: {
                    page: page || 1,
                    limit: limit || 8,
                    username: authorName
                }
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(`Error fetching movies for author ${authorName}:`, error);
            throw error;
        }
    }
}

export default MediaModel;
