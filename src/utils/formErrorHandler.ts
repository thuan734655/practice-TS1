export const showError = (inputName: string) => {
  const errorElement = document.querySelector(`#error-${inputName}`);
  console.log(errorElement, `#error-${inputName}`);
  if (errorElement) {
    (errorElement as HTMLParagraphElement).style.visibility = 'visible';
  }
};
export const showErrorAndEditText = (inputName: string, textError: string) => {
  const errorElement = document.querySelector(`#error-${inputName}`);
  console.log(errorElement, `#error-${inputName}`);
  if (errorElement) {
    (errorElement as HTMLParagraphElement).textContent = textError;
    (errorElement as HTMLParagraphElement).style.visibility = 'visible';
  }
};

export const clearError = (inputName: string) => {
  const errorElement = document.querySelector(`#error-${inputName}`);
  if (errorElement) {
    (errorElement as HTMLParagraphElement).style.visibility = 'hidden';
  }
};
