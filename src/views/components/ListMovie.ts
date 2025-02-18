import { Router } from '@/router/router';
import { IMedia } from '../../models/mediaForm';
import { IcStar } from '../../resources/assets/icons';
import { getDataLocalStorage } from '@/utils/localStorage';
import { BASE_URL } from '@/constants/baseURL';
import TruncateText from '@/utils/truncateText';

class LoadMovies {
  public static render(media: IMedia[]): string {
    if (media.length == 0) {
      return `<p class = "add-err-load-media">No media found.</p>`;
    }
    return media
      .map(data => {
        return `
          <div class="list-movies-container" id="${data.id}" selected="true">
            <div class="list-movies-container--head">
              <div class="head-box">
                <img src="${IcStar}" alt="icon star">
                <p>${data.rating.toFixed(1)}</p>
              </div>
            </div>
            <div class="list-movies-container--body">
              <img src="${BASE_URL}${data.avatar}" alt="avatar">
            </div>
            <div class="list-movies-container--footer">
              <p>${TruncateText.render(data.movie_name, 25)}</p>
            </div>
            <div class="action-buttons" style="display: none;">
              <button class="btn-view" data-id="${data.id}">View Details</button>
              ${getDataLocalStorage('name') !== data.author ? '' : `<button class="btn-update" data-id="${data.id}">Update</button> <button class="btn-delete" data-id="${data.id}">Delete</button>`}
            </div>
          </div>
        `;
      })
      .join('');
  }

  public static attachEventListener(): void {
    const movieContainers = document.querySelectorAll('.list-movies-container');

    movieContainers.forEach(container => {
      const mediaId: number = parseInt(container.id, 10);

      container.addEventListener('mouseenter', () => {
        const actionButtons = container.querySelector('.action-buttons');
        if (actionButtons) {
          (actionButtons as HTMLElement).style.display = 'block';
        }
      });

      container.addEventListener('mouseleave', () => {
        const actionButtons = container.querySelector('.action-buttons');
        if (actionButtons) {
          (actionButtons as HTMLElement).style.display = 'none';
        }
      });

      const viewButton = container.querySelector('.btn-view');
      const updateButton = container.querySelector('.btn-update');

      viewButton?.addEventListener('click', () => {
        Router.getInstance().navigateTo(`/detail/${mediaId}`);
      });

      updateButton?.addEventListener('click', () => {
        Router.getInstance().navigateTo(`/update/${mediaId}`);
      });
    });
  }
}

export default LoadMovies;
