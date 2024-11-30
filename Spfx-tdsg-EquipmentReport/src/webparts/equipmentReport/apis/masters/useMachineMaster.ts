import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_MACHINE_MASTER } from "../../URLs";

export interface IMachineMaster {
  MachineId: number;
  MachineName: string;
}

const getMachineMaster = async () => {
  try {
    const response = await http.get<{ReturnValue: IMachineMaster[]}>(GET_MACHINE_MASTER);
     
    if (response) {
      
      const tabledata = response.data.ReturnValue ?? [];
      return tabledata;
    }
  } catch (error) {
    console.error("Error fetching Machine master", error);
    return null;
  }
};

const useMachineMaster = () =>
  useQuery<IMachineMaster[]>({
    queryKey: ["device-master"],
    queryFn: () => getMachineMaster(),
  });

export default useMachineMaster;
