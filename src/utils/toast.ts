export enum ToastType {
    Success = 'success',
    Error = 'error',
}

export class Toast {
    private static createToast(message: string, type: ToastType): void {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    public static showSuccess(message: string): void {
        this.createToast(message, ToastType.Success);
    }

    public static showError(message: string): void {
        this.createToast(message, ToastType.Error);
    }
}
