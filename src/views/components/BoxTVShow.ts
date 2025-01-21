import { IMedia } from "@/models/mediaForm";
import formatDate from "@/utils/formatDate";

const loadBoxTVShow = (data: IMedia) => {

  const boxes = [
    {
      title: "Type",
      value: data.type,
    },
    {
      title: "Status",
      value: data.status,
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
      value: data.genres.join(", "),
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

export default loadBoxTVShow;
