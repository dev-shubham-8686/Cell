import * as React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  authUser: IAuthUser;
  setAuthUser: (user: IAuthUser) => void;
  userRole: IUserRole;
  setUserRole: (role: IUserRole) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export type IAuthUser = {
  NewId: number;
  RecordNumber: string;
  ResultType: number;
  Message: string;
};
export type IUserRole = {
  isAdmin: boolean;
  employeeId: number;
  employeeName: string;
  Email: string;
  Mobile: string;
  Designation: string;
  DepartmentId: number;
  DepartmentName: string;
  departmentHeadEmpId: number;
  DivisionId: number;
  DivisionName: string;
  CostCenter: string;
  
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IAuthUser>({ NewId: 0, RecordNumber: '', ResultType: 0, Message: '' });
  const [userRole, setUserRole] = useState<IUserRole>({
    isAdmin: false,
    employeeId: 0,
    employeeName: '',
    Email: '',
    Mobile: '',
    Designation: '',
    DepartmentId: 0,
    DepartmentName: '',
    departmentHeadEmpId: 0,
    DivisionId: 0,
    DivisionName: '',
    CostCenter: '',
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, userRole, setUserRole, isAdmin, setIsAdmin, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
