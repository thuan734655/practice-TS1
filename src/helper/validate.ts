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
    public static validateName(name: string): string | null {
        return name.length > 0 ? null : 'Name is required';
    }
    

    // Validate both email and password
    public static validateCredentials(email: string, password: string, name?:string): string | null {
        const emailError = this.validateEmail(email);
        if (emailError) return emailError;

        const passwordError = this.validatePassword(password);
        if (passwordError) return passwordError;
        
        if (name !== undefined) {
            const nameError = this.validateName(name);
            if (nameError) return nameError;
        }

        return null; 
    }
}
