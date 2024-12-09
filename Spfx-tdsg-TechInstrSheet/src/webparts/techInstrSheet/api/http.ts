import axios from "axios";

import { SERVICE_URL } from "../GLOBAL_CONSTANT";
import { ICustomAxiosConfig } from "../../techInstrSheet/api/interface";
import { showErrorNotification, showSuccessNotification } from "../../techInstrSheet/api/notification";

const http = axios.create({
  baseURL: SERVICE_URL,
  timeout: 3500000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (res) => {
    //debugger
    const config: ICustomAxiosConfig = res.config;
    if (config.SHOW_NOTIFICATION && res.data.Message) {
      showSuccessNotification(res.data.Message);
    }

    return res;
  },
  (res) => {
    
    const config: ICustomAxiosConfig = res.config;
    if ((config.SHOW_NOTIFICATION??true) && res.response?.data?.Message) {
      showErrorNotification(res.response?.data?.Message);
    }
  }
);

export default http;
   