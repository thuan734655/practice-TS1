import { IMedia } from "@/types/mediaForm";
import formatDate from "@/utils/formatDate";
import TruncateText from "@/utils/truncateText";

class BoxTVShow {
  static render = (data: IMedia) => {

    const boxes = [
      {
        title: "Type",
        value: data.type,
      },
      {
        title: "Status",
        value: TruncateText.render(data.status,100,"Status"),
      },
      {
        title: "First air date",
        value: formatDate(data.first_air_date),
      },
      {
        title: "Last air date",
        value: formatDate(data.last_air_date),
      },
      {
        title: "Seasons",
        value: data.number_of_seasons ? `${data.number_of_seasons}` : "N/A",
      },
      {
        title: "Episodes",
        value: data.number_of_episodes ? `${data.number_of_episodes}` : "N/A",
      },
      {
        title: "Run Time",
        value: data.episode_run_time || "N/A",
      },
      {
        title: "Genres",
        value: TruncateText.render(data.genres.join(", "),100,"Genres"),
      },
    ];
  
    return boxes
      .map(
        (box) => `
        <div class="body-box-tvshow">
          <div class="box-title">${box.title}</div>
          <div class="box-value">${box.value}</div>
        </div>
      `
      )
      .join("");
  };
}

export default BoxTVShow;
