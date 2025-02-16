import { BasePage } from "./basePage.ts";
import UpdateForm from "../components/UpdateForm.ts";
import { ContentRender } from "@/types/basePageTypes.ts";
import Header from "../components/Header.ts";
import mediaController from "@/controllers/mediaController.ts";
import { BASE_URL } from "@/constants/baseURL.ts";
import { IMedia } from "@/types/mediaForm.ts";
import { buildFormData } from "@/helper/formHelper.ts";
import { Toast } from "@/utils/toast.ts";

export class UpdatePage extends BasePage {
  constructor() {
    super();
  }

  public renderContent(data: ContentRender): string {
    this.setState<IMedia>("mediaRes", data.mediaRes as IMedia);
    this.setState<number>("idMedia", data.idMedia as number);
    const media = data.mediaRes as IMedia;

    Object.keys(media).forEach((key) => {
      this.setState(key, media[key as keyof IMedia]);
    });

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
        `;
  }
  public afterRender(): void {
    this.attachSubmitEventListener();
  }

  public attachSubmitEventListener(): void {
    const form = document.getElementById(
      "update-feature-form"
    ) as HTMLFormElement;
    const media = this.getState<IMedia>("mediaRes");
    if (form && media) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = buildFormData(form);

        Object.keys(media).forEach((key) => {
          if (this.getState(key) == formData.get(key)) {
            formData.delete(key);
          }
        });
        this.updateMediaData(formData);
      });
    }
  }

  private async updateMediaData(formData: FormData): Promise<void> {
    const idMedia = this.getState<number>("idMedia");
    const mediaRes = this.getState<IMedia>("mediaRes");
    if(idMedia && mediaRes) {
        const result = await mediaController.updateMovie(idMedia, formData);

        if (!result) {
          const resetData: ContentRender = {
            mediaRes: mediaRes,
          };
          this.renderContent(resetData);
          return;
        }
        else {
            Toast.showSuccess("Updated successfully");
            const dataUpdate = result; 
            formData.forEach((_, key) => { 
                if ( key == "avatar") {
                const imageElement = document.querySelector<HTMLImageElement>('img[alt="media avatar"]');
                
                if(imageElement) {
                    imageElement.src = `${BASE_URL}${dataUpdate.avatar}`;
                }
              } else if(key == "background") {
                const imageElement = document.querySelector<HTMLImageElement>('img[alt="media background"]');
                
                if(imageElement) {
                    imageElement.src = `${BASE_URL}${dataUpdate.background}`;
                }
              }
            });
          }
    }
  }
}
