import axios from "axios"

// import UOMType from "../Handler/Uom"
import { Message, ServiceUrl } from "../GLOBAL_CONSTANT"
export const AxiosInstance = axios.create({
  baseURL: ServiceUrl,
  headers: {
    "Content-Type": "application/json;odata=verbose",
  },
})

const displayError = (text: string) => Message.showError(text)

export const handleAPISuccess = (response:any): boolean => {
  if (response.Status) return true

 void  displayError(response.Message);
  return false
}

export const handleAPIError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("response error", error.response)
      const status = error.response.status
      if (status === 404) {
        // displayError("404: Not Found")
      } else if (status >= 500) {
        // displayError(`${status}: Something went wrong`)
      } else {
        // displayError(error.response.statusText)
      }
    } else if (error.request) {
      console.error("request error", error.request)
    } else throw error
  } else {
    console.error("no axios error", error)
  }
}

export default {
// UOMType

}
export {
  // UOMType
}
