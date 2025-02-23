import mediaController from '@/controllers/mediaController';
import { IMedia } from '@/types/mediaForm';
import { Toast } from '@/utils/toast';
import ConfirmBox from './ConfirmBox';

class DeleteMedia {
  public static async deleteMedia(deleteButton: HTMLButtonElement, container: HTMLElement, media: IMedia[]): Promise<IMedia[]> {
    const mediaId = deleteButton.getAttribute('data-id');
    if (!mediaId) return media;

    const result: boolean = await mediaController.deleteMovie(parseInt(mediaId, 10));

    if (result) {
      container.remove();
      const updatedMedia = media.filter(item => item.id !== parseInt(mediaId, 10));

      Toast.showSuccess('Media has been deleted successfully');
      return updatedMedia;
    } else {
      Toast.showError('Failed to delete media');
      return media;
    }
  }
  public static confirmAction(): Promise<boolean> {
    const btnYes = document.querySelector('.confirm-yes') as HTMLButtonElement;
    const btnNo = document.querySelector('.confirm-no') as HTMLButtonElement;

    return new Promise(resolve => {
      btnYes.addEventListener('click', () => {
        return resolve(true);
      });

      btnNo.addEventListener('click', () => {
        return resolve(false);
      });
    });
  }
  public static toggleConfirmBox(isConfirmBoxShow: boolean, titleConfirm?: string): boolean {
    const confirmContainer = document.querySelector('.confirm-container') as HTMLButtonElement;
console.log(confirmContainer);
    (isConfirmBoxShow && titleConfirm) ? (confirmContainer.innerHTML = ConfirmBox.render(titleConfirm)) : (confirmContainer.innerHTML = '');
    return !isConfirmBoxShow;
  }
}

export default DeleteMedia;
