import * as React from "react";
import { createContext, ReactNode } from "react";
import { Spin } from "antd";

import UnAuthorized from "../components/unAuthorized";
import useUser from "../../techInstrSheet/api/user/useUser";
import { IUser } from "../../techInstrSheet/api/interface";

export const UserContext = createContext<IUser | null>(null);

interface IUserProvider {
  userEmail: string;
  children?: ReactNode;
}

export const UserProvider: React.FC<IUserProvider> = ({
  children,
  userEmail,
}) => {
  // TODO: change the email

  const { data, isLoading } = useUser(
    userEmail
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
