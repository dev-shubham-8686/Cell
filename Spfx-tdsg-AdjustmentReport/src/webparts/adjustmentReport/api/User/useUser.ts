import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { create_UUID } from "../../utils/utility";
import { GET_LOGIN_SESSION, GET_USER } from "../../GLOBAL_CONSTANT";
import apiClient from "../../utils/axiosInstance";
import { IAjaxResult } from "../DeleteAdjustmentReport.api";

export interface AuthResponse {
  Message: string;
  StatusCode: string;
  Type: string;
  ReturnValue: object;
  Data: string;
  ResultType: number;
}

// export interface IUser {
//   EmployeeId: number;
//   EmployeeCode: string;
//   Email: string;
//   EmployeeName: string;
//   DepartmentName: string;
//   DivisionName: string;
//   IsAdmin: number;
// }

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
    EmailId: email,
    TenentID: "eb313930-c5da-40a3-a0f1-d2e000335fb",
    APIKeyId: btoa(number.toString()),
  };

  const body = {
    parameter: btoa(JSON.stringify(token)),
    type: "MATERIALCONSUMPTION",
  }
  const response = await apiClient.post<any>(GET_LOGIN_SESSION, JSON.stringify(body));
  console.log(response)
  const data = response.data;
  // eslint-disable-next-line require-atomic-updates
  apiClient.defaults.headers.common.Authorization = data.Message;

  if (data.ResultType === 1) return true;
  return false;
};

const getUser = async (email: string) => {
  console.log(email)
  let res = await authenticateUser(email);
  if (res) {
debugger
    const response = await apiClient.get<IAjaxResult>(GET_USER, { params: { email } });
    debugger
    return response.data;
  }
  return null;
};

const useUser = (email: string): UseQueryResult<any> => {
  console.log(email)
  return useQuery(
    ["get-user"],
    () => getUser(email),
    {
      keepPreviousData: true
    }
  )
};

export default useUser;
