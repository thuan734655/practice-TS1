export class Validate {
    public static validateEmail(email: string): boolean  {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email) ? false : true;
    }

    public static validatePassword(password: string): boolean  {
        return password.length >= 6 ? false : true;
    }

    public static validateName(name: string): boolean{
        return name.length > 0 ? false : true;
    }
}
