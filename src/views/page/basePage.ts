import { ContentRender } from "@/types/general";

export abstract class BasePage {
    protected state: Record<string, any> = {};
  
    public abstract renderContent(content: ContentRender): string | Promise<string>;
    protected abstract attachEventListeners(): void;
  
    public afterRender(): void {
      this.attachEventListeners();
    }
  
    protected setState(newState: Record<string, any>): void {
      this.state = { ...this.state, ...newState };
    }
  
    protected getState(key: string): any {
      return this.state[key];
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
  