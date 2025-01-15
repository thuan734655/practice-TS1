export class Validate {
    // Validate email format
    public static validateEmail(email: string): string | null {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }
        return null;
    }

    // Validate password (at least 6 characters)
    public static validatePassword(password: string): string | null {
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return null;
    }

    // Validate both email and password
    public static validateCredentials(email: string, password: string): string | null {
        const emailError = this.validateEmail(email);
        if (emailError) return emailError;

        const passwordError = this.validatePassword(password);
        if (passwordError) return passwordError;

        return null; 
    }
}
