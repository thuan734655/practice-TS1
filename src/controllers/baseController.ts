import { HomePage } from "@/views/page/homePage.ts";
import mediaController from "./mediaController.ts";
import { LoginPage } from "@/views/page/loginPage.ts";
import { AddPage } from "@/views/page/addPage.ts";
import { ContentRender } from "@/types/basePageTypes.ts";
import { UpdatePage } from "@/views/page/updatePage.ts";
import TvShowsDetailsPage from "@/views/page/detailPage.ts";
import { MoviePage } from "@/views/page/moivePage.ts";
import { TvShowPage } from "@/views/page/tvshowPage.ts";
import { ErrorPage } from "@/views/page/errorPage.ts";
import { Router } from "@/router/router.ts";

export class BaseController {
  /**
   * @description Handles routing based on the given route.
   * @param root - The DOM element where content will be rendered.
   * @param route - The current path.
   * @param params - Dynamic parameters extracted from the URL.
   * @param title - The title of the page.
   */
  public async handleRoute(
    root: HTMLElement,
    route: string,
    params: { [key: string]: string },
    title: string
  ): Promise<void> {
    const page = 1;
    const limit = 8;

    const routeHandlers: {
      [key: string]: (params: { [key: string]: string }) => Promise<void>;
    } = {
      "/home": async () => {
        const homePage = new HomePage();
        const result = await mediaController.getMovies({ page, limit });

        const data: ContentRender = {
          mediaRes: result.data,
          totalItems: result.totalItems,
        };
        root.innerHTML = homePage.renderContent(data);
        homePage.afterRender();
      },

      "/": async () => {
        const loginPage = new LoginPage();
        root.innerHTML = loginPage.renderContent();
        loginPage.afterRender();
      },

      "/login": async () => {
        const loginPage = new LoginPage();
        root.innerHTML = loginPage.renderContent();
        loginPage.afterRender();
      },

      "/add/:author": async () => {
        const addPage = new AddPage();
        const author = params.author;

        const result = await mediaController.getMovieByAuthor(author, {
          page,
          limit,
        });

        const data: ContentRender = {
          mediaRes: result.data,
          totalItems: result.totalItems ?? 0,
          author,
        };
        root.innerHTML = addPage.renderContent(data);

        addPage.afterRender();
      },

      "/update/:id": async () => {
        const updatePage = new UpdatePage();
        const id = parseInt(params.id, 10);
        const result = await mediaController.getMovieById(id);

        const data: ContentRender = { mediaRes: result, idMedia: id };
        root.innerHTML = updatePage.renderContent(data);
        updatePage.afterRender();

      },

      "/detail/:id": async () => {
        const detailPage = new TvShowsDetailsPage();
        const id = parseInt(params.id, 10);

        const result = await mediaController.getMovieById(id);

        const data: ContentRender = { mediaRes: result, idMedia: id };
        root.innerHTML = detailPage.renderContent(data);
        detailPage.afterRender();
      },

      "/movies": async () => {
        const moviePage = new MoviePage();
        const result = await mediaController.getMoviesByFilter("Movie", {
          page,
          limit,
        });
          const data: ContentRender = {
            mediaRes: result.data,
            totalItems: result.totalItems,
          };
          root.innerHTML = moviePage.renderContent(data);
          moviePage.afterRender();
      },

      "/tvshows": async () => {
        const tvShowPage = new TvShowPage();
        const result = await mediaController.getMoviesByFilter("TV Show", {
          page,
          limit,
        });

          const data: ContentRender = {
            mediaRes: result.data,
            totalItems: result.totalItems,
          };
          root.innerHTML = tvShowPage.renderContent(data);
          tvShowPage.afterRender();

      },

      "/error": async () => {
        const errorPage = new ErrorPage();
        root.innerHTML = errorPage.renderContent();
        errorPage.afterRender();
      },
    };

    if (routeHandlers[route]) {
      await routeHandlers[route](params);
      document.title = title;
    } else {
      console.error(`Route ${route} not found.`);
      Router.getInstance().navigateTo("/error");
    }
  }
}
