import { fieldConfigs } from "@/constants/formFieldConfig";
import { FieldConfig } from "@/types/general";

export default class AddForm {
  public static render(): string {
    const formFields = Object.entries(fieldConfigs).map(([key, config]) => {
      return this.generateFieldHTML(key, config);
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

  private static generateFieldHTML(key: string, config: FieldConfig): string {
    const { label, type, required, placeholder, maxlength, accept, step, max, min, multiple, options } = config;
    if(label === "Last Air Date") {
      console.log(min)
    }
  
    if (type === "select") {
      return `
        <div class="form-group">
          <label for="${key}">${label}:</label>
          <select id="${key}" name="${key}" ${required ? "required" : ""}>
            ${options?.map(option => `<option value="${option}">${option}</option>`).join('')}
          </select>
        </div>
      `;
    }
  
    if (type === "textarea") {
      return `
        <div class="form-group">
          <label for="${key}">${label}:</label>
          <textarea id="${key}" name="${key}" ${required ? "required" : ""} ${maxlength ? `maxlength="${maxlength}"` : ""} placeholder="${placeholder || ""}"></textarea>
        </div>
      `;
    }
  
    return `
      <div class="form-group">
        <label for="${key}">${label}:</label>
        <input 
          type="${type}" 
          id="${key}" 
          name="${key}" 
          ${required ? "required" : ""} 
          ${placeholder ? `placeholder="${placeholder}"` : ""} 
          ${maxlength ? `maxlength="${maxlength}"` : ""} 
          ${accept ? `accept="${accept}"` : ""} 
          ${step ? `step="${step}"` : ""} 
          ${min ? `min="${min}"` : ""} 
          ${max ? `max="${max}"` : ""} 
          ${multiple ? "multiple" : ""}
        >
      </div>
    `;
  }
  
}
