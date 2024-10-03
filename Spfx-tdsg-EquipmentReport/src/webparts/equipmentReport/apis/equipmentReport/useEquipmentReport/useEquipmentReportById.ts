import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { IEquipmentImprovementReport } from "../../../interface";
import { GET_EQ_REPORT_BY_ID } from "../../../URLs";


const getEquipmentReport = async (id?: number) => {
  if (!id) return undefined;

  const response = await http.get<{
    ReturnValue: IEquipmentImprovementReport;
  }>(GET_EQ_REPORT_BY_ID, { params: {Id: id } });
  console.log("GetEquipmentReportById Res",response)
  return response.data.ReturnValue;
};

const useEquipmentReportByID = (id: number, onError?: (error: any) => void) =>
  useQuery<IEquipmentImprovementReport | undefined>({
    queryKey: ["get-material-consumption-slip", id],
    queryFn: () => getEquipmentReport(id),
    cacheTime: 0,
    onError,
  });

export default useEquipmentReportByID;
