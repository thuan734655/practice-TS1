import axiosAPI from "@/api/configAxios";
import { dataLogin } from "../types/login";

class AuthModel {
    public static async login(dataLogin: dataLogin) {
     try {
        const response = await  axiosAPI.post("/login", {email: dataLogin.email, password: dataLogin.password});
        if(response) {
          return response.data;
        }
     }catch (err) {
         console.error('Error during login:', err);
         throw err; 
     }
    }
}

export default AuthModel;
