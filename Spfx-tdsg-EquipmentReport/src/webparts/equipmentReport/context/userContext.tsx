import * as React from "react";
import { createContext, ReactNode } from "react";
import { Spin } from "antd";
import UnAuthorized from "../components/pages/UnAuthorized";
import useUser from "../apis/user/useUser";

// import useUser from "../apis/user/useUser";

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
  isQcTeamHead:boolean;
  isQcTeamUser:boolean;
  isAdmin: boolean;
  isAdminId: number;
}


export const UserContext = createContext<IUser | null |any>(null);
//TODO:remove any form above
interface IUserProvider {
  userEmail: string;
  children?: ReactNode;
}

export const UserProvider: React.FC<IUserProvider> = ({
  children,
  userEmail,
}) => {
  
  // TODO: change the email
  // const isLoading=false
  // const data=[]
   const {data,isLoading } = useUser(
    // userEmail
// "BSankhat@synoptek_11111.com"    
// "Ebrahim@synopsandbox.onmicrosoft.com"
"j@synoptek.com"
    // "jinal.panchal@synopsandbox.onmicrosoft.com"
    // "tdivan@synoptek.com"
    // "esakir@synoptek.com"
    // "diparmar@synoptek.com"
  );

  console.log("USERROLE Res", data);
  return (
    <UserContext.Provider value={data ?? null}>
      
      {isLoading && <Spin spinning fullscreen />}
      {!isLoading && data && children}
      {!isLoading && !data && <UnAuthorized />}
    </UserContext.Provider>
  );
};
