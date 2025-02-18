export class validateAdd {
  public static validateDateTvShow(first_air_date: Date, last_air_date: Date): boolean {
    if (!first_air_date || !last_air_date) return false;

    return first_air_date.getTime() <= last_air_date.getTime();
  }
}
