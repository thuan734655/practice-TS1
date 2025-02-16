import axios from "axios";
import { BASE_URL } from "@/constants/baseURL";
const configAxios = {
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosAPI = axios.create(configAxios);

axiosAPI.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosAPI;