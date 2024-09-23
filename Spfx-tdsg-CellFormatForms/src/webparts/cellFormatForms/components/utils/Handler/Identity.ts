import { IUserRole } from "../../../store/reducers/common";
import { AxiosInstance as axios, handleAPIError } from ".";
import { ServiceUrl } from "../../GLOBAL_CONSTANT";
import displayjsx from "../displayjsx";

const baseURL = ServiceUrl;
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


export const AuthenticateUser = async (body: IAuthenticateUserParam): Promise<AuthResponse> => {
  try {
    
    const response = await axios.post(`/api/TroubleReport/GetLoginSession`, JSON.stringify(body));
    
    const data = response.data;
    // bind received token to axios instance
    // eslint-disable-next-line require-atomic-updates
    axios.defaults.headers.common.Authorization = data.Message;
    
    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export type IGetUserRoleByEmailResponse = IUserRole;
export const GetUserRoleByEmail = async (
  email: string
): Promise<IGetUserRoleByEmailResponse> => {
  try {
    
    const response = await axios.get(
      `/api/TroubleReport/GetUserRole`,
      {
        params: {
          email: email,
        },
      }
    );

    console.log("GetUserRoleByEmail handler res", response);
    
    // const result = JSON.parse(response.data);
    // console.log(response, result)
    // if (result.ResultType !== undefined) {
    //   handleAPISuccess(result);
    // }

    let userRole: IUserRole;
    userRole = response.data;

    return userRole;
  } catch (error) {
    console.error("error",error);
    
      if(error?.response?.data?.StatusCode==10){
        
        void displayjsx.showErrorMsg(error?.response?.data?.Message); 
        
      }
    return null;
  }
};

// const data: any = {
//   CostCenter: "AA00",
//   DepartmentId: 1,
//   DepartmentName: "Account & Finance",
//   Designation: null,
//   DivisionId: 6,
//   DivisionName: "Account & Finance ",
//   Email: "SMansuri@synoptek.com",
//   EmployeeId: 1,
//   EmployeeName: "Sameer Mansuri",
//   IsAdmin: false,
//   PhoneNumber: "78541245780",
// };

export default {
  GetUserRoleByEmail,
  AuthenticateUser
};
