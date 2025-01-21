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
    static async updateMovieById(id: string, data: FormData): Promise<boolean> {
        try {
            const response = await axiosAPI.put(`/media/${id}`, data,{
                headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
            console.log(response)
            return response.data.success;
        } catch (error) {
            console.error(`Error updating movie with id ${id}:`, error);
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

    static async getMediaByAuthor(authorName: string, page: number = 1, limit: number = 8): Promise<IApiResponse  | null> {
        try {
            if (!authorName) {
                throw new Error("Author name is required");
            }
        
            page = page > 0 ? page : 1;
            limit = limit > 0 ? limit : 8;
            
            const response = await axiosAPI.get(`media-author`, {
                params: {
                    page: page,
                    limit: limit,
                    username: authorName
                }
            });
    
            if (!response.data) {
                console.warn(`No media found for author ${authorName}`);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching media for author ${authorName}:`, error);
            return null;
        }
    }
    
}

export default MediaModel;
