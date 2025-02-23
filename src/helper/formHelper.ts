import { getDataLocalStorage } from "@/utils/localStorage";

export const buildFormData = (form: HTMLFormElement): FormData => {
  const formData = new FormData(form);
  const newFormData = new FormData();

  const keysToCheck = [
    "title",
    "description",
    "rating",
    "type",
    "status",
    "release_date",
    "last_air_date",
    "first_air_date",
    "number_of_episodes",
    "number_of_seasons",
    "episode_run_time",
    "genres",
    "movie_name",
  ];
  keysToCheck.forEach((key) => {
    const value = formData.get(key);
    if (value && typeof value === "string" && value.trim() !== "") {
      newFormData.append(key, value);
    }
  });

  ["avatar", "background"].forEach((key) => {
    const file = formData.get(key) as File;
    if (file && file.size > 0 && file.name) {
      newFormData.append(key, file);
    }
  });

  const author = getDataLocalStorage("name");
  if (author) {
    newFormData.append("author", author);
  }

  return newFormData;
};
