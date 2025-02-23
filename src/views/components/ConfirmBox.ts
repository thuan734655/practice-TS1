class ConfirmBox {
  public static render(title: string): string {
    return `
    <div class="confirm-box">
          <h3 class="confirm-title">${title}</h3>
        <div class="confirm-options">
          <button class="confirm-btn confirm-yes">Yes</button>
          <button class="confirm-btn confirm-no">No</button>
        </div>
    </div>

 `;
  }
}

export default ConfirmBox;
