import { useQuery } from "@tanstack/react-query";
import { IWorkflowDetail } from "../../components/equipmentReport/Workflow";
import { GET_APPROVER_FLOW_DATA } from "../../URLs";
import http from "../../http";

export interface IWorkFlow{
  WorkflowOne:IWorkflowDetail[];
  WorkflowTwo:IWorkflowDetail[]
}
const getApproverFlowData = async (id?: number) => {
  if (!id) return undefined;
debugger
  const response = await http.get<{
    ReturnValue: IWorkFlow;
  }>(GET_APPROVER_FLOW_DATA, { params: {equipmentId: id } });
  console.log("Approval Flow Data RESPONSE",response)
  debugger
  return response.data.ReturnValue;
};

const useGetApproverFlowData = (id?: number) =>
  useQuery<IWorkFlow | undefined>({
    queryKey: ["get-approver-flow-data", id],
    queryFn: () => getApproverFlowData(id),
    cacheTime: 0,
  });

export default useGetApproverFlowData;
