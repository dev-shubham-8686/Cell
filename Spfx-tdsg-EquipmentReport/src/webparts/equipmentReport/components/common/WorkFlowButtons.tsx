import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { IUser, UserContext } from "../../context/userContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IEquipmentImprovementReport } from "../../interface";
import TextBoxModal, { IEmailAttachments } from "./TextBoxModal";
import useApproveAskToAmmend, {
  IApproveAskToAmendPayload,
  ITargetData,
} from "../../apis/workflow/useApproveAskToAmmend";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  REQUEST_STATUS,
} from "../../GLOBAL_CONSTANT";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useAddOrUpdateTargetDate from "../../apis/workflow/useAddorUpdateTargetDate";
import usePullBack, { IPullBack } from "../../apis/workflow/usePullBack";
dayjs.extend(isSameOrBefore);
export interface IApproverTask {
  approverTaskId: number;
  status: string; //this will mostly be InReview
  userId: number;
  seqNumber?: number;
}

export interface IWorkFlowProps {
  currentApproverTask: IApproverTask;
  eqReport?: IEquipmentImprovementReport;
  isTargetDateSet?: boolean;
  ResultMonitoring?: number;
}
const WorkFlowButtons: React.FC<IWorkFlowProps> = ({
  currentApproverTask,
  eqReport,
  isTargetDateSet,
  ResultMonitoring,
}) => {
  const user: IUser = useContext(UserContext);
  const { id, mode } = useParams();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [showWorkflowBtns, setShowWorkflowBtns] = useState<boolean>(false);
  const [clickedAction, setClickedAction] = useState<WorkflowActionType>();
  const [submitbuttontext, setsubmitbuttontext] = useState<string>("Save");
  const [approverRequest, setApproverRequest] = useState(isApproverRequest);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toshibaApproval, settoshibaApproval] = useState(false);
  const [approvedByToshiba, setapprovedByToshiba] = useState(false);
  const [toshibaDiscussion, settoshibaDiscussion] = useState(false);
  const [advisorRequired, setadvisorRequired] = useState(false);
  const { mutate: approveAskToAmmend, isLoading: approving } =
    useApproveAskToAmmend(id ? parseInt(id) : undefined, user.employeeId);
  const { mutate: addOrUpdateTargetDate, isLoading: updatingTargetDate } =
    useAddOrUpdateTargetDate();
  const { mutate: pullBack, isLoading: pullbacking } = usePullBack(
    id ? parseInt(id) : undefined,
    user.employeeId
  );
  const isToshibaDiscussionTargetDatePast = dayjs(
    eqReport?.ToshibaDiscussionTargetDate,
    DATE_TIME_FORMAT
  ).isSameOrBefore(dayjs(), "day");

  const isToshibaApprovalTargetDatePast = dayjs(
    eqReport?.ToshibaApprovalTargetDate,
    DATE_TIME_FORMAT
  ).isSameOrBefore(dayjs(), "day"); // Compare with current date

  const handleToshibaReview = () => {
    setIsModalVisible(true);
  };

  const onRejectHandler = async (
    actionType: 2,
    comment: string
  ): Promise<void> => {
    try {
      const payload: IApproveAskToAmendPayload = {
        ApproverTaskId: currentApproverTask?.approverTaskId ?? 0,
        CurrentUserId: user.employeeId,
        Type: actionType ?? null,
        Comment: comment,
        EquipmentId: parseInt(id),
        EquipmentApprovalData: null,
      };
      approveAskToAmmend(payload, {
        onSuccess: (Response) => {
          console.log("RejectResponse: ", Response);
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        },

        onError: (error) => {
          console.error("Export error:", error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onApproveAmendHandler = async (
    actionType: 1 | 3 | 4,
    comment: string,
    targetDate?: Date,
    advisorId?: number,
    pcrnAttachmentsRequired?: boolean,
    emailAttacments?: IEmailAttachments[]
  ): Promise<void> => {
    try {
      const payload: IApproveAskToAmendPayload = {
        ApproverTaskId: currentApproverTask?.approverTaskId ?? 0,
        CurrentUserId: user.employeeId,
        Type: actionType ?? null,
        Comment: comment,
        EquipmentId: parseInt(id),
        EquipmentApprovalData:
          toshibaApproval ||
          advisorId ||
          eqReport.IsPcrnRequired ||
          emailAttacments?.length > 0
            ? {}
            : null,
      };

      if (toshibaApproval || advisorId || emailAttacments?.length > 0) {
        (payload.EquipmentApprovalData.TargetDate = targetDate
          ? dayjs(targetDate).format(DATE_FORMAT)
          : null),
          (payload.EquipmentApprovalData.IsPcrnRequired =
            pcrnAttachmentsRequired),
          (payload.EquipmentApprovalData.IsToshibaDiscussion = false),
          (payload.EquipmentApprovalData.EquipmentId = parseInt(id)),
          (payload.EquipmentApprovalData.AdvisorId = advisorId ?? 0);
        payload.EquipmentApprovalData.EmailAttachments = emailAttacments;
      }

      if (eqReport?.IsPcrnRequired) {
        payload.EquipmentApprovalData.EmailAttachments = emailAttacments;
      }
      approveAskToAmmend(payload, {
        onSuccess: (Response) => {
          console.log("ask to ammend / approve  Response: ", Response);
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        },

        onError: (error) => {
          console.error("Export error:", error);
        },
      });

      console.log("Approved Payload ", payload);
    } catch (error) {
      console.error(error);
    }
  };

  const onAddUpdateTargetDate = async (
    IsToshibaDiscussion: boolean,
    targetDate: Date,
    comment?: string
  ): Promise<void> => {
    try {
      const payload: ITargetData = {
        EquipmentId: parseInt(id),
        IsToshibaDiscussion: eqReport?.ToshibaApprovalRequired ? false : true,
        TargetDate: dayjs(targetDate).format(DATE_FORMAT) ?? null,
        Comment: comment,
        AdvisorId: 0,
        EmployeeId: user?.employeeId,
        EmailAttachments: [],
      };

      addOrUpdateTargetDate(payload, {
        onSuccess: (Response) => {
          console.log("add or update target date ", Response);
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        },

        onError: (error) => {
          console.error("Export error:", error);
        },
      });
      console.log("updated target date ", payload);
    } catch (error) {
      console.error(error);
    }
  };

  const onPullbackHandler = async (comment?: string): Promise<void> => {
    try {
      const payload: IPullBack = {
        equipmentId: parseInt(id),
        userId: user.employeeId,
        comment: comment,
      };
      pullBack(payload, {
        onSuccess: (Response) => {
          console.log("pullback Response: ", Response);
          navigate(`/`);
        },

        onError: (error) => {
          console.error("Export error:", error);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const url = window.location.href;
    const [baseUrl, queryString] = url.split("?");
    const params = new URLSearchParams(queryString);
    const actionValue = params.get("action");

    if (actionValue) {
      // Removing outlook parameters
      params.delete("action");
      params.delete("CT");
      params.delete("OR");
      params.delete("CID");

      const newUrl = `${baseUrl.split("#")[0]}${
        params.toString() ? "?" + params.toString() : ""
      }${window.location.hash}`;

      // window.location.replace(newUrl);
      // window.history.replaceState({ isApproverRequest: true }, "", newUrl);
      setApproverRequest(true);
      navigate(location.pathname, {
        state: {
          currentTabState: "myapproval-tab",
        },
        replace: true,
      });
    }
  }, []);

  useEffect(() => {
    setShowWorkflowBtns(
      currentApproverTask?.approverTaskId &&
        currentApproverTask?.approverTaskId !== 0
        ? true
        : false
    );
  }, [currentApproverTask, eqReport, isModalVisible]);

  const openCommentsPopup = (
    actionType: WorkflowActionType,
    toshibaDiscussion?: boolean,
    toshibaRequired?: boolean,
    advisorRequired?: boolean
  ): void => {
    setShowModal(true);
    settoshibaDiscussion(toshibaDiscussion);
    settoshibaApproval(toshibaRequired);
    setadvisorRequired(advisorRequired);
    setClickedAction(actionType);
  };
  type WorkflowActionType = keyof typeof WORKFLOW_ACTIONS;

  const WORKFLOW_ACTIONS = {
    Approve: (
      comment: string,
      targetDate: Date,
      advisorId: number,
      pcrnAttachmentsRequired: boolean,
      emailAttachments?: IEmailAttachments[]
    ) =>
      onApproveAmendHandler(
        1,
        comment,
        targetDate,
        advisorId,
        pcrnAttachmentsRequired,
        emailAttachments
      ),
    Reject: (comment: string) => onRejectHandler(2, comment),
    LogicalAmendment: (comment: string) => onApproveAmendHandler(4, comment),
    Amendment: (comment: string) => onApproveAmendHandler(3, comment),
    PullBack: (comment: string) => onPullbackHandler(comment),
    AddUpdateTargetDate: (
      comment: string,
      targetDate: Date,
      isToshibaDiscussion
    ) => onAddUpdateTargetDate(isToshibaDiscussion, targetDate, comment),
  };
  console.log("Buttons", currentApproverTask ?? [], isApproverRequest ?? null);
  return (
    <>
      <div className="d-flex gap-3 justify-content-end">
        <span
          style={{
            height: "35px",
          }}
        />
        {console.log(
          "COndition",

          !isToshibaDiscussionTargetDatePast,
          !isToshibaApprovalTargetDatePast
        )}
        {showWorkflowBtns &&
        eqReport?.Status !== REQUEST_STATUS.UnderToshibaApproval &&
        approverRequest ? (
          <>
            <button
              disabled={
                (eqReport?.WorkflowLevel !== 2
                  ? eqReport?.AdvisorId == user?.employeeId &&
                    isTargetDateSet &&
                    !isToshibaDiscussionTargetDatePast
                  : false) ||
                (eqReport?.WorkflowLevel == 2 &&
                  eqReport?.Status != REQUEST_STATUS.LogicalAmendmentInReview &&
                  user?.employeeId == eqReport?.SectionHeadId &&
                  eqReport?.ResultAfterImplementation?.ResultMonitoringId == 3)
              }
              className="btn btn-primary"
              onClick={() => {
                if (user?.isQcTeamHead) {
                  confirm({
                    title: "Is Toshiba approval required ?",
                    icon: (
                      <ExclamationCircleOutlined
                        style={{ fontSize: "24px", color: "#faad14" }}
                      />
                    ),
                    okText: "Yes",
                    okButtonProps: { className: "btn btn-primary" },
                    cancelButtonProps: { className: "btn-outline-primary" },
                    cancelText: "No",
                    onOk() {
                      openCommentsPopup("Approve", false, true, false);
                      setsubmitbuttontext("Proceed");
                    },
                    onCancel() {
                      openCommentsPopup("Approve", false, false, false);
                      setsubmitbuttontext("Approve");
                    },
                  });
                } else if (
                  user?.employeeId == eqReport?.SectionHeadId &&
                  eqReport?.WorkflowStatus != REQUEST_STATUS.W1Completed
                ) {
                  openCommentsPopup("Approve", false, false, true);
                  setsubmitbuttontext("Approve");
                } else {
                  openCommentsPopup("Approve", false, false, false);
                  setsubmitbuttontext("Approve");
                }
              }}
            >
              Approve
            </button>
          </>
        ) : (
          <></>
        )}
        {console.log(
          "CONDITION",
          !isToshibaDiscussionTargetDatePast,
          !isToshibaApprovalTargetDatePast
        )}

        {showWorkflowBtns &&
        eqReport?.WorkflowLevel !== 2 &&
        // (eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
        //   user?.isQcTeamHead) &&
        approverRequest ? (
          <>
            <button
              disabled={
                eqReport?.AdvisorId == user?.employeeId
                  ? isTargetDateSet && !isToshibaDiscussionTargetDatePast
                  : !isToshibaApprovalTargetDatePast &&
                    eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval
              }
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("Amendment", false, false, false);
                setapprovedByToshiba(false);
                setsubmitbuttontext("Ask to Amend");
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <></>
        )}
        {showWorkflowBtns &&
        eqReport?.ResultAfterImplementation?.IsResultSubmit &&
        user?.employeeId == eqReport?.SectionHeadId &&
        approverRequest ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("LogicalAmendment", false, false, false);
                setapprovedByToshiba(false);
                setsubmitbuttontext("Logical Amendment");
              }}
            >
              Logical Amendment
            </button>
          </>
        ) : (
          <></>
        )}
        {showWorkflowBtns &&
        eqReport?.Status !== REQUEST_STATUS.UnderToshibaApproval &&
        approverRequest ? (
          <button
            disabled={
              (eqReport?.WorkflowLevel !== 2
                ? eqReport?.AdvisorId == user?.employeeId &&
                  isTargetDateSet &&
                  !isToshibaDiscussionTargetDatePast
                : false) ||
              (eqReport?.WorkflowLevel == 2 &&
                eqReport?.Status != REQUEST_STATUS.LogicalAmendmentInReview &&
                user?.employeeId == eqReport?.SectionHeadId &&
                eqReport?.ResultAfterImplementation?.ResultMonitoringId == 3)
            }
            className="btn btn-primary"
            onClick={() => {
              openCommentsPopup("Reject", false, false, false);
              setsubmitbuttontext("Reject");
            }}
          >
            Reject
          </button>
        ) : (
          <></>
        )}
        {/* { 
        {((eqReport?.WorkflowLevel === 1 &&
          (eqReport?.Status != REQUEST_STATUS.Approved ||
            eqReport?.Status != REQUEST_STATUS.UnderAmendment || eqReport?.Status != REQUEST_STATUS.PCRNPending)) ||
          (eqReport?.WorkflowStatus == REQUEST_STATUS.W1Completed &&
            eqReport?.ResultAfterImplementation?.IsResultAmendSubmit)) &&
        eqReport?.CreatedBy == user?.employeeId ? ( */}

        {(eqReport?.WorkflowLevel === 1 &&
          eqReport?.IsSubmit &&
          eqReport?.CreatedBy === user?.employeeId &&
          ![
            REQUEST_STATUS.Approved,
            REQUEST_STATUS.UnderAmendment,
            REQUEST_STATUS.PCRNPending,
          ].includes(eqReport?.Status)) ||
        (eqReport?.WorkflowStatus === REQUEST_STATUS.W1Completed &&
          eqReport?.Status !== REQUEST_STATUS.LogicalAmendment &&
          eqReport?.CreatedBy === user?.employeeId &&
          eqReport?.ResultAfterImplementation?.IsResultSubmit) ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              openCommentsPopup("PullBack");
              setsubmitbuttontext("Pull Back");
            }}
          >
            Pull Back
          </button>
        ) : (
          <></>
        )}
        {user.employeeId == eqReport?.AdvisorId &&
          !isTargetDateSet &&
          !eqReport?.ResultAfterImplementation?.IsResultSubmit &&
          showWorkflowBtns &&
          approverRequest && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("AddUpdateTargetDate", true, true, false);

                handleToshibaReview();
              }}
            >
              Toshiba Team Discussion
            </button>
          )}
        {eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
          user?.isQcTeamHead &&
          approverRequest &&
          showWorkflowBtns && (
            <button
              disabled={user?.isQcTeamHead && !isToshibaApprovalTargetDatePast}
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("Approve", false, false, false);
                setapprovedByToshiba(true);
                setsubmitbuttontext("Approve");
                handleToshibaReview();
              }}
            >
              Approved by Toshiba
            </button>
          )}
        {eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
          user?.isQcTeamHead &&
          approverRequest &&
          showWorkflowBtns && (
            <button
              disabled={user?.isQcTeamHead && !isToshibaApprovalTargetDatePast}
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("Reject", false, false, false);
                setapprovedByToshiba(false);
                handleToshibaReview();
              }}
            >
              Rejected by Toshiba
            </button>
          )}
        {((user.employeeId == eqReport?.AdvisorId &&
          eqReport?.ToshibaDiscussionTargetDate &&
          eqReport?.WorkflowLevel !== 2) ||
          (user.isQcTeamHead && eqReport?.ToshibaApprovalTargetDate)) &&
          showWorkflowBtns &&
          approverRequest && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("AddUpdateTargetDate", null, true);
                setapprovedByToshiba(false);
                handleToshibaReview();
              }}
            >
              Update target Date
            </button>
          )}
        <TextBoxModal
          EQReportNo={eqReport?.EquipmentImprovementNo}
          label={"Comments"}
          titleKey={"comment"}
          initialValue={""}
          isQCHead={user?.isQcTeamHead}
          approvedByToshiba={approvedByToshiba}
          isTargetDateSet={isTargetDateSet}
          advisorRequired={advisorRequired}
          toshibaApproval={toshibaApproval}
          toshibadiscussiontargetDate={
            eqReport?.ToshibaDiscussionTargetDate ?? null
          }
          toshibaApprovaltargetDate={
            eqReport?.ToshibaApprovalTargetDate ?? null
          }
          isVisible={showModal}
          submitBtnText={submitbuttontext}
          onCancel={() => {
            setShowModal(false);
          }}
          onSubmit={(values: {
            comment: string;
            TargetDate?: Date;
            advisorId?: number;
            pcrnAttachmentsRequired?: boolean;
            emailAttachments?: IEmailAttachments[];
          }) => {
            setShowModal(false);
            if (values.comment && clickedAction) {
              if (WORKFLOW_ACTIONS[clickedAction]) {
                WORKFLOW_ACTIONS[clickedAction](
                  values.comment,
                  values.TargetDate,
                  values.advisorId,
                  values.pcrnAttachmentsRequired,
                  values.emailAttachments
                ).catch((error) =>
                  console.error(
                    "Error in executing the workflow action:",
                    error
                  )
                ); // Execute the corresponding action
              } else {
                console.error(`Unknown action: ${clickedAction}`);
              }
            } else {
              console.error("Comments or clickedAction is not defined.");
            }
          }}
          isRequiredField={true}
        />
      </div>
      <Spin
        spinning={approving || pullbacking || updatingTargetDate}
        fullscreen
      />
    </>
  );
};

export default WorkFlowButtons;
