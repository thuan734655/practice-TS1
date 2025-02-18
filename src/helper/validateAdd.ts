export class validateAdd {
  public static validateDateTvShow(first_air_date: Date, last_air_date: Date): boolean {
    console.log(first_air_date, last_air_date);
    if (!first_air_date || !last_air_date) return false;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (first_air_date.getTime() > now.getTime() || last_air_date.getTime() > now.getTime()) {
      return false;
    }
    return first_air_date.getTime() <= last_air_date.getTime();
  }
}
