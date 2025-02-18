import { FieldConfig } from '@/types/componentTypes';

export const fieldConfigsUpdateAndTVShow: Record<string, FieldConfig> = {
  type: { label: 'Type', type: 'select', options: [ 'TV Show','Movie'], required: true },
  movie_name: { label: 'Movie Name', type: 'text', placeholder: 'Enter movie name', maxlength: 255, required: true },
  title: { label: 'Title', type: 'text', placeholder: 'Enter title', maxlength: 255, required: true },
  description: { label: 'Description', type: 'textarea', placeholder: 'Enter video description', required: true },
  rating: { label: 'Rating', type: 'number', placeholder: 'Rate from 0 to 10', max: 10, min: '0', step: 0.1, required: true },
  avatar: { label: 'Avatar', type: 'file', accept: 'image/*',required: true },
  background: { label: 'Background', type: 'file', accept: 'image/*',required: true },
  episode_run_time: { label: 'Episode Run Time', type: 'number', placeholder: 'Enter run time (e.g., 1h 30m)', maxlength: 50, required: true },
  genres: { label: 'Genres', type: 'text', placeholder: 'Enter genres (comma separated)', maxlength: 500, required: true },
  status: { label: 'Status', type: 'text', placeholder: 'Enter video status', maxlength: 500, required: true },
  last_air_date: { label: 'Last Air Date', type: 'date', min: '1900-01-01', max: '2100-12-31', required: true },
  first_air_date: { label: 'First Air Date', type: 'date', min: '1900-01-01', max: '2100-12-31', required: true },
  number_of_episodes: { label: 'Number of Episodes', type: 'number', placeholder: 'Enter number of episodes', min: '1', max: 1000, required: true },
  number_of_seasons: { label: 'Number of Seasons', type: 'number', placeholder: 'Enter number of seasons', min: '1', max: 100, required: true },
};

export const fieldConfigMovies: Record<string, FieldConfig> = {
  type: { label: 'Type', type: 'select', options: ['Movie', 'TV Show'], required: true },
  movie_name: { label: 'Movie Name', type: 'text', placeholder: 'Enter movie name', maxlength: 255, required: true },
  title: { label: 'Title', type: 'text', placeholder: 'Enter title', maxlength: 255, required: true },
  description: { label: 'Description', type: 'textarea', placeholder: 'Enter video description', required: true },
  rating: { label: 'Rating', type: 'number', placeholder: 'Rate from 0 to 10', max: 10, min: '0', step: 0.1, required: true },
  avatar: { label: 'Avatar', type: 'file', accept: 'image/*',required: true },
  background: { label: 'Background', type: 'file', accept: 'image/*',required: true },
  release_date: { label: 'Release Date', type: 'date', min: '1900-01-01', max: '2100-12-31', required: true },
  episode_run_time: { label: 'Episode Run Time', type: 'number', placeholder: 'Enter run time (e.g., 1h 30m)', maxlength: 50, required: true },
  genres: { label: 'Genres', type: 'text', placeholder: 'Enter genres (comma separated)', maxlength: 500, required: true },
};
