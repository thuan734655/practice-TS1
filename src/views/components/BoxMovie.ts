import { IMedia } from "@/types/mediaForm";
import formatDate from "@/utils/formatDate";
import TruncateText from "@/utils/truncateText";
class BoxMovie {
  static render = (data: IMedia) => {

    const boxes = [
      {
        title: "Type",
        value: data.type,
      },
      {
          className: "box-release-date",
          title: "Release Date",
          value: formatDate(data.release_date)
            
      },
      {
          title: "Run Time",
          value: data.episode_run_time || "N/A",
      },
      {
        title: "Genres",
        value: TruncateText.render(data.genres.join(", "),40,"Genres"),
      },
    ];
  
    return boxes
      .map(
        (box) => `
        <div class="body-box-movie">
          <div class="box-title">${box.title}</div>
          <div class="box-value">${box.value}</div>
        </div>
      `
      )
      .join("");
  };
  
}
export default BoxMovie;
