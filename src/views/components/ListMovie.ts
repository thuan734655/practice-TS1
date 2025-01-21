import { Router } from '@/router/router';
import { IMedia } from '../../models/mediaForm';
import { IcStar } from '../../resources/assets/icons';
import mediaController from '@/controllers/mediaController';
import { Toast } from '@/utils/toast';

class LoadMovies {
  public static render(media: IMedia[]): string {
    return media
      .map((data) => {
        return `
          <div class="list-movies-container" id="${data.id}" selected="true">
            <div class="list-movies-container--head">
              <div class="head-box">
                <img src="${IcStar}" alt="icon star">
                <p>${data.rating.toFixed(1)}</p>
              </div>
            </div>
            <div class="list-movies-container--body">
              <img src="http://localhost:5001/${data.avatar}" alt="avatar">
            </div>
            <div class="list-movies-container--footer">
              <p>${data.movie_name}</p>
            </div>
            <div class="action-buttons" style="display: none;">
              <button class="btn-view" data-id="${data.id}">View Details</button>
              <button class="btn-edit" data-id="${data.id}">Update</button>
              <button class="btn-delete" data-id="${data.id}">Delete</button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  public static event(): void {
    const movieContainers = document.querySelectorAll('.list-movies-container');

    movieContainers.forEach((container) => {

      const mediaId : number = parseInt(container.id ,10);
      
      container.addEventListener('mouseenter', () => {
        const actionButtons = container.querySelector('.action-buttons') as HTMLElement;
        if (actionButtons) {
          actionButtons.style.display = 'block';
        }
      });

      
      container.addEventListener('mouseleave', () => {
        const actionButtons = container.querySelector('.action-buttons') as HTMLElement;
        if (actionButtons) {
          actionButtons.style.display = 'none'; 
        }
      });

     
      const viewButton = container.querySelector('.btn-view') as HTMLButtonElement;
      const editButton = container.querySelector('.btn-edit') as HTMLButtonElement;
      const deleteButton = container.querySelector('.btn-delete') as HTMLButtonElement;

     
      viewButton?.addEventListener('click', () => {
        Router.getInstance().navigateTo("/view-detail");
      });

      
      editButton?.addEventListener('click', () => {
        Router.getInstance().navigateTo("/edit");
      });

      let removedElement: HTMLElement | null = null;

      deleteButton?.addEventListener('click', async () => {
        const result: boolean = await mediaController.deleteMovie(mediaId);
      
        removedElement = container.cloneNode(true) as HTMLElement;
      
        container.remove();
        if(result) {
          Toast.showSuccess("Media has been deleted successfully")
        } else {
          Toast.showError("Failed to delete media")
          restoreRemovedElement();
        }
      });
      
      function restoreRemovedElement() {
        if (removedElement) {
          document.body.appendChild(removedElement);
          removedElement = null;
        }
      }
      
    });
  }
}

export default LoadMovies;
