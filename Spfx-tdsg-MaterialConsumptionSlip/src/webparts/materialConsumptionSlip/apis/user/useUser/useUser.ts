import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_LOGIN_SESSION, GET_USER } from "../../../URLS";
import { IUser } from "../../../interface";
import { create_UUID } from "../../../utility/utility";
import base64 from "react-native-base64";
import { AuthResponse } from "../useGetLoginSession/useGetLoginSession";


const authenticateUser = async (email: string): Promise<boolean> => {
  const number = create_UUID();
  
  const token = {
    // EmailId: "Vishal.Trivedi001@tdsgj.co.in",   //TODO: update before deployment
    EmailId: email,
    TenentID: "eb313930-c5da-40a3-a0f1-d2e000335fb",
    APIKeyId: base64.encode(number.toString()),
  };
  
  const body={
    parameter: base64.encode(JSON.stringify(token)),
    type: "MATERIALCONSUMPTION",
  }
  const response = await http.post<AuthResponse>(GET_LOGIN_SESSION, JSON.stringify(body));
  const data=response.data;
  
   // eslint-disable-next-line require-atomic-updates
   http.defaults.headers.common.Authorization = data.Message;
   
  if (data.ResultType === 1) return true;
  return false;
};


const MCSAdminFormatter = (user: IUser): IUser => {
  if (user.isMCSAdmin) {
    user.isAdmin = true; // Set isAdmin to true if isMCSAdmin is true
  }
  return user;
};

const getUser = async (email: string) => {
  
  const res = await authenticateUser(email);
  if(res){
    
    const response = await http.get<IUser>(GET_USER, { params: { email } });

        // Format the response using MCSAdminFormatter
        const formattedUser = MCSAdminFormatter(response.data);
        
        return formattedUser;
  }
  return null;
};

const useUser = (email: string) =>
  useQuery<IUser>({
    queryKey: ["get-user"],
    queryFn: () => getUser(email),
  });

export default useUser;
