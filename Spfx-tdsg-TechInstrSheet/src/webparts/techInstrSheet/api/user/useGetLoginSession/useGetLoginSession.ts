
import http from "../../http";
import { GET_LOGIN_SESSION } from "../../URLS";
import { useMutation } from "@tanstack/react-query";


export type IAuthenticateUserParam = {
    parameter: string;
    type: string;
  };
  export interface AuthResponse {
    Message: string;
    Status: boolean;
    Type: string;
    RequestId: number;
    Data: string;
    ResultType: number;
  }
const getLoginSession = async (body: IAuthenticateUserParam) => {
  
  const response = await http.post<AuthResponse>(GET_LOGIN_SESSION, JSON.stringify(body));
  const data=response.data;
  
  // eslint-disable-next-line require-atomic-updates
  http.defaults.headers.common.Authorization = data.Message;

  return  data;
};

const useGetLoginSession = () =>
    useMutation<any, null, IAuthenticateUserParam>({
        mutationKey: ["get-login-session"],
        mutationFn: getLoginSession,
      });

export default useGetLoginSession;
