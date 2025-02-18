import { paginationData } from '@/types/componentTypes';
import MediaModel from '../models/mediaModel';
import { IMedia } from '../types/mediaForm';
import { IApiResponse } from '@/types/apiResponseTypes';
import { validateAdd } from '@/helper/validateAdd';
import { clearError, showErrorAndEditText } from '@/utils/formErrorHandler';

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

  async addMovie(formData: FormData): Promise<IMedia | null> {
    const firstAirDate = new Date(formData.get('first_air_date') as string);
    const lastAirDate = new Date(formData.get('last_air_date') as string);
    
    if (!validateAdd.validateDateTvShow(firstAirDate, lastAirDate)) {
        showErrorAndEditText('first_air_date', 'The last broadcast date and first broadcast date are incorrect');
        showErrorAndEditText('last_air_date', 'The last broadcast date and first broadcast date are incorrect');
        return null;
    }

    clearError('first_air_date');
    clearError('last_air_date');
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
