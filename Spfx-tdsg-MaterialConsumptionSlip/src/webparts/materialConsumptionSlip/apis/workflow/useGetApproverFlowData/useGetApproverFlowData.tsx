import { useQuery } from "@tanstack/react-query";

import http from "../../../http";
import { GET_APPROVER_FLOW_DATA,  } from "../../../URLS";
import { IMaterialConsumptionSlipForm } from "../../../interface";
import { IWorkflowDetail } from "../../../components/pages/materialConsumptionSlip/materialConsumptionWorkflowTab/materialConsumptionWorkflow";

const getApproverFlowData = async (id?: number) => {
  if (!id) return undefined;

  const response = await http.get<{
    ReturnValue: IWorkflowDetail[];
  }>(GET_APPROVER_FLOW_DATA, { params: {materialConsumptionId: id } });
  console.log("RESPONSE",response)
  return response.data.ReturnValue;
};

const useGetApproverFlowData = (id?: number) =>
  useQuery<IWorkflowDetail[] | undefined>({
    queryKey: ["get-approver-flow-data", id],
    queryFn: () => getApproverFlowData(id),
    cacheTime: 0,
  });

export default useGetApproverFlowData;
