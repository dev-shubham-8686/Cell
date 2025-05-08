import { useQuery } from "@tanstack/react-query";
import http from "../../http";
import { GET_EMPLOYEE_MASTER } from "../../URLS";

export interface IEmployeeMaster {
  employeeId: number;
  employeeName: string;
}

const getEmployeeMaster = async () => {
  try {
    const response = await http.get<{ ReturnValue: IEmployeeMaster[] }>(
      GET_EMPLOYEE_MASTER
    );

    if (response) {
      const tabledata = response.data.ReturnValue ?? [];
      return tabledata;
    }
  } catch (error) {
    console.error("Error fetching Employee master", error);
    return null;
  }
};

const useEmployeeMaster = () =>
  useQuery<IEmployeeMaster[]>({
    queryKey: ["employee-master"],
    queryFn: () => getEmployeeMaster(),
  });

export default useEmployeeMaster;
