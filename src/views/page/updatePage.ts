import { BasePage } from './basePage.ts';
import UpdateForm from '../components/UpdateForm.ts';
import { ContentRender } from '@/types/basePageTypes.ts';
import Header from '../components/Header.ts';
import mediaController from '@/controllers/mediaController.ts';
import { BASE_URL } from '@/constants/baseURL.ts';
import { IMedia } from '@/types/mediaForm.ts';
import { buildFormData } from '@/helper/formHelper.ts';
import { Toast } from '@/utils/toast.ts';
import { Router } from '@/router/router.ts';
import { getDataLocalStorage } from '@/utils/localStorage.ts';
import ConfirmBox from '../components/ConfirmBox.ts';

export class UpdatePage extends BasePage {
  constructor() {
    super();
  }

  public renderContent(data: ContentRender): string {
    const media = data.mediaRes as IMedia;

    this.setState<IMedia>('mediaRes', media);
    this.setState<number>('idMedia', data.idMedia as number);
    this.setState<boolean>('isConfirmBoxShow', true);
    this.setState<string>('titleConfirm', 'Are you sure you want to update?');

    return `
            ${Header.render()}
            <section class="update-page">
                <section class="box-image">
                    <figure class="image-container">
                      <img src="${BASE_URL}${media.avatar}" alt="media avatar" class="image-preview" />
                      <figcaption>Avatar</figcaption>
                    </figure>
                    <figure class="image-container">
                      <img src="${BASE_URL}${media.background}" alt="media background" class="image-preview" />
                      <figcaption>Background</figcaption>
                    </figure>
                </section>
                <div class="update-form-container">
                    ${UpdateForm.render(media)}
                </div>
            </section>
             <div class="confirm-container"></div>
        `;
  }

  public afterRender(): void {
    this.attachSubmitEventListener();
    this.attachBackEventListener();
  }
  private attachBackEventListener(): void {
    const backButton = document.querySelector('.btn-back');
    if (backButton) {
      backButton.addEventListener('click', () => {
        Router.getInstance().navigateTo(`/add/${getDataLocalStorage('name')}`);
      });
    }
  }

  private attachSubmitEventListener(): void {
    const form = document.getElementById('update-feature-form') as HTMLFormElement;
    const media = this.getState<IMedia>('mediaRes');
    if (form && media) {
      form.addEventListener('submit', async event => {
        event.preventDefault();

        const isConfirmBoxVisible = this.toggleConfirmBox(this.getState<boolean>('isConfirmBoxShow'), this.getState<string>('titleConfirm'));
        this.setState<boolean>('isConfirmBoxShow', isConfirmBoxVisible);

        const updateConfirm = await this.confirmAction();
        if (updateConfirm) {
          const formData = buildFormData(form);

          Object.keys(media).forEach(key => {
            if (media[key as keyof IMedia] == formData.get(key)) {
              formData.delete(key);
            }
          });
          
          let isEmpty = false;
          formData.forEach((vale, key) => {
            console.log(vale, key);
            isEmpty = true;
          });

          isEmpty ? this.updateMediaData(formData, media) : Toast.showError('Nothing to update');
        }

        this.setState<boolean>('isConfirmBoxShow', this.toggleConfirmBox(this.getState<boolean>('isConfirmBoxShow')));
      });
    }
  }

  private async updateMediaData(formData: FormData, media: IMedia): Promise<void> {
    const idMedia = this.getState<number>('idMedia');
    const mediaRes = this.getState<IMedia>('mediaRes');
    if (idMedia && mediaRes) {
      const result = await mediaController.updateMovie(idMedia, formData, media);

      if (result == null) return;

      if (!result) {
        const resetData: ContentRender = {
          mediaRes: mediaRes,
          idMedia: idMedia,
        };
        this.renderContent(resetData);
        Toast.showError('Failed to update');
        return;
      } else {
        Toast.showSuccess('Updated successfully');
        Router.getInstance().navigateTo(`/add/${getDataLocalStorage('name')}`);
      }
    }
  }
  private confirmAction(): Promise<boolean> {
    const btnYes = document.querySelector('.confirm-yes') as HTMLButtonElement;
    const btnNo = document.querySelector('.confirm-no') as HTMLButtonElement;

    return new Promise(resolve => {
      btnYes.addEventListener('click', () => resolve(true));
      btnNo.addEventListener('click', () => resolve(false));
    });
  }
  private toggleConfirmBox(isConfirmBoxShow: boolean, titleConfirm?: string): boolean {
    const confirmContainer = document.querySelector('.confirm-container') as HTMLDivElement;

    if (isConfirmBoxShow && titleConfirm) {
      confirmContainer.innerHTML = ConfirmBox.render(titleConfirm);
    } else {
      confirmContainer.innerHTML = '';
    }
    return !isConfirmBoxShow;
  }
}
