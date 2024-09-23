import axios from "axios";
import { Message, ServiceUrl, sessionExpiredStatus } from "../../GLOBAL_CONSTANT";
import { IAPIResponse } from "./interface";
import Dropdown from "./Dropdown";
import FormSubmission from "./FormSubmission";
import Identity from "./Identity";
import Attachment from "./Attachment";
import HistoryDetails from "./HistoryDetails";
import displayjsx from "../displayjsx";
import { redirectToHome } from "../utility";

export const AxiosInstance = axios.create({
  baseURL: ServiceUrl,
  headers: {
    "Content-Type": "application/json;odata=verbose",
  },
});

const displayError = (text: string) => Message.showError(text);

export const handleAPISuccess = async (
  response: IAPIResponse,
  showMessage: boolean = true
): Promise<boolean> => {
  
  
  if (response.status == 200) {
    if (showMessage) void displayjsx.showSuccess(response.data.Message);

    return true;
  }

  if (response.ResultType === 1) return true;

  if (response.NewId > 0) return true;

  void displayjsx.showErrorMsg(response.Message);


  return false;
};

export const handleAPIError = (error: any): void => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("response error", error.response);
      const status = error.response.status;
      if (status === 404) {
        void displayError("404: Not Found");
      } else if (status >= 500) {
        void displayError(`${status}: Something went wrong`);
      } else {
        void displayError(error.response.statusText);
      }
    } else if (error.request) {
      console.error("request error", error.request);
    } else throw error;
  } else {
    console.error("no axios error", error);
  }
};

export { Identity, Dropdown, FormSubmission, Attachment, HistoryDetails };

export default {
  Identity,
  Dropdown,
  FormSubmission,
  Attachment,
  HistoryDetails,
};
