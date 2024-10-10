import { useQuery } from "@tanstack/react-query";

import http from "../../http";
import { GET_DEVICE_MASTER } from "../../URLs";

export interface IDeviceMaster {
  deviceId: number;
  deviceName: string;
}

const getDeviceMaster = async () => {
  try {
    const response = await http.get<{ReturnValue: IDeviceMaster[]}>(GET_DEVICE_MASTER);
     
    if (response) {
      
      const tabledata = response.data.ReturnValue ?? [];
      return tabledata;
    }
  } catch (error) {
    console.error("Error fetching Device master", error);
    return null;
  }
};

const useDeviceMaster = () =>
  useQuery<IDeviceMaster[]>({
    queryKey: ["device-master"],
    queryFn: () => getDeviceMaster(),
  });

export default useDeviceMaster;
