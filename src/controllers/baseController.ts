import { HomePage } from '@/views/page/homePage.ts';
import mediaController from './mediaController.ts';
import { LoginPage } from '@/views/page/loginPage.ts';
import { AddPage } from '@/views/page/addPage.ts';
import { ContentRender } from '@/types/general.ts';
import { UpdatePage } from '@/views/page/updatePage.ts';
import TvShowsDetailsPage from '@/views/page/detailPage.ts';
import { MoviePage } from '@/views/page/moivePage.ts';
import { TvShowPage } from '@/views/page/tvshowPage.ts';
import { ErrorPage } from '@/views/page/errorPage.ts';

export class BaseController {
  public async handleRoute(root: HTMLElement, route: string, params:  { [key: string]: string }, title: string): Promise<void> {
    const page = 1;
    const limit = 8;

    const routeHandlers: { [key: string]: (params: { [key: string]: string } ) => Promise<void> } = {
      '/home': async () => {
        const homePage = new HomePage();
        const result = await mediaController.getMovies(page, limit);
        console.log(result);
        const data: ContentRender = { mediaRes: result.data, totalItems: result.totalItems };
        root.innerHTML = await homePage.renderContent(data);
        homePage.afterRender();
      },
      '/': async () => {
        const loginPage = new LoginPage();
        root.innerHTML = await loginPage.renderContent();
        loginPage.afterRender();
      },
      '/login': async () => {
        const loginPage = new LoginPage();
        root.innerHTML = await loginPage.renderContent();
        loginPage.afterRender();
      },
      '/add/:author': async () => {
        const addPage = new AddPage();
        const result = await mediaController.getMovieByAuthor(params.author, page, limit);
        const data: ContentRender = { mediaRes: result.data, totalItems: result.totalItems, author: params.author };
        root.innerHTML = await addPage.renderContent(data);
        addPage.afterRender();
      },
      '/update/:id': async () => {
        const updatePage = new UpdatePage();
        const result = await mediaController.getMovieById(parseInt(params.id, 10));
        const data: ContentRender = { mediaRes: result, idMedia: params.id };
        root.innerHTML = await updatePage.renderContent(data);
        updatePage.afterRender();
      },
      '/detail/:id': async () => {
        const detailPage = new TvShowsDetailsPage();
        const result = await mediaController.getMovieById(parseInt(params.id, 10));
        const data: ContentRender = { mediaRes: result, idMedia: params.id };
        root.innerHTML = await detailPage.renderContent(data);
        detailPage.afterRender();
      },
      '/movies': async () => {
        const moviePage = new MoviePage();
        const result = await mediaController.getMoviesByFilter('movies', page, limit);
        const data: ContentRender = { mediaRes: result.data, totalItems: result.totalItems };
        root.innerHTML = await moviePage.renderContent(data);
        moviePage.afterRender();
      },
      '/tvshows': async () => {
        const tvShowPage = new TvShowPage();
        const result = await mediaController.getMoviesByFilter('tv-shows', page, limit);
        const data: ContentRender = { mediaRes: result.data, totalItems: result.totalItems };
        root.innerHTML = await tvShowPage.renderContent(data);
        tvShowPage.afterRender();
      },
      '/error': async () => {
        const errorPage = new ErrorPage();
        root.innerHTML = await errorPage.renderContent();
        errorPage.afterRender();
      },
    };

    if (routeHandlers[route]) {
      await routeHandlers[route](params);
      document.title = title;
    } else {
      console.error(`Route ${route} not found.`);
    }
  }
}
