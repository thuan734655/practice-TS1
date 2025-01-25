import { getDataLocalStorage } from "@/controllers/localStorage";

  export const buildFormData = (form: HTMLFormElement): FormData => {
    const formData = new FormData(form);
    const newFormData = new FormData();
  
    [
      'description',
      'rating',
      'type',
      'status',
      'release_date',
      'last_air_date',
      'first_air_date',
      'number_of_episodes',
      'number_of_seasons',
      'episode_run_time',
      'genres',
      'movie_name',
      'background',
      'avatar',
    ].forEach((key) => {
      const value = formData.get(key) as string;
      if (value) {
        newFormData.append(key, value);
      }
    });
  
    const author = getDataLocalStorage("name")
    if (author) {
      newFormData.append('author', author);
    }
  
    return newFormData;
  };
  