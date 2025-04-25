import * as React from "react";

import { DATE_TIME_FORMAT, DATETIME, REQUEST_STATUS } from "../../../GLOBAL_CONSTANT";
import { Button, message, Tooltip } from "antd";
import { displayRequestStatus } from "../../../utils/utility";
import { useUserContext } from "../../../context/UserContext";
import { IWorkflowDetail } from "../../../interface";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useGetAdvisorCommentsById } from "../../../hooks/useGetAdvisorCommentsById";
import { useParams } from "react-router-dom";
import { useAddOrUpdateAdvisorComment } from "../../../hooks/useAddOrUpdateAdvisorCommentData";
import { IAdvisorCommentsData } from "../../../api/AddorUpdateAdvisorComments.api";
import dayjs from "dayjs";

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

interface IProps {
  approverTasks: IWorkflowDetail[];
  advisorId?: number,
  submitted?: boolean,
  status?: string
}

const Workflow: React.FC<IProps> = ({
  approverTasks,
  advisorId,
  submitted,
  status
}) => {
  const { user } = useUserContext();
  const [advisorComments, setAdvisorComments] = useState<string>("");
  const { id, mode } = useParams();
  const isViewMode = mode === "view";
  const { mutate: addUpdateAdvisorComment } = useAddOrUpdateAdvisorComment();
  const { data: advisorCommentData } = useGetAdvisorCommentsById(
    id ? parseInt(id) : 0
  );

  const handleSave = async (): Promise<void> => {
    if (advisorComments.trim() === "") {
      await message.warning("Advisor Comments cannot be empty.");
      return;
    }
    const payload: IAdvisorCommentsData = {
      AdjustmentReportId: parseInt(id),
      AdjustmentAdvisorId: advisorCommentData?.ReturnValue?.AdjustmentAdvisorId,
      AdvisorId: advisorId,
      Comment: advisorComments,
      ModifiedBy: user?.employeeId
    }

    addUpdateAdvisorComment(payload, {
      onSuccess: () => {
        // void message.success("Comments updated successfully!");
      },
      onError: () => {
        void message.error("Failed to update comments. Please try again.");
      },
    }
    )
  };

  const workflowTableBody: {
    head: string;
    cellValues: string[];
    cellColourClass?: string[];
  }[] = [
      {
        head: "Approver",
        cellValues: approverTasks?.map((item) => {
          if (item.Status === REQUEST_STATUS.NA) return "-";
          return item.employeeName
        }) ?? [],
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
                item.AssignedToUserId === user?.employeeId
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
              ? dayjs(item.ActionTakenDate).format(DATE_TIME_FORMAT)
              : item?.Status === REQUEST_STATUS.NA ? REQUEST_STATUS.NA : ""
          ) ?? [],
      },
    ];

  useEffect(() => {
    if (advisorCommentData?.ReturnValue?.Comment) {
      setAdvisorComments(advisorCommentData.ReturnValue.Comment);
    }
  }, [advisorCommentData]);

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
                          className={`${(row.cellColourClass || [])[cellIndex] ?? "" // Provide an empty array as default
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
      {submitted ? <div className="advisor-comments-section">
        <p className="mb-0" style={{ fontSize: "20px" }}>
          Advisor Comments
        </p>
        <TextArea
          value={advisorComments}
          disabled={isViewMode || (user?.isAdmin ? false : !(advisorId == user?.employeeId && status != REQUEST_STATUS.Completed))}
          onChange={(e) => setAdvisorComments(e.target.value)}
          rows={4}
          placeholder="Enter your comments here"
        />
        {(((advisorId == user?.employeeId && status != REQUEST_STATUS.Completed) || user?.isAdmin) && !isViewMode) ?
          (<Button
            type="primary"
            onClick={() => handleSave()}
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>) : (<></>)}
      </div> : <></>}
    </div>
  );
};

export default Workflow;
