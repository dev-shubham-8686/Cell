import axios from "axios";

import { SERVICE_URL } from "./GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "./interface";
import { showErrorMsg, showSuccess } from "./utils/displayjsx";

const http = axios.create({
  baseURL: SERVICE_URL,
  timeout: 3500000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (res) => {
    
    const config: ICustomAxiosConfig = res.config;
    if (config.SHOW_NOTIFICATION && res.data.Message) {
      void showSuccess(res?.data?.ReturnValue?.Message);
    }

    return res;
  },
  (res) => {
    
    const config: ICustomAxiosConfig = res.config;
    if ((config.SHOW_NOTIFICATION??true) && res.response?.data?.Message) {
      void showErrorMsg(res.response?.data?.ReturnValue?.Message);
    }
  }
);

export default http;
   