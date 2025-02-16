import { HomePage } from './src/views/page/homePage';
import { Router } from './src/router/router';
import {getDataLocalStorage} from "./src/utils/localStorage";

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
      if (!rootElement) {
        throw new Error('Root element not found! Please ensure an element with id "app" exists in your HTML.');
      }

      // Set up router
      this.router.setRoot(rootElement);
      this.router.addRoute('/', 'Login');
      this.router.addRoute('/login', 'Login');
      this.router.addRoute('/home', 'Home');
      this.router.addRoute('/add/:author', 'Add');
      this.router.addRoute('/update/:id', 'Update');
      this.router.addRoute('/detail/:id', 'Detai');
      this.router.addRoute('/movies', 'Movie');
      this.router.addRoute('/tvshows', 'TV Show');
      this.router.addRoute('/error', 'Error');

      const isLogin = getDataLocalStorage('name');
      if(isLogin) { 
        // Navigate to home page
        this.router.navigateTo('/home');
      }
      else {
        // Navigate to current path
        this.router.navigateTo(window.location.pathname);
      }
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }

}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.getInstance().initialize();
});
