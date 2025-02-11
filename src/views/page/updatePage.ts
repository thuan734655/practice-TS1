import { BasePage } from './basePage.ts';
import UpdateForm from '../components/UpdateForm.ts';
import { ContentRender } from '@/types/basePageTypes.ts';
import Header from '../components/Header.ts';
import mediaController from '@/controllers/mediaController.ts';
import { BASE_URL } from '@/constants/baseURL.ts';
import { IMedia } from '@/types/mediaForm.ts';

export class UpdatePage extends BasePage {
    constructor() {
        super();
        this.setState<string[]>("array", []);
        this.setState<Date[]>("Date", []);
        this.setState<File[]>("File",[]);
        this.setState<number[]>("number",[]);

    }

    public  renderContent(data: ContentRender): string {
        this.setState<IMedia>("mediaRes", data.mediaRes as IMedia);
        this.setState<number>("idMedia", data.idMedia as number);
        const media = data.mediaRes as IMedia;
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
        this.attachEventListeners();
    }

    public attachEventListeners(): void {
        this.attachSubmitEventListener();
        this.attachOnChangeEventListener();
    }

    public attachSubmitEventListener(): void {
        const form = document.getElementById('update-feature-form') as HTMLFormElement;
        
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); 
    
                const updatedData = this.getState<IMedia>('updatedData');
                const oldData = this.getState<IMedia>('mediaRes');
                
                const formData = new FormData();
                
                if (updatedData && oldData) {
                  Object.entries(updatedData).forEach(([key, newValue]) => {
                    const typedKey = key as keyof IMedia;
                    const oldValue = oldData[typedKey];
                
                    if (newValue !== undefined && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                      if ( newValue instanceof File) {
                          formData.append(key, newValue);
                      } else {
                          formData.append(key, newValue.toString());
                      }
                      
                    }
                  });

                  formData.forEach((value, key) => {
                    console.log(`FormData - ${key}:`, value);
                  });
                }
                    this.updateMediaData(formData);
            });
        }
    }

    public attachOnChangeEventListener(): void {
        const form = document.getElementById('update-feature-form') as HTMLFormElement;
        
        if (form) {
            form.querySelectorAll('input, textarea, select').forEach((input) => {
                input.addEventListener('change', (event) => {
                    const target = event.target as HTMLInputElement;
                    const key = target.name;
                    const value = target.type === 'file' ? target.files : target.value;

                    const updatedData = { ...this.getState<IMedia>('updatedData') };
                    updatedData[key] = value;
                    this.setState({ updatedData });

                    console.log('Updated data:', updatedData);
                });
            });
        }
    }

    private async updateMediaData(formData: FormData): Promise<any> {
        try {
           const result = await mediaController.updateMovie(this.getState("idMedia"), formData);

           if (!result) {
            const resetData: ContentRender = { mediaRes: this.getState("mediaRes") }
             this.renderContent(resetData);
             return;
           }
           
        } catch (error) {
            console.error('Error updating media data:', error);
        }
    }
}
