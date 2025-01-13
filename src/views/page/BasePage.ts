export abstract class BasePage {
    private cachedContent: string | null = null;
    protected state: Record<string, any> = {};
  
    protected abstract renderContent(): string | Promise<string>;
  
    // Render the entire page 
    public async render(): Promise<string> {
      if (!this.cachedContent) {
        try {
          this.cachedContent = await this.renderContent();
        } catch (error) {
          console.error("Error rendering page:", error);
          return this.renderError();
        }
      }
      return this.cachedContent;
    }
  
    // Actions to perform after rende ring
    public afterRender(): void {
      this.attachEventListeners();
    }
  
    protected attachEventListeners(): void {
    }
  
    // Render a specific section based on the element ID
    public async updateSection(elementId: string, content: string | Promise<string>): Promise<void> {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = await content;
      } else {
        console.warn(`Element with ID "${elementId}" not found.`);
      }
    }
  
    // Update the state and re-render a specific section or the entire page
    protected setState(newState: Record<string, any>, sectionId?: string): void {
      this.state = { ...this.state, ...newState };
  
      if (sectionId) {
        const sectionContent = this.renderSection(sectionId);
        if (sectionContent) {
          this.updateSection(sectionId, sectionContent);
        }
      } else {
        this.cachedContent = null;
        this.updateView();
      }
    }
  
    // Retrieve state by key
    protected getState(key: string): any {
      return this.state[key];
    }
  
    // Re-render the entire page
    protected async updateView(): Promise<void> {
      const rootElement = document.querySelector(".app");
      if (rootElement) {
        try {
          rootElement.innerHTML = await this.render();
          this.afterRender();
        } catch (error) {
          console.error("Error updating view:", error);
          rootElement.innerHTML = this.renderError();
        }
      }
    }
  
    // Render the content of a specific section
    protected renderSection(sectionId: string): string | Promise<string> | null {
      return null;
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
  