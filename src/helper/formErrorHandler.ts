export const showError = (inputName: string) => {
    const errorElement = document.querySelector(`#error-${inputName}`) as HTMLParagraphElement;
    console.log(errorElement)
    if (errorElement) {
      errorElement.style.visibility = "visible";
    }
  }

export const clearError = (inputName: string) => {
    const errorElement = document.querySelector(`#error-${inputName}`) as HTMLParagraphElement;
    if (errorElement) {
      errorElement.style.visibility = "hidden";
    }
  }
