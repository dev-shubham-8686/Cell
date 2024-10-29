import { useQuery } from "@tanstack/react-query";
import { create_UUID } from "../../utils/utility";
import { GET_LOGIN_SESSION } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";

export interface AuthResponse {
  Message: string;
  Status: boolean;
  Type: string;
  RequestId: number;
  Data: string;
  ResultType: number;
}

export interface IUser {
  EmployeeId: number;
  EmployeeCode: string;
  Email: string;
  EmployeeName: string;
  DepartmentName: string;
  DivisionName: string;
}

const authenticateUser = async (email: string): Promise<boolean> => {
  const number = create_UUID();

  const token = {
    EmailId: email,
    TenentID: "eb313930-c5da-40a3-a0f1-d2e000335fb",
    APIKeyId: btoa(number.toString()),
  };

  const body = {
    parameter: btoa(JSON.stringify(token)),
    //type: "MATERIALCONSUMPTION",
  }
  const response = await apiClient.post<AuthResponse>(GET_LOGIN_SESSION, JSON.stringify(body));
  const data = response.data;
  console.log(response.data, apiClient.defaults.headers)
  // eslint-disable-next-line require-atomic-updates
  apiClient.defaults.headers.common.Authorization = data.Message;

  if (data.ResultType === 1) return true;
  return false;
};

const getUser = async (email: string) => {
  console.log(email)
  await authenticateUser(email);
  // if(res){

  //   const response = await apiClient.get<IUser>(GET_USER, { params: { email } });
  //   return response.data;
  // }
  // return null;
  
};

const useUser = (email: string) => {
  return useQuery(
    ["get-user"],
    () => getUser(email),
  )
};

export default useUser;
