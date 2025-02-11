import { IMedia } from "@/models/mediaForm";
import { fieldConfigs } from "@/constants/formFieldConfig";
import { FieldConfig } from "@/types/componentTypes";

class UpdateForm {
  public static render(video: Partial<IMedia>): string {
    const formFields = Object.entries(fieldConfigs).map(([key, config]) => {
      if (!(key in video)) return "";

      const value = video[key as keyof IMedia];
      const formattedValue = value instanceof Date
        ? value.toISOString().split("T")[0]
        : Array.isArray(value)
        ? value.join(", ")
        : value != null ? String(value) : "";

      return this.generateFieldHTML(key, config, formattedValue);
    }).join("");

    return `
      <form id="update-feature-form" enctype="multipart/form-data">
        ${formFields}
        <button type="submit" class="btn-update-video">Update Video</button>
      </form>
    `;
  }

  private static generateFieldHTML(key: string, config: FieldConfig, formattedValue: string): string {
    const { label, type, required, placeholder, maxlength, accept, step, max, min, multiple, options } = config;
  
    // Nếu trường là "select"
    if (type === "select") {
      return `
        <div class="form-group">
          <label for="${key}">${label}:</label>
          <select id="${key}" name="${key}" ${required ? "required" : ""}>
            ${options?.map(option => {
              const selected = option === formattedValue ? "selected" : "";
              return `<option value="${option}" ${selected}>${option}</option>`;
            }).join('')}
          </select>
        </div>
      `;
    }
  
    // Nếu trường là "textarea"
    if (type === "textarea") {
      return `
        <div class="form-group">
          <label for="${key}">${label}:</label>
          <textarea id="${key}" name="${key}" 
            ${required ? "required" : ""} 
            ${maxlength ? `maxlength="${maxlength}"` : ""} 
            placeholder="${placeholder || ""}">${formattedValue}</textarea>
        </div>
      `;
    }
  
    // Các trường còn lại (input)
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
          ${max ? `max="${max}"` : ""} 
          ${min ? `min="${min}"` : ""} 
          ${multiple ? "multiple" : ""}
          value="${formattedValue}"
        >
      </div>
    `;
  }
  
  
}

export default UpdateForm;
