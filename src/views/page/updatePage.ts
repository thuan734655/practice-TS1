import { BasePage } from './basePage.ts';
import UpdateForm from '../components/UpdateForm.ts';
import { ContentRender } from '@/types/general.ts';
import Header from '../components/Header.ts';
import mediaController from '@/controllers/mediaController.ts';

export class UpdatePage extends BasePage {
    constructor() {
        super();
        this.state = {
            mediaRes: [],
            idMedia: "", 
        };
    }

    public async renderContent(data: ContentRender): Promise<string> {
        this.setState({ mediaRes: data?.mediaRes, idMedia: data?.idMedia });
        console.log(data);
        if (!this.getState("mediaRes")) {
            return '<div>No media found to update</div>';
        }

        const avatar = this.getState('mediaRes').avatar || '';
        const background = this.getState('mediaRes').background || '';

        return `
            ${Header.render()}
            <section class="update-page">
                <section class="box-image">
                    <figure class="image-container">
                      <img src="https://practice-ts-server.onrender.com/${avatar}" alt="media avatar" class="image-preview" />
                      <figcaption>Avatar</figcaption>
                    </figure>
                    <figure class="image-container">
                      <img src="https://practice-ts-server.onrender.com/${background}" alt="media background" class="image-preview" />
                      <figcaption>Background</figcaption>
                    </figure>
                </section>
                <div class="update-form-container">
                    ${UpdateForm.render(this.getState("mediaRes"))}
                </div>
            </section>
        `;
    }

    public afterRender(): void {
        this.attachEventListeners(); // Gọi phương thức attachEventListeners để đăng ký sự kiện
    }

    public attachEventListeners(): void {
        // Kết hợp các phương thức đăng ký sự kiện ở đây
        this.attachSubmitEventListener();
        this.attachOnChangeEventListener();
    }

    public attachSubmitEventListener(): void {
        const form = document.getElementById('update-feature-form') as HTMLFormElement;
        
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); 
    
                const updatedData = this.getState('updatedData');
                const oldData = this.getState('mediaRes');
    
                const formData = new FormData();
    
                for (const key in updatedData) {
                    if (updatedData[key] !== oldData[key]) {
                        const value = updatedData[key];
    
                        if (value instanceof FileList) {
                            for (let i = 0; i < value.length; i++) {
                                formData.append(key, value[i]);
                            }
                        } else {
                            formData.append(key, value);
                        }
                    }
                }
    
                if (formData.entries().next().done) {
                    console.log('No changes to update.');
                    return;
                }
    
                try {
                    this.updateMediaData(formData);
                } catch (error) {
                    console.error('Error updating media:', error);
                }
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

                    const updatedData = { ...this.getState('updatedData') };
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
