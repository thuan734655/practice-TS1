import axiosAPI from "@/api/configAxios";
import { dataLogin, dataRegister } from "../types/login";
import { Toast } from "@/utils/toast";

class UserModel {
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
    public static async register(dataRegister: dataRegister) {
      try {
        const response = await axiosAPI.post('/register', dataRegister);
        return response.data;
      } catch (err: any) {
        if (err.response) {
          Toast.showError(err.response.data.message)
        }
      }
}
}

export default UserModel;
