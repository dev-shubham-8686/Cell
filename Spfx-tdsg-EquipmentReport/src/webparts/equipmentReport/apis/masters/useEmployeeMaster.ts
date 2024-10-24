import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import {  GET_EMPLOYEE_MASTER } from "../../URLs";

export interface IEmployeeMaster {
  employeeId: number;
  employeeName: string;
}

const getEmployeeMaster = async () => {
  try {
    const response = await http.get<{ReturnValue: IEmployeeMaster[]}>(GET_EMPLOYEE_MASTER);
     
    if (response) {
      
      const tabledata = response.data.ReturnValue ?? [];
      return tabledata;
    }
  } catch (error) {
    console.error("Error fetching Device master", error);
    return null;
  }
};

const useEmployeeMaster = () =>
  useQuery<any>({
    queryKey: ["employee-master"],
    queryFn: () => getEmployeeMaster(),
  });

export default useEmployeeMaster;
