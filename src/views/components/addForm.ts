export default class AddForm {
  public static render(): string {
    const fields = [
      { name: "movie_name", label: "Movie Name", type: "text", required: true },
      { name: "title", label: "Title", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "rating", label: "Rating", type: "number", required: true, min: 0, max: 10, step: 0.1 },
      { name: "type", label: "Type", type: "select", options: ["Movie", "TV Show"] },
      { name: "status", label: "Status", type: "text", required: true },
      { name: "release_date", label: "Release Date", type: "date" },
      { name: "last_air_date", label: "Last air date", type: "date" },
      { name: "first_air_date", label: "First air date", type: "date" },
      { name: "number_of_episodes", label: "No. of episodes", type: "number" },
      { name: "number_of_seasons", label: "No. of Seasons", type: "number" },
      { name: "episode_run_time", label: "Episode run time", type: "number" },
      { name: "genres", label: "Genres", type: "text", required: true },
      { name: "background", label: "Background Images", type: "file", multiple: true },
      { name: "avatar", label: "Avatar Images", type: "file", multiple: true }
    ];

    // Loop through fields and generate form HTML
    const formFields = fields.map(field => {
      if (field.type === 'select') {
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}:</label>
            <select id="${field.name}" name="${field.name}">
              ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
          </div>
        `;
      }

      if (field.type === 'textarea') {
        return `
          <div class="form-group">
            <label for="${field.name}">${field.label}:</label>
            <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>
          </div>
        `;
      }

      return `
        <div class="form-group">
          <label for="${field.name}">${field.label}:</label>
          <input type="${field.type}" id="${field.name}" name="${field.name}" 
            ${field.required ? 'required' : ''} 
            ${field.min ? `min="${field.min}"` : ''} 
            ${field.max ? `max="${field.max}"` : ''} 
            ${field.step ? `step="${field.step}"` : ''} 
            ${field.multiple ? 'multiple' : ''}>
        </div>
      `;
    }).join("");

    return `
      <div class="add-form-container">
        <h2>Add Media</h2>
        <form id="add-media-form" enctype="multipart/form-data">
          ${formFields}
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Add Media</button>
            <button type="button" id="close-form" class="btn btn-secondary">Close</button>
          </div>
        </form>
      </div>
    `;
  }
}
