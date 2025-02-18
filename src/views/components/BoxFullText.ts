class BoxFullText {
    public static render (content: string) {
        return `
        <p class = "box-full-text--close">X</p>
        <p class = "box-full-text--content">${content}</p>
        `;
    }
    public static eventListeners() {
        const closeBtn = document.querySelector('.box-full-text--close');
        const box = document.querySelector('.box-full-text');
        if(closeBtn && box) {
            closeBtn.addEventListener('click', () => {
                (box as HTMLElement).style.display = 'none';
            });
        }
    }
}

export default BoxFullText
