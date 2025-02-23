export class validateAdd {
  public static validateDateTvShow(first_air_date: Date, last_air_date: Date): string {
    console.log(typeof first_air_date, typeof last_air_date);
    if (first_air_date.getTime() > last_air_date.getTime()) return 'First air date must be before last air date.';

    return '';
  }
  public static validateImageFile(file: File): string {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.';
    }

    return '';
  }
}
