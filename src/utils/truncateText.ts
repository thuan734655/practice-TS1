import BoxFullText from '@/views/components/BoxFullText';

class TruncateText {
  public static render(text: string, maxLength: number, key?: string): string {
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    if (key) {
      return `
    ${text.slice(0, maxLength) + `... <span class="truncate-text-${key} truncate-see-more">See more</span>`}
   `;
    } else {
      return `
    ${text.slice(0, maxLength) + `...`}
   `;
    }
  }

  public static eventListener(element: string, fullText: string): void {
    const seeMoreElements = document.querySelector(`.${element}`);
    const boxFullTextElement = document.querySelector('.box-full-text');

    if (seeMoreElements && boxFullTextElement) {
      seeMoreElements.addEventListener('click', () => {
        boxFullTextElement.innerHTML = BoxFullText.render(fullText.replace(/\n/g, ' ')); // Xóa xuống dòng trước khi hiển thị
        (boxFullTextElement as HTMLElement).style.display = 'block';
        BoxFullText.eventListeners();
      });
    }
  }
}

export default TruncateText;
