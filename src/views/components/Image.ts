interface ImageLink {
  srcImg: string;
  caption?: string;
  alt: string;
  link?: string;
}

export class ImageComponent {
  public render(images: ImageLink[], withLink: boolean = false): string {
    return images.map(image => {
      const imageHtml = `
        <img src="${image.srcImg}" alt="${image.alt}">
        ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}
      `;

      if (withLink && image.link) {
        return `
          <figure>
            <a href="${image.link}">
              ${imageHtml}
            </a>
          </figure>
        `;
      }

      return `<figure>${imageHtml}</figure>`;
    }).join('');
  }
}
