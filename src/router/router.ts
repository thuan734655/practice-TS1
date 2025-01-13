import { BasePage } from '../views/page/BasePage.ts';

interface Route {
  path: string;
  component: new () => BasePage;
  title: string;
}

export class Router {
  private static instance: Router;
  private routes: Route[] = [];
  private root: HTMLElement | null = null;
  private currentComponent: BasePage | null = null;

  private constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('DOMContentLoaded', () => this.handleRoute());

    // Intercept all clicks on anchor tags
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.navigateTo(href);
        }
      }
    });
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  public setRoot(element: HTMLElement): void {
    this.root = element;
  }

  public addRoute(path: string, component: new () => BasePage, title: string): void {
    this.routes.push({ path, component, title });
  }

  public navigateTo(path: string): void {
    window.history.pushState(null, '', path);
    this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const path = window.location.pathname;
    const route = this.findMatchingRoute(path);

    if (route && this.root) {
      // Update page title
      document.title = route.title;

      // Create and render new component
      const component = new route.component();
      this.currentComponent = component;

      try {
        const content = await component.render();
        this.root.innerHTML = content;
        component.afterRender();

        // Scroll to top on page change
        window.scrollTo(0, 0);

        // Update active navigation state
        this.updateActiveNavigation(path);
      } catch (error) {
        console.error('Error rendering page:', error);
        this.handleError();
      }
    } else {
      this.handle404();
    }
  }

  private findMatchingRoute(path: string): Route | undefined {
    return this.routes.find(route => {
      if (route.path.includes(':')) {
        const routeParts = route.path.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length !== pathParts.length) return false;
        
        return routeParts.every((part, i) => {
          if (part.startsWith(':')) return true;
          return part === pathParts[i];
        });
      }
      return route.path === path;
    });
  }

  private updateActiveNavigation(currentPath: string): void {
    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  public getParam(param: string): string | null {
    const path = window.location.pathname;
    const route = this.findMatchingRoute(path);

    if (route) {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      const paramIndex = routeParts.findIndex(part => part === `:${param}`);
      
      if (paramIndex !== -1) {
        return pathParts[paramIndex];
      }
    }
    return null;
  }

  private handle404(): void {
    if (this.root) {
      this.root.innerHTML = `
        <div class="error-page">
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/" class="back-home">Go Home</a>
        </div>
      `;
    }
  }

  private handleError(): void {
    if (this.root) {
      this.root.innerHTML = `
        <div class="error-page">
          <h1>Oops! Something went wrong</h1>
          <p>Please try again later.</p>
          <a href="/" class="back-home">Go Home</a>
        </div>
      `;
    }
  }
}