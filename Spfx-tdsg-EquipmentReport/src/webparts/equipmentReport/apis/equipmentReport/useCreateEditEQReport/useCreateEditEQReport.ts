import { useMutation } from "@tanstack/react-query";

import http from "../../../http";
import {
  ICustomAxiosConfig,
  IEquipmentImprovementReport,
} from "../../../interface";
import { CREATE_EDIT_EQ_REPORT } from "../../../URLs";

const createEditEQReport = async (
  eqReport: IEquipmentImprovementReport
) => {
  const config: ICustomAxiosConfig = {
    SHOW_NOTIFICATION: true,
  };

  const response = await http.post<string>(
    CREATE_EDIT_EQ_REPORT,
    eqReport,
    config
  );
  
  return response.data;
};

const useCreateEditEQReport = () =>
  useMutation<string, null, IEquipmentImprovementReport>({
    mutationKey: ["create-eq-report"],
    mutationFn: createEditEQReport,
  });

export default useCreateEditEQReport;
