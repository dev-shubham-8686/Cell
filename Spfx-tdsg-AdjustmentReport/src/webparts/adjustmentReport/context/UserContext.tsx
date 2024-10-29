import * as React from "react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import useUser from "../api/User/useUser";

// import useUser from "../apis/user/useUser";

export interface IUser {
    EmployeeId: number;
    EmployeeCode: string;
    Email: string;
    EmployeeName: string;
    DepartmentName: string;
    DivisionName: string;
}

export const UserContext = createContext<IUser | null | any>(null);

interface IUserProvider {
    userEmail: string;
    children?: ReactNode;
}

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
        userEmail
    );

    useEffect(() => {
        if (data) {
            setUser(data); // Set user data when it is fetched
        }
    }, [data]);

    if (isLoading) { <Spin spinning fullscreen /> }
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
