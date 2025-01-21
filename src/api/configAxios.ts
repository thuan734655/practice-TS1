import axios from "axios";

const configAxios = {
  baseURL: "https://practice-ts-server.onrender.com/api",
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