import { ContentRender } from "@/types/basePageTypes";

export abstract class BasePage {
  protected state: Record<string, string> = {};

  public abstract renderContent(content: ContentRender): string;

  public abstract afterRender(): void ;

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

  protected getState<T>(key: string): T | null {
      try {
          const jsonString = this.state[key];
          if (!jsonString) {
              return null;
          }
          const parsedData: unknown = JSON.parse(jsonString);

          if(parsedData == false) {
            return false as T;
          }

          if (parsedData as T ) {
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
