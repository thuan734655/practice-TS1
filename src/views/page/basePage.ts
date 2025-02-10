import { ContentRender } from "@/types/basePageTypes";

export abstract class BasePage {
  protected state: Record<string, string> = {};

  public abstract renderContent(content: ContentRender): string;
  protected abstract attachEventListeners(): void;

  public afterRender(): void {
    this.attachEventListeners();
  }

    /**
     * @param key - The name of the state property to be accessed and modified
     * @param value - The value to be stored in the state, which can be of any data type (object, array, string, number, etc.)
     */
    protected setState<T>(key: string, value: T): void {
        try {
            if (value === undefined || value === null) {
                throw new Error(`Invalid value for state key: ${key}`);
            }
            this.state[key] = JSON.stringify(value);
        } catch (error) {
            console.error(`Error setting state for key "${key}":`, error);
        }
    }

    /**
     * @param key - The name of the state property you want to retrieve
     * @returns The value of the property converted back from a JSON string, or null if no data is found
     */
    protected getState<T>(key: string): T | null {
        try {
            const jsonString = this.state[key];
            if (!jsonString) {
                return null;
            }
            const parsedData: unknown = JSON.parse(jsonString);
            
            if (parsedData as T) {
                return parsedData as T;
            } else {
                throw new Error(`Invalid data type for key: ${key}`); 
            }
        } catch (error) {
            console.error(`Error getting state for key "${key}":`, error);
            return null;
        }
    }

  protected renderError(): string {
    return `
      <div class="error-page">
        <h1>Oops! Something went wrong</h1>
        <p>Unable to load the content. Please try again later.</p>
      </div>
    `;
  }
}
