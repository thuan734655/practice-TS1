import { IMedia } from "@/models/mediaForm";

class UpdateForm {
    public static render(video: Partial<IMedia>): string {
        const fieldConfigs: Record<string, any> = {
            movie_name: { label: "Movie Name", type: "text", placeholder: "Enter movie name", maxlength: 255, required: true },
            description: { label: "Description", type: "textarea", placeholder: "Enter video description", required: true },
            rating: { label: "Rating", type: "number", placeholder: "Rate from 0 to 10", max: 10, step: 0.1, required: true },
            avatar: { label: "Avatar", type: "file", accept: "image/*" },
            background: { label: "Background", type: "file", accept: "image/*" },
            release_date: { label: "Release Date", type: "date", required: true },
            episode_run_time: { label: "Episode Run Time", type: "text", placeholder: "Enter run time (e.g., 1h 30m)", maxlength: 50, required: true },
            genres: { label: "Genres", type: "text", placeholder: "Enter genres (comma separated)", maxlength: 500, required: true },
            status: { label: "Status", type: "text", placeholder: "Enter video status", maxlength: 500, required: true },
            last_air_date: { label: "Last Air Date", type: "date", required: true },
            first_air_date: { label: "First Air Date", type: "date", required: true },
            number_of_episodes: { label: "Number of Episodes", type: "number", placeholder: "Enter number of episodes", required: true },
            number_of_seasons: { label: "Number of Seasons", type: "number", placeholder: "Enter number of seasons", required: true }
        };

        const formFields = Object.entries(fieldConfigs).map(([key, config]) => {
            if (!(key in video)) return "";

            const value = video[key as keyof IMedia];
            const formattedValue =
                value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : Array.isArray(value)
                    ? value.join(", ")
                    : value ?? "";

       
            if (config.type === "textarea") {
                return `
                    <div class="form-group">
                        <label for="${key}">${config.label}:</label>
                        <textarea id="${key}" name="${key}" ${config.required ? "required" : ""} ${config.maxlength ? `maxlength="${config.maxlength}"` : ""} placeholder="${config.placeholder || ""}">${formattedValue}</textarea>
                    </div>
                `;
            }

            return `
                <div class="form-group">
                    <label for="${key}">${config.label}:</label>
                    <input 
                        type="${config.type}" 
                        id="${key}" 
                        name="${key}" 
                        ${config.required ? "required" : ""} 
                        ${config.placeholder ? `placeholder="${config.placeholder}"` : ""} 
                        ${config.maxlength ? `maxlength="${config.maxlength}"` : ""} 
                        ${config.accept ? `accept="${config.accept}"` : ""} 
                        ${config.step ? `step="${config.step}"` : ""} 
                        ${config.max ? `max="${config.max}"` : ""} 
                        value="${formattedValue}"
                    >
                </div>
            `;
        }).join("");

        return `
            <form id="update-feature-form" enctype="multipart/form-data">
                ${formFields}
                <button type="submit" class="btn-update-video">Update Video</button>
            </form>

        `;
    }
}

export default UpdateForm;
