class ValidateAuth {
    public static validatePassword(password: string): string {
        if (password.length < 6) return "At least 6 characters.";
        if (!/[A-Z]/.test(password)) return "Include an uppercase letter.";
        if (!/[a-z]/.test(password)) return "Include a lowercase letter.";
        if (!/\d/.test(password)) return "Include a number.";
        if (!/[@$!%*?&]/.test(password)) return "Include a special character.";
        return "";
    }
}

export default ValidateAuth;