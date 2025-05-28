import * as React from 'react';
import { DATE_FORMAT, REQUEST_STATUS } from '../../../../GLOBAL_CONSTANT';
import { displayRequestStatus } from '../../../../utility/utility';
import { format } from "date-fns";


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
  userId: number;
}

const Workflow: React.FC<IProps> = ({
  approverTasks,
  //   requestStatus,
  userId,
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
              className = `status-cell-${item.Status.toLowerCase()} ${item.Status === REQUEST_STATUS.InReview &&
                (item.DelegateUserId ? item.DelegateUserId === userId : item.AssignedToUserId === userId)
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
              ? format(item.ActionTakenDate, DATE_FORMAT)
              // ?item.ActionTakenDate
              : ""
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
                      row.cellValues.map((cellValue, index) => (
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
}

export default Workflow
