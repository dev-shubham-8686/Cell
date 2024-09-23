import React, { useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT, REQUEST_STATUS } from "../GLOBAL_CONSTANT";
import { IWorkflowDetail } from "../utils/Handler/Workflow";
import { displayRequestStatus } from "../utils/utility";

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

export interface DataType {
  key?: string;
  role: string;
  approver: string;
  processStatus: string;
  reviewerComments: string;
  date: string;
}
interface IProps {
  approverTasks: IWorkflowDetail[];
  requestStatus: IRequestDetails;
  userId: number;
}
const TroubleWorkflow: React.FC<IProps> = ({
  approverTasks,
  requestStatus,
  userId,
}) => {
  dayjs.extend(customParseFormat);

  // Rows for the workflow table
  useEffect(() => {
    console.log("approverTasks props", approverTasks);
  }, []);

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
            ? dayjs(item.ActionTakenDate).format(DATE_FORMAT)
            : ""
        ) ?? [],
    },
  ];

  return (
    <div className="tab-section">
      <div className="table-responsive pb-2">
        {/* <table className="workflow-table">
          <thead>
            <tr>
              <th>Approver Role</th>
              {approverTasks.map((item, index) => (
                <th key={index}>{item.role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workflowTableBody.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{row.head}</th>
                {row.cellValues.map((cellValue, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`${
                      row.cellColourClass && row.cellColourClass[cellIndex]
                    }`}
                  >
                    {cellValue}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}

        {approverTasks.length === 0 ? (
          <div>Workflow has not been assigned for this request.</div>
        ) : (
          <table className="workflow-table">
            <thead>
              <tr>
                <th>Approver Role</th>
                {approverTasks.length > 0 &&
                  approverTasks.map((item, index) => (
                    <th key={index}> {item.processName}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {workflowTableBody.map((row, index: number) => {
                return (
                  <tr key={index}>
                    <th>{row.head}</th>
                    {row.cellValues?.length > 0 &&
                      row.cellValues.map((cellValue, index) => (
                        <td
                          key={index}
                          className={`${
                            row?.cellColourClass?.length > 0
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

export default TroubleWorkflow;
