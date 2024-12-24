import * as React from "react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import useUser, { IUser } from "../api/User/useUser";
import UnAuthorized from "../components/common/UnAuthorized";

// import useUser from "../apis/user/useUser";

// export interface IUser {
//     EmployeeId: number;
//     EmployeeCode: string;
//     Email: string;
//     EmployeeName: string;
//     DepartmentName: string;
//     DivisionName: string;
//     IsAdmin: number;
// }

interface IUserProvider {
    userEmail: string;
    children?: ReactNode;
}

interface UserContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  }
  
  // Create context
  const UserContext = createContext<UserContextType | undefined>(undefined);
  
  // Create a custom hook to use the UserContext
  export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
  };

export const UserProvider: React.FC<IUserProvider> = ({
    children,
    userEmail,
}) => {
    const [user, setUser] = useState<IUser | null>(null);
    const { data, isLoading } = useUser(
    //    userEmail
    "ebrahim@synopsandbox.onmicrosoft.com"        // -----admin
       // "j@synoptek.com"                            // ----- shift in charge
        // "shyamkanojia@synopsandbox.onmicrosoft.com" // ----- section head
        // "nityashah@synopsandbox.onmicrosoft.com"       // ----- section head
        // "shubham@synopsandbox.onmicrosoft.com"           // ----- section head
        // "dparikh@synoptek.com"                         // ----- department head
        // "bdavawala@synoptek.com"                   // other dep head 01 
        // "tdivan@synoptek.com"                  // ----- dep div head
        // "BSankhat@synoptek_11111.com"              // ----- Div Head 
        //"Ebrahim@synopsandbox.onmicrosoft.com"
        // "sarpatel@synoptek.com"
        // "smpatel@synoptek.com"
    );

    useEffect(() => {
        if (data) {
            setUser(data); // Set user data when it is fetched
        }
    }, [data]);

    if (isLoading) {
        return <Spin spinning fullscreen />;
    }
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {isLoading && <Spin spinning fullscreen />}
            {!isLoading && user && children}
            {!isLoading && !user && <UnAuthorized />}
        </UserContext.Provider>
    );
};
