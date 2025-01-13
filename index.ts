import { HomePage } from './src/views/page/homePage';
import { Router } from './src/router/router';

class App {
  private static instance: App;
  private router: Router;

  private constructor() {
    this.router = Router.getInstance();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const rootElement = document.getElementById('app');
      console.log(rootElement);
      if (!rootElement) {
        throw new Error('Root element not found! Please ensure an element with id "app" exists in your HTML.');
      }

      // Set up router
      this.router.setRoot(rootElement);
      this.router.addRoute('/', HomePage, 'Home');

      // Navigate to current path
      await this.router.navigateTo(window.location.pathname);

      // Set up navigation event listeners
      this.setupNavigationListeners();
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }

  private setupNavigationListeners(): void {
    window.addEventListener('popstate', () => {
      this.router.navigateTo(window.location.pathname);
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.getInstance().initialize();
});
