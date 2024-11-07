import * as React from "react";

import { format } from "date-fns";
import { MY_DATE_TIME_FORMAT, REQUEST_STATUS } from "../../../GLOBAL_CONSTANT";
import { Tooltip } from "antd";
import { displayRequestStatus } from "../../../utils/utility";

export interface IRequestStatus {
  formStatus: string;
  workflowStatus: string;
}
export interface IRequestDetails extends IRequestStatus {
  activeSection: number;
  activeSectionInBE: number;
  isSubmit: boolean;
  createdBy: number;
}
export interface IWorkflowDetail {
  ApproverTaskId: number;
  FormType: string;
  TroubleReportId: number; // Changed from vehicleRequestId to troubleReportId
  AssignedToUserId: number;
  DelegateUserId: number;
  DelegateBy: number;
  Status: string;
  Role: string;
  DisplayName: string;
  SequenceNo: number;
  ActionTakenDate: string;
  Comments: string;
  CreatedBy: number;
  CreatedDate: string; // Date format
  processName: string;
  IsActive: boolean;
  employeeName: string;
  employeeNameWithoutCode: string;
  email: string;
}

interface IProps {
  approverTasks: IWorkflowDetail[];
  // requestStatus?: IRequestDetails;
  // userId: number;
}

// const approverTasks = [
//   {
//     ApproverTaskId: 1,
//     FormType: "Type1",
//     TroubleReportId: 101,
//     AssignedToUserId: 1,
//     DelegateUserId: 0,
//     DelegateBy: 0,
//     Status: REQUEST_STATUS.Approved,
//     Role: "Approver",
//     DisplayName: "John Doe",
//     SequenceNo: 1,
//     ActionTakenDate: "2024-09-06",
//     Comments: "Looks good",
//     CreatedBy: 1,
//     CreatedDate: "2024-09-01",
//     processName: "Department Head",
//     IsActive: true,
//     employeeName: "Raj",
//     employeeNameWithoutCode: "John",
//     email: "john.doe@example.com",
//   },
//   {
//     ApproverTaskId: 1,
//     FormType: "Type1",
//     TroubleReportId: 101,
//     AssignedToUserId: 1,
//     DelegateUserId: 0,
//     DelegateBy: 0,
//     Status: REQUEST_STATUS.Approved,
//     Role: "Approver",
//     DisplayName: "John Doe",
//     SequenceNo: 1,
//     ActionTakenDate: "2024-09-06",
//     Comments: "Looks great",
//     CreatedBy: 1,
//     CreatedDate: "2024-09-01",
//     processName: "CPC Department Head",
//     IsActive: true,
//     employeeName: "Raj Parmar",
//     employeeNameWithoutCode: "John",
//     email: "john.doe@example.com",
//   },
//   {
//     ApproverTaskId: 2,
//     FormType: "Type2",
//     TroubleReportId: 102,
//     AssignedToUserId: 2,
//     DelegateUserId: 0,
//     DelegateBy: 0,
//     Status: REQUEST_STATUS.UnderApproval,
//     Role: "Reviewer",
//     DisplayName: "Jane Smith",
//     SequenceNo: 2,
//     ActionTakenDate: "",
//     Comments: "",
//     CreatedBy: 1,
//     CreatedDate: "2024-09-01T",
//     processName: "Division Head",
//     IsActive: true,
//     employeeName: "Jinal Panchal",
//     employeeNameWithoutCode: "Jane",
//     email: "jane.smith@example.com",
//   },
// ];

// Define static data for requestStatus

const userId = 1;
const Workflow: React.FC<IProps> = ({
  approverTasks,
  //   requestStatus,
  //   userId,
}) => {
  const workflowTableBody: {
    head: string;
    cellValues: string[];
    cellColourClass?: string[];
  }[] = [
    {
      head: "Approver",
      cellValues: approverTasks?.map((item) => item.employeeName) ?? [],
    },
    {
      head: "Process Status",
      cellValues:
        approverTasks?.map((item) => {
          const statusValue: string = item?.Status
            ? displayRequestStatus(item.Status)
            : "";

          if (statusValue === REQUEST_STATUS.Pending) return "";
          return statusValue;
        }) ?? [],
      cellColourClass:
        approverTasks?.map((item) => {
          let className = "";
          if (item.Status !== REQUEST_STATUS.Pending) {
            className = `status-cell-${item.Status.toLowerCase()} ${
              item.Status === REQUEST_STATUS.InReview &&
              item.AssignedToUserId === userId
                ? "active-approver"
                : ""
            }`;
          }
          return className;
        }) ?? [],
    },
    {
      head: "Reviewer Comments",
      cellValues: approverTasks?.map((item) => item.Comments) ?? [],
    },
    {
      head: "Date",
      cellValues:
        approverTasks?.map((item) =>
          item.ActionTakenDate
            ? format(item.ActionTakenDate, MY_DATE_TIME_FORMAT)
            : // ?item.ActionTakenDate
              ""
        ) ?? [],
    },
  ];
  return (
    <div className="tab-section">
      <div className="table-responsive pb-2">
        {approverTasks?.length === 0 ? (
          <div>Workflow has not been assigned for this request.</div>
        ) : (
          <table className="workflow-table">
            <thead>
              <tr>
                <th>Approver Role</th>
                {approverTasks?.length > 0 &&
                  approverTasks?.map((item, index) => (
                    <th key={index}> {item.Role}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {workflowTableBody.map((row, index: number) => {
                return (
                  <tr key={index}>
                    <th>{row.head}</th>
                    {row.cellValues?.length > 0 &&
                      row.cellValues.map((cellValue, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`${
                            (row.cellColourClass || [])[cellIndex] ?? "" // Provide an empty array as default
                          }`}
                        >
                          {row.head === "Reviewer Comments" && cellValue ? (
                            <Tooltip title={cellValue}>
                              <span>{cellValue}</span>
                            </Tooltip>
                          ) : (
                            cellValue
                          )}
                        </td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Workflow;
