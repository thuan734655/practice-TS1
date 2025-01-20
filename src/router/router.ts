import { BaseController } from '../controllers/baseController';

interface Route {
  path: string;
  title: string;
}

export class Router {
  private static instance: Router;
  private routes: Route[] = [];
  private root: HTMLElement | null = null;

  private constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('DOMContentLoaded', () => this.handleRoute());

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

  public addRoute(path: string, title: string): void {
    this.routes.push({ path, title });
  }

  public navigateTo(path: string): void {
    window.history.pushState(null, '', path);
    this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const path = window.location.pathname;
    const route = this.findMatchingRoute(path);

    if (route && this.root) {

      try {
        const controller = new BaseController();
        await controller.handleRoute(this.root, path,route.title);

      } catch (error) {
        console.error('Error in controller:', error);
        this.navigateTo("/error");
      }
    } else {
      this.navigateTo("/error");
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
}
