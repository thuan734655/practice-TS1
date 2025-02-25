import { ContentRender } from '@/types/basePageTypes';

export abstract class BasePage {
  protected state: Record<string, string> = {};

  public abstract renderContent(content: ContentRender): string;

  public abstract afterRender(): void;

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

  protected getState<T>(key: string): T {
    const jsonString = this.state[key];

    const parsedData: unknown = JSON.parse(jsonString);

    return parsedData as T;
  }
}
