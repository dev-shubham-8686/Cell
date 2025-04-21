import * as React from "react";
import { DATE_FORMAT, REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../utility/utility";
import dayjs from "dayjs";
import { IWorkFlow } from "../../apis/workflow/useGetApprovalFlowData";
import { Popover } from "antd";

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
  EquipmentImprovementId: number; // Changed from vehicleRequestId to troubleReportId
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
  approverTasks?: IWorkFlow;
  // requestStatus?: IRequestDetails;
  // userId: number;
}


// Define static data for requestStatus

const userId = 1;
const Workflow: React.FC<IProps> = ({
  approverTasks,
  //   requestStatus,
  //   userId,
}) => {
  console.log("ApproverTasks", approverTasks);
  const workflowTableBody1: {
    head: string;
    cellValues: string[] | any;
    cellColourClass?: string[];
  }[] = [
      {
        head: "Approver",
        cellValues:
          approverTasks?.WorkflowOne.map((item) => {
            if (item.Status === REQUEST_STATUS.NA) return "-";
            return item.employeeName
          }) ?? [],
      },
      {
        head: "Process Status",
        cellValues:
          approverTasks?.WorkflowOne.map((item) => {
            const statusValue: string = item?.Status
              ? displayRequestStatus(item.Status)
              : "";

            if (statusValue === REQUEST_STATUS.Pending) return "";
            return statusValue;
          }) ?? [],
        cellColourClass:
          approverTasks?.WorkflowOne.map((item) => {
            let className = "";
            if (item.Status !== REQUEST_STATUS.Pending) {
              className = `status-cell-${item.Status.toLowerCase()} ${item.Status === REQUEST_STATUS.InReview &&
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
        cellValues: approverTasks?.WorkflowOne.map((item) => (

          <Popover
            content={
              <span className="font-bold">{item.Comments}</span>
            }
          >
            {item.Comments}
          </Popover>
        )),
      },
      {
        head: "Date",
        cellValues:
          approverTasks?.WorkflowOne.map((item) =>
            item.ActionTakenDate
              ? dayjs(item.ActionTakenDate).format(DATE_FORMAT)
              : item?.Status === REQUEST_STATUS.NA ? REQUEST_STATUS.NA : ""
          ) ?? [],
      },
    ];

  const workflowTableBody2: {
    head: string;
    cellValues: string[] | any;
    cellColourClass?: string[];
  }[] = [
      {
        head: "Approver",
        cellValues:
          approverTasks?.WorkflowTwo.map((item) => {
            if (item.Status === REQUEST_STATUS.NA) return "-";
            return item.employeeName
          }) ?? [],
      },
      {
        head: "Process Status",
        cellValues:
          approverTasks?.WorkflowTwo.map((item) => {
            const statusValue: string = item?.Status
              ? displayRequestStatus(item.Status)
              : "";

            if (statusValue === REQUEST_STATUS.Pending) return "";
            return statusValue;
          }) ?? [],
        cellColourClass:
          approverTasks?.WorkflowTwo.map((item) => {
            let className = "";
            if (item.Status !== REQUEST_STATUS.Pending) {
              className = `status-cell-${item.Status.toLowerCase()} ${item.Status === REQUEST_STATUS.InReview &&
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
        cellValues: approverTasks?.WorkflowTwo.map((item) => (
          <Popover content={<span className="font-bold">{item.Comments}</span>}>
            {item.Comments}
          </Popover>
        )),
      },
      {
        head: "Date",
        cellValues:
          approverTasks?.WorkflowTwo.map((item) =>
            item.ActionTakenDate
              ? dayjs(item.ActionTakenDate).format(DATE_FORMAT)
              : item?.Status === REQUEST_STATUS.NA ? REQUEST_STATUS.NA : ""
          ) ?? [],
      },
    ];
  return (
    <div className="tab-section p-4">
      <p className=" mb-0" style={{ fontSize: "20px", color: "#C50017" }}>
        Approval Workflow
      </p>
      <div className="table-responsive ">

        {approverTasks?.WorkflowOne.length === 0 ? (
          <div>Workflow has not been assigned for this request.</div>
        ) : (
          <table className="workflow-table">
            <thead>
              <tr>
                <th>Approver Role</th>
                {approverTasks?.WorkflowOne.length > 0 &&
                  approverTasks?.WorkflowOne.map((item, index) => (
                    <th key={index}> {item.Role}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {workflowTableBody1.map((row, index: number) => {
                return (
                  <tr key={index}>
                    <th>{row.head}</th>
                    {row.cellValues.map((cellValue, index) => (
                      <td
                        key={index}
                        className={`${row?.cellColourClass?.length > 0
                          ? row.cellColourClass[index]
                          : ""
                          }`}
                      >
                        {cellValue}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-responsive pt-5 ">
        <p className=" mb-0" style={{ fontSize: "20px", color: "#C50017" }}>
          Result Implementation Workflow{" "}
        </p>
        {approverTasks?.WorkflowTwo.length === 0 ? (
          <div>Workflow has not been assigned for this request.</div>
        ) : (
          <table className="workflow-table" style={{ width: "50%" }}>
            <thead>
              <tr>
                <th>Approver Role</th>
                {approverTasks?.WorkflowTwo.length > 0 &&
                  approverTasks?.WorkflowTwo.map((item, index) => (
                    <th key={index}> {item.Role}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {workflowTableBody2.map((row, index: number) => {
                return (
                  <tr key={index}>
                    <th>{row.head}</th>
                    {row.cellValues.map((cellValue, index) => (
                      <td
                        key={index}
                        className={`${row?.cellColourClass?.length > 0
                          ? row.cellColourClass[index]
                          : ""
                          }`}
                      >
                        {cellValue}
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
