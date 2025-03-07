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
  SEQUENCE,
} from "../../GLOBAL_CONSTANT";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useAddOrUpdateTargetDate from "../../apis/workflow/useAddorUpdateTargetDate";
import usePullBack, { IPullBack } from "../../apis/workflow/usePullBack";
import useDelegate, { IDelegate } from "../../apis/delegate/useDelegate";
import { IWorkflowDetail } from "../EquipmentReport/Workflow";
dayjs.extend(isSameOrBefore);
export interface IApproverTask {
  approverTaskId: number;
  status: string; //this will mostly be InReview
  userId: number;
  seqNumber?: number;
}

export interface IWorkFlowProps {
  workflowOne: IWorkflowDetail[];
  workflowTwo: IWorkflowDetail[];
  currentApproverTask: IApproverTask;
  eqReport?: IEquipmentImprovementReport;
  currentApprover?: IWorkflowDetail;
  isTargetDateSet?: boolean;
  ResultMonitoring?: number;
}
const WorkFlowButtons: React.FC<IWorkFlowProps> = ({
  workflowOne,
  workflowTwo,
  currentApproverTask,
  currentApprover,
  eqReport,
  isTargetDateSet,
  ResultMonitoring,
}) => {
  const user: IUser = useContext(UserContext);
  const { id, mode } = useParams();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest = false, allReq } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [showWorkflowBtns, setShowWorkflowBtns] = useState<boolean>(false);
  const [showDelegate, setshowDelegate] = useState<boolean>(false);
  const [clickedAction, setClickedAction] = useState<WorkflowActionType>();
  const [submitbuttontext, setsubmitbuttontext] = useState<string>("Save");
  const [approverRequest, setApproverRequest] = useState(isApproverRequest);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toshibaApproval, settoshibaApproval] = useState(false);
  const [approvedByToshiba, setapprovedByToshiba] = useState(false);
  const [rejectedByToshiba, setRejectedByToshiba] = useState(false);
  const [toshibaDiscussion, settoshibaDiscussion] = useState(false);
  const [advisorRequired, setadvisorRequired] = useState(false);
  const QCHeadID =
    workflowOne?.find((item) => item.SequenceNo === 6)?.DelegateUserId !== 0
      ? workflowOne?.find((item) => item.SequenceNo === 6)?.DelegateUserId
      : workflowOne?.find((item) => item.SequenceNo === 6)?.AssignedToUserId ??
        null;

  const secHeadID =
    workflowTwo?.find((item) => item.SequenceNo === 1)?.DelegateUserId !== 0
      ? workflowTwo?.find((item) => item.SequenceNo === 1)?.DelegateUserId
      : workflowTwo?.find((item) => item.SequenceNo === 1)?.AssignedToUserId ??
        null;
 const advisorID =
        workflowTwo?.find((item) => item.SequenceNo === 2)?.DelegateUserId !== 0
          ? workflowTwo?.find((item) => item.SequenceNo === 2)?.DelegateUserId
          : workflowTwo?.find((item) => item.SequenceNo === 2)?.AssignedToUserId ??
            null;
  const { mutate: approveAskToAmmend, isLoading: approving } =
    useApproveAskToAmmend(id ? parseInt(id) : undefined, user.employeeId);
  const { mutate: addOrUpdateTargetDate, isLoading: updatingTargetDate } =
    useAddOrUpdateTargetDate();
  const { mutate: delegate, isLoading: delegating } = useDelegate();
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
  console.log("CURRENTDATA", currentApproverTask);
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
        IsToshibaApproval: rejectedByToshiba,
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
        IsToshibaApproval: approvedByToshiba,
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
    pcrnAttachmentsRequired?: boolean,
    comment?: string
  ): Promise<void> => {
    try {
      const payload: ITargetData = {
        EquipmentId: parseInt(id),
        IsToshibaDiscussion: eqReport?.ToshibaApprovalRequired ? false : true,
        TargetDate: dayjs(targetDate).format(DATE_FORMAT) ?? null,
        Comment: comment,
        AdvisorId: 0,
        IsPcrnRequired: pcrnAttachmentsRequired,
        EmployeeId: user?.employeeId,
        EmailAttachments: [],
      };

      addOrUpdateTargetDate(payload, {
        onSuccess: (Response) => {
          console.log("add or update target date ", Response);
          navigate("/", {
            state: {
              currentTabState: isApproverRequest
                ? "myapproval-tab"
                : allReq
                ? "allrequest-tab"
                : "myrequest-tab",
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

  const handleDeligate = async (
    comment: string,
    deligateUserId: number
  ): Promise<void> => {
    const data: IDelegate = {
      FormId: id ? parseInt(id) : 0,
      UserId: user?.employeeId ?? 0,
      activeUserId: currentApprover?.AssignedToUserId,
      DelegateUserId: deligateUserId,
      // ApproverTaskId:currentApprover?.ApproverTaskId,
      Comments: comment,
    };
    delegate(data, {
      onSuccess: (data: any) => {
        navigate("/");
      },
    });
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
    advisorRequired?: boolean,
    showDelegate?: boolean
  ): void => {
    setShowModal(true);
    settoshibaDiscussion(toshibaDiscussion);
    settoshibaApproval(toshibaRequired);
    setadvisorRequired(advisorRequired);
    setClickedAction(actionType);
    setshowDelegate(showDelegate);
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
    Delegate: (comment: string, DelegateUserId?: number) =>
      handleDeligate(comment, DelegateUserId),
    Amendment: (comment: string) => onApproveAmendHandler(3, comment),
    PullBack: (comment: string) => onPullbackHandler(comment),
    AddUpdateTargetDate: (
      comment: string,
      targetDate: Date,
      advisorId,
      pcrnAttachmentsRequired: boolean,
      isToshibaDiscussion
    ) =>
      onAddUpdateTargetDate(
        isToshibaDiscussion,
        targetDate,
        pcrnAttachmentsRequired,
        comment
      ),
  };
  console.log("Buttons", currentApproverTask ?? [], isApproverRequest ?? null);
  return (
    <>
      <div className="d-flex gap-3 justify-content-end me-3">
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
                  user?.employeeId == secHeadID &&
                  eqReport?.ResultAfterImplementation?.ResultMonitoringId == 3)
              }
              className="btn btn-primary"
              onClick={() => {
                if (
                  QCHeadID == user?.employeeId &&
                  currentApproverTask?.seqNumber === 6
                ) {
                  confirm({
                    title: "Is Toshiba approval required ?",
                    icon: (
                      <ExclamationCircleOutlined
                        style={{ fontSize: "24px", color: "#faad14" }}
                      />
                    ),
                    okText: "Yes",
                    okButtonProps: {
                      className: "btn btn-primary btn-submit mb-1",
                    },
                    cancelButtonProps: { className: "btn-outline-prime" },
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
                  // user?.employeeId == eqReport?.SectionHeadId &&   // --no need for sec head condition cause we need to show advisor dropdown to workflow level one only
                  eqReport?.WorkflowLevel==1 && 
                  currentApproverTask?.seqNumber == 1 && // TODO: need to change if any changes happen in workflow in future
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
        (secHeadID == user?.employeeId
          ? eqReport?.Status != REQUEST_STATUS.LogicalAmendmentInReview && // add sec head for this
            eqReport?.ResultAfterImplementation?.ResultMonitoringId != 3
          : true) &&
        // eqReport?.WorkflowLevel !== 2 &&
        // (eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
        //   user?.isQcTeamHead) &&
        approverRequest ? (
          <>
            <button
              disabled={
                eqReport?.AdvisorId == user?.employeeId
                  ? isTargetDateSet &&
                    !isToshibaDiscussionTargetDatePast &&
                    eqReport?.WorkflowLevel == 1
                  : !isToshibaApprovalTargetDatePast &&
                    eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
                    eqReport?.WorkflowLevel == 1
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

        {(eqReport?.Status == REQUEST_STATUS.InReview ||
          eqReport?.Status == REQUEST_STATUS.LogicalAmendmentInReview) &&
        user?.isAdmin ? (
          <div className="button-container">
            <button
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("Delegate", false, false, false, true);
                setsubmitbuttontext("Delegate");
                // setshowDelegate(true);
              }}
            >
              Delegate
            </button>
          </div>
        ) : (
          <></>
        )}

        {showWorkflowBtns &&
        eqReport?.ResultAfterImplementation?.IsResultSubmit &&
        user?.employeeId == secHeadID &&
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
                user?.employeeId == secHeadID &&
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
        {console.log("PBCondition", !showWorkflowBtns, !isApproverRequest)}
        {(eqReport?.WorkflowLevel === 1 &&
          eqReport?.IsSubmit &&
          eqReport?.CreatedBy === user?.employeeId &&
          ![
            REQUEST_STATUS.Approved,
            REQUEST_STATUS.UnderAmendment,
            REQUEST_STATUS.Rejected,
            // REQUEST_STATUS.PCRNPending,
          ].includes(eqReport?.Status) &&
          !approverRequest) ||
        (eqReport?.WorkflowStatus === REQUEST_STATUS.W1Completed &&
          eqReport?.Status !== REQUEST_STATUS.LogicalAmendment &&
          eqReport?.Status !== REQUEST_STATUS.UnderAmendment &&
          eqReport?.Status !== REQUEST_STATUS.Rejected &&
          eqReport?.CreatedBy === user?.employeeId &&
          eqReport?.ResultAfterImplementation?.IsResultSubmit &&
          !approverRequest) ? (
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
          // !eqReport?.ResultAfterImplementation?.IsResultSubmit
          eqReport?.WorkflowLevel !== 2 &&
          currentApproverTask?.seqNumber === SEQUENCE.Seq2 &&
          showWorkflowBtns &&
          approverRequest && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("AddUpdateTargetDate", true, true, false);
                setsubmitbuttontext("Save");
                handleToshibaReview();
              }}
            >
              Toshiba Team Discussion
            </button>
          )}
        {eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval &&
          QCHeadID == user?.employeeId &&
          approverRequest &&
          showWorkflowBtns && (
            <button
              disabled={
                QCHeadID == user?.employeeId && !isToshibaApprovalTargetDatePast
              }
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
          QCHeadID == user?.employeeId &&
          approverRequest &&
          showWorkflowBtns && (
            <button
              disabled={
                QCHeadID == user?.employeeId && !isToshibaApprovalTargetDatePast
              }
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("Reject", false, false, false);
                setapprovedByToshiba(false);
                setRejectedByToshiba(true);
                setsubmitbuttontext("Reject");
                handleToshibaReview();
              }}
            >
              Rejected by Toshiba
            </button>
          )}
        {((user?.isAdmin &&
          ((eqReport?.ToshibaDiscussionTargetDate &&
            eqReport?.SeqNo == SEQUENCE.Seq2) ||
            (eqReport?.ToshibaApprovalTargetDate &&
              eqReport?.SeqNo == SEQUENCE.Seq6)) &&
          eqReport?.WorkflowLevel == 1) ||
          (((user.employeeId == eqReport?.AdvisorId &&
            eqReport?.ToshibaDiscussionTargetDate &&
            eqReport?.WorkflowLevel !== 2 &&
            currentApproverTask?.seqNumber === SEQUENCE.Seq2) ||
            (user.isQcTeamHead &&
              eqReport?.ToshibaApprovalTargetDate &&
              currentApproverTask?.seqNumber === SEQUENCE.Seq6)) &&
            showWorkflowBtns &&
            approverRequest)) && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              openCommentsPopup("AddUpdateTargetDate", null, true);
              setapprovedByToshiba(false);
              setsubmitbuttontext("Save");
              handleToshibaReview();
            }}
          >
            Update Target Date
          </button>
        )}
        <TextBoxModal

          seqNo={currentApproverTask?.seqNumber}
          showDelegate={showDelegate}
          EQReportNo={eqReport?.EquipmentImprovementNo}
          label={"Comments"}
          titleKey={"comment"}
          initialValue={""}
          isQCHead={QCHeadID == user?.employeeId}
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
          IsPCRNRequired={eqReport?.IsPcrnRequired}
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
            DelegateUserId?: any;
          }) => {
            setShowModal(false);
            if (values.comment && clickedAction) {
              if (WORKFLOW_ACTIONS[clickedAction]) {
                try {
                  if (clickedAction === "Delegate") {
                    WORKFLOW_ACTIONS[clickedAction](
                      values.comment,
                      values.DelegateUserId // Pass only the arguments required for Delegate
                    ).catch((error) =>
                      console.error(
                        "Error in executing the delegate workflow action:",
                        error
                      )
                    );
                  } else {
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
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error in executing the workflow action:",
                    error
                  );
                  // Execute the corresponding action
                }
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
