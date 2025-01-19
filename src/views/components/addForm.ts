export default class AddForm {
  public static render(): string {
    return `
      <div class="add-form-container">
        <h2>Add Media</h2>
        <form id="add-media-form" enctype="multipart/form-data" method="POST">
          <div class="form-group">
            <label for="movie-name">Movie Name:</label>
            <input type="text" id="movie-name" name="movie-name" required>
          </div>
          
          <div class="form-group">
            <label for="title">Title:</label>
            <textarea id="title" name="title" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="rating">Rating:</label>
            <input type="number" id="rating" name="rating" required min="0" max="10" step="0.1">
          </div>

          <div class="form-group">
            <label for="type">Type:</label>
            <select id="type" name="type">
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Status:</label>
            <input type="text" id="status" name="status" required>
          </div>

          <div class="form-group">
            <label for="release_date">Release Date:</label>
            <input type="date" id="release_date" name="release_date">
          </div>

          <div class="form-group">
            <label for="last_air_date">Last air date:</label>
            <input type="date" id="last_air_date" name="last_air_date">
          </div>

          <div class="form-group">
            <label for="first_air_date">First air date:</label>
            <input type="date" id="first_air_date" name="first_air_date">
          </div>

          <div class="form-group">
            <label for="number_of_episodes">No. of episodes:</label>
            <input type="number" id="number_of_episodes" name="number_of_episodes">
          </div>

          <div class="form-group">
            <label for="number_of_seasons">No. of Seasons:</label>
            <input type="number" id="number_of_seasons" name="number_of_seasons">
          </div>

          <div class="form-group">
            <label for="episode_run_time">Episode run time:</label>
            <input type="number" id="episode_run_time" name="episode_run_time">
          </div>
          
          <div class="form-group">
            <label for="genres">Genres:</label>
            <input type="text" id="genres" name="genres" required>
          </div>

          <div class="form-group">
            <label for="background">Background Images:</label>
            <input type="file" id="background" name="background" multiple>
          </div>

          <div class="form-group">
            <label for="avatar">Avatar Images:</label>
            <input type="file" id="avatar" name="avatar" multiple>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Media</button>
            <button type="button" id="close-form" class="btn btn-secondary">Close</button>
          </div>
        </form>
      </div>
    `;
  }
}
