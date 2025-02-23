import { IMedia } from '@/types/mediaForm';
import { fieldConfigMovies, fieldConfigsTVShow } from '@/constants/formFieldConfig';

import { FieldConfig } from '@/types/componentTypes';

class UpdateForm {
  public static render(media: IMedia): string {
    const fieldConfig = media.type === 'TV Show' ? fieldConfigsTVShow : fieldConfigMovies;

    const formFields = Object.keys(fieldConfig)
      .map(key => this.generateFieldHTML(key, fieldConfig[key], this.getFormattedValue(media[key as keyof IMedia])))
      .join('');

    return `
      <form id="update-feature-form" enctype="multipart/form-data">
        ${formFields}
        <button type="submit" class="btn-update-video">Update Video</button>
        <button type="button" class="btn-back">Back</button>
      </form>
    `;
  }

  private static getFormattedValue(value: unknown): string {
    if (value instanceof Date) return value.toISOString().split('T')[0];
    if (Array.isArray(value)) return value.join(', ');
    return value != null ? String(value) : '';
  }

  private static generateFieldHTML(key: string, config: FieldConfig, formattedValue: string): string {
    let { label, type, required, placeholder, maxlength, accept, step, max, min } = config;
    if (type == 'file') {
      required = false;
    }

    if (type == 'select') {
      return '';
    }

    if (type == 'textarea') {
      return `
        <div class="form-group">
          <label for="${key}">${label}:</label>
          <textarea id="${key}" name="${key}" 
            ${required ? 'required' : ''} 
            ${maxlength ? `maxlength="${maxlength}"` : ''} 
            placeholder="${placeholder || ''}">${formattedValue}</textarea>
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
          ${required ? 'required' : ''} 
          ${placeholder ? `placeholder="${placeholder}"` : ''} 
          ${maxlength ? `maxlength="${maxlength}"` : ''} 
          ${accept ? `accept="${accept}"` : ''} 
          ${step ? `step="${step}"` : ''} 
          ${max ? `max="${max}"` : ''} 
          ${min ? `min="${min}"` : ''}
          value="${formattedValue}"
        >
        <p id="error-update-${key}" class = "error-message">Invalid</p>
      </div>
    `;
  }
}

export default UpdateForm;
