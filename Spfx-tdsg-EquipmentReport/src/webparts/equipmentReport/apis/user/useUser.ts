import { useQuery } from "@tanstack/react-query";

import base64 from "react-native-base64";
import http from "../../http";
import { GET_LOGIN_SESSION, GET_USER } from "../../URLs";
import { create_UUID } from "../../utility/utility";


export interface AuthResponse {
    Message: string;
    Status: boolean;
    Type: string;
    RequestId: number;
    Data: string;
    ResultType: number;
  }

  export interface IUser {
    employeeId: number;
    departmentId: number;
    departmentName: string;
    divisionId: number;
    divisionName: string;
    employeeCode: number;
    employeeName: string;
    email: string;
    empDesignation: string;
    mobileNo: string;
    departmentHeadEmpId: number;
    divisionHeadEmpId: number;
    costCenter: string;
    cMRoleId: number;
    isDivHeadUser: boolean;
    isAdmin: boolean;
    isAdminId: number;
  }
  
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
    type: "Equipment",
  }
  const response = await http.post<AuthResponse>(GET_LOGIN_SESSION, JSON.stringify(body));
  const data=response.data;
  
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
  useQuery<IUser>({
    queryKey: ["get-user"],
    queryFn: () => getUser(email),
  });

export default useUser;
