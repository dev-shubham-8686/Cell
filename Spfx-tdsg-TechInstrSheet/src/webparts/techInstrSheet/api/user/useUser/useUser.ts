import {useQuery} from "@tanstack/react-query";

import http from "../../http";
import { GET_LOGIN_SESSION, GET_USER } from "../../URLS";
import { IUser } from "../../interface";
import { create_UUID } from "../../utility/utility";
import  base64 from "react-native-base64";
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
  //debugger
  const response = await http.post<AuthResponse>(GET_LOGIN_SESSION, JSON.stringify(body));
  const data=response.data;
  
    //console.log(response.data);
   // eslint-disable-next-line require-atomic-updates
   http.defaults.headers.common.Authorization = data.Message;
   
  if (data.ResultType === 1) return true;
  return false;
};

const getUser = async (email: string) => {
  
  const res = await authenticateUser(email);
  if(res){
    
    const response = await http.get<IUser>(GET_USER, { params: { email } });
    return response.data;
  }
  return null;
};

const useUser = (email: string) =>
  useQuery({
    queryKey: ["get-user"],
    queryFn: () => getUser(email),
    enabled: !!email,  // Ensure the query only runs if an email is provided
    staleTime: 1000 * 60 * 10,  // Cache the result for 10 minutes (optional)
    cacheTime: 1000 * 60 * 30,  // Keep the data in cache for 30 minutes (optional)
  });


export default useUser;
