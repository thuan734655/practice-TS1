import { paginationData } from '@/types/componentTypes';
import MediaModel from '../models/mediaModel';
import { IMedia } from '../types/mediaForm';
import { IApiResponse } from '@/types/apiResponseTypes';
import { validateAdd } from '@/helper/validateMedia';
import { clearError, showErrorAndEditText } from '@/utils/formErrorHandler';

class MovieController {
  static async getMovies(paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
    return await MediaModel.getAllMovies(paginationData);
  }

  static async getMoviesByFilter(filter: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
    return await MediaModel.getMovieByType(filter, paginationData);
  }

  static async searchMovies(query: string): Promise<IApiResponse<IMedia[]>> {
    return await MediaModel.searchMovies(query);
  }

  static async getMovieByAuthor(author: string, paginationData: paginationData): Promise<IApiResponse<IMedia[]>> {
    return await MediaModel.getMediaByAuthor(author, paginationData);
  }

  static async deleteMovie(id: number): Promise<boolean> {
    const result = await MediaModel.deleteMovie(id);
    return result;
  }

  static async addMovie(formData: FormData): Promise<IMedia | null> {
    const firstAirDate = new Date(formData.get('first_air_date') as string);
    const lastAirDate = new Date(formData.get('last_air_date') as string);

    const validateDateMessage = validateAdd.validateDateTvShow(firstAirDate, lastAirDate);
    const validateAvatarMessage = validateAdd.validateImageFile(formData.get('avatar') as File);
    const validateBackgroundMessage = validateAdd.validateImageFile(formData.get('background') as File);

    validateDateMessage ? showErrorAndEditText('first_air_date', validateDateMessage) : clearError('first_air_date');
    validateAvatarMessage ? showErrorAndEditText('avatar', validateAvatarMessage) : clearError('avatar');
    validateBackgroundMessage ? showErrorAndEditText('background', validateBackgroundMessage) : clearError('background');

    if (validateAvatarMessage || validateBackgroundMessage || validateDateMessage) {
      return null;
    }

    const result = await MediaModel.addMedia(formData);
    return result.data;
  }

  static async getMovieById(id: number): Promise<IMedia> {
    const result = await MediaModel.getMovieById(id);
    return result.data;
  }

  static async updateMovie(id: number, formData: FormData, media: IMedia): Promise<IMedia | null> {
    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
      const validateAvatarMessage = validateAdd.validateImageFile(avatarFile);

      if (validateAvatarMessage) return showErrorAndEditText('update-avatar', validateAvatarMessage), null;

      clearError('update-avatar');
    }

    const backgroundFile = formData.get('background') as File;
    if (backgroundFile && backgroundFile.size > 0) {
      const validateBackgroundMessage = validateAdd.validateImageFile(backgroundFile);

      if (validateBackgroundMessage) return showErrorAndEditText('update-background', validateBackgroundMessage), null;

      clearError('update-background');
    }

    const firstAirDateStr = formData.get('first_air_date') as string;
    const lastAirDateStr = formData.get('last_air_date') as string;

    const firstAirDate = firstAirDateStr ? new Date(firstAirDateStr) : null;
    const lastAirDate = lastAirDateStr ? new Date(lastAirDateStr) : null;

    if (firstAirDate && lastAirDate) {
      const validateDateMessage = validateAdd.validateDateTvShow(firstAirDate, lastAirDate);

      if (validateDateMessage) return showErrorAndEditText('update-first_air_date', validateDateMessage), null;

      clearError('update-first_air_date');
    } else if (firstAirDate) {
      const validateDateMessage = validateAdd.validateDateTvShow(firstAirDate, media.first_air_date!);
      if (validateDateMessage) return showErrorAndEditText('update-first_air_date', validateDateMessage), null;

      clearError('update-first_air_date');
    } else if (lastAirDate && media.last_air_date) {
      const validateDateMessage = validateAdd.validateDateTvShow(new Date(media.first_air_date!), lastAirDate);
      if (validateDateMessage) return showErrorAndEditText('update-last_air_date', validateDateMessage), null;

      clearError('update-last_air_date');
    }

    const result = await MediaModel.updateMovieById(id, formData);
    return result.data;
  }
}

export default MovieController;
