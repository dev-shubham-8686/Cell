// import { AnyObject } from "antd/es/_util/type";
// import { IAddUpdateReportPayload } from "../api/AddUpdateReport.api";
// import * as dayjs from "dayjs";

// export const CreatePayload = (values: AnyObject, isSave: boolean) => {
//   const payload: IAddUpdateReportPayload = {
//     ReportNo: values.reportNo, //done
//     RequestBy: values.requestedBy, //done
//     CheckedBy: values.CheckedBy, //done
//     When: values.dateTime, // need to confirm
//     Area: values.area, //done
//     MachineName: values.machineName, //done
//     SubMachineName: values.subMachineName, //done
//     DescribeProblem: values.describeProblem, //done
//     Observation: values.observation, //done
//     RootCause: values.rootCause, //done
//     AdjustmentDescription: values.adjustmentDescription, //done
//     ConditionAfterAdjustment: values.conditionAfterAdjustment, // done
//     Photos: values.Photos,
//     ChangeRiskManagementRequired: values.changeRiskManagementRequired, // done
//     ChangeRiskManagementList: values.ChangeRiskManagementList, // Ensure this is an array of ChangeRiskManagement objects
//     IsSubmit: !isSave, //done
//     CreatedBy: values.CreatedById, //need to change
//     CreatedDate: dayjs(),
//     ModifiedBy: values.ModifiedById, // need to change conditionally
//     ModifiedDate: dayjs(), // change conditionally , if modifying then pass only
//   };
//   console.log({ payload });
// };
