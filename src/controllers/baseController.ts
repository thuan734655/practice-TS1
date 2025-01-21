import { HomePage } from '@/views/page/homePage.ts';
import mediaController from './mediaController.ts';
import { LoginPage } from '@/views/page/loginPage.ts';
import { AddPage } from '@/views/page/addPage.ts';
import { ContentRender } from '@/types/general.ts';
import {UpdatePage} from "../views/page/updatePage.ts"
import TvShowsDetailsPage from '@/views/page/detailPage.ts';
import { MoviePage } from '@/views/page/moivePage.ts';
import { TvShowPage } from '@/views/page/tvshowPage.ts';
import { ErrorPage } from '@/views/page/errorPage.ts';

export class BaseController {
    public async handleRoute(root: HTMLElement, path: string, title: string): Promise<void> {
      const params = this.extractParams(path);
  
      const page: number = 1;
      const limit: number = 8;
  
      switch (true) {
        case path === '/home': {
          const homePage = new HomePage();
          const result = await mediaController.getMovies(page, limit);
          const data :ContentRender = {mediaRes: result.data,totalItems: result.totalItems};
          const homeContent = await homePage.renderContent(data);
          root.innerHTML = homeContent;
          homePage.afterRender();
          document.title = title;
          break;
        }
  
        case path === '/': {
          const loginPage = new LoginPage();
          const loginPageContent = await loginPage.renderContent();
          root.innerHTML = loginPageContent;
          loginPage.afterRender();
          document.title = title;
          break;
        }
  
        case path === '/login': {
          const loginPage_2nd = new LoginPage();
          const loginPageContent_2nd = await loginPage_2nd.renderContent();
          root.innerHTML = loginPageContent_2nd;
          loginPage_2nd.afterRender();
          document.title = title;
          break;
        }
  
        case path.startsWith('/add'): {
          const addPage = new AddPage();
          let data:ContentRender = null;
          const result = await mediaController.getMovieByAuthor(params.author, page, limit);
          if(result!==null) {
            data = {mediaRes: result.data,totalItems: result.totalItems,author: params.author};
          }
          const addPageContent = await addPage.renderContent(data);
          root.innerHTML = addPageContent;
          addPage.afterRender();
          document.title = title;
          break;
        }
        case path.startsWith('/update'): {
          const updatePage = new UpdatePage();
          const result = await mediaController.getMovieById(parseInt(params.id,10));
          const data :ContentRender = {mediaRes: result, idMedia: params.id};
          const updatePageContent = await updatePage.renderContent(data);
          root.innerHTML = updatePageContent;
          updatePage.afterRender();
          document.title = title;
          break;
        }
        case path.startsWith('/detail'): {
          const detailPage = new TvShowsDetailsPage();
          const result = await mediaController.getMovieById(parseInt(params.id,10));
          const data :ContentRender = {mediaRes: result, idMedia: params.id};
          const detailPageContent = await detailPage.renderContent(data);
          root.innerHTML = detailPageContent;
          detailPage.afterRender();
          document.title = title;
          break;
        }
        case path.startsWith('/movie'): {
          const moviePage = new MoviePage();
          const result = await mediaController.getMoviesByFilter("movies",page, limit);
          const data :ContentRender = {mediaRes: result.data,totalItems: result.totalItems};
          const moviePageContent = await moviePage.renderContent(data);
          root.innerHTML = moviePageContent;
          moviePage.afterRender();
          document.title = title;
          break;
        }
        case path.startsWith('/tvshows'): {
          const tvShowPage = new TvShowPage();
          const result = await mediaController.getMoviesByFilter('tv-shows',page, limit);
          const data :ContentRender = {mediaRes: result.data,totalItems: result.totalItems};
          const tvShowPageContent = await tvShowPage.renderContent(data);
          root.innerHTML = tvShowPageContent;
          tvShowPage.afterRender();
          document.title = title;
          break;
        }
        case path.startsWith('/error'): {
          const tvShowPage = new ErrorPage();
          const tvShowPageContent = await tvShowPage.renderContent();
          root.innerHTML = tvShowPageContent;
          tvShowPage.afterRender();
          document.title = title;
          break;
        }
        default:
          console.error(`Route ${path} not found.`);
      }
    }
  
    private extractParams(path: string): { [key: string]: string } {
      const params: { [key: string]: string } = {};
      const pathParts = path.split('/');
      
      const routesWithParams = [
        '/add/:author',
        '/update/:id',
        '/detail/:id'
      ];
  
      routesWithParams.forEach(route => {
        const routeParts = route.split('/');
        if (pathParts.length === routeParts.length) {
          routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
              const paramName = part.substring(1);
              const paramValue = pathParts[index];
              params[paramName] = paramValue;
            }
          });
        }
      });
  
      return params;
    }
  }
  
