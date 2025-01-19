export abstract class BasePage {
    protected state: Record<string, any> = {};
  
    protected abstract renderContent(): string | Promise<string>;
    protected abstract attachEventListeners(): void;
  
    // Render the entire page 
    public async render(): Promise<string> {
      let content; 
        try {
          content = await this.renderContent();
        } catch (error) {
          console.error("Error rendering page:", error);
          return this.renderError();  
        }
      return content;
    }
  
    // Actions to perform after rende ring
    public afterRender(): void {
      this.attachEventListeners();
    }
  
    // Update the state and re-render a specific section or the entire page
    protected setState(newState: Record<string, any>): void {
      this.state = { ...this.state, ...newState };
    }
  
    // Retrieve state by key
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
  