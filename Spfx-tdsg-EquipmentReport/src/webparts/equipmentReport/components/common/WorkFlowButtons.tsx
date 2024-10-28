import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { IUser, UserContext } from "../../context/userContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IEquipmentImprovementReport } from "../../interface";
import ToshibaApprovalModal from "./ToshibaApproval";
import TextBoxModal, { IEmailAttachments } from "./TextBoxModal";
import useApproveAskToAmmend, {
  IApproveAskToAmendPayload,
  ITargetData,
} from "../../apis/workflow/useApproveAskToAmmend";
import { DATE_FORMAT, REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useAddOrUpdateTargetDate from "../../apis/workflow/useAddorUpdateTargetDate";
dayjs.extend(isSameOrBefore);
export interface IApproverTask {
  approverTaskId: number;
  status: string; //this will mostly be InReview
  userId: number;
  seqNumber?: number;
}
export interface IPullBack {
  materialConsumptionId: number;
  userId: number;
  comment: string;
}
export interface IWorkFlowProps {
  currentApproverTask: IApproverTask;
  eqReport?: IEquipmentImprovementReport;
  isTargetDateSet?: boolean;
}
const WorkFlowButtons: React.FC<IWorkFlowProps> = ({
  currentApproverTask,
  eqReport,
  isTargetDateSet,
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
  const { mutate: approveAskToAmmend, isLoading: approvingRequest } =
    useApproveAskToAmmend(id ? parseInt(id) : undefined, user.employeeId);
  const { mutate: addOrUpdateTargetDate } = useAddOrUpdateTargetDate();
  const isToshibaDiscussionTargetDatePast =
    eqReport?.ToshibaDiscussionTargetDate
      ? dayjs(eqReport?.ToshibaDiscussionTargetDate).isSameOrBefore(
          dayjs(),
          "day"
        )
      : false;
  console.log(
    "isToshibaDiscussionTargetDatePast",
    isToshibaDiscussionTargetDatePast,
    eqReport?.ToshibaDiscussionTargetDate,
    (dayjs(), "day")
  );
  const isToshibaApprovalTargetDatePast = eqReport?.ToshibaApprovalTargetDate
    ? dayjs(eqReport?.ToshibaApprovalTargetDate).isSameOrBefore(dayjs(), "day") // Compare with current date
    : false;
  console.log(
    "isToshibaDiscussionTargetDatePast",
    isToshibaDiscussionTargetDatePast
  );
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
    actionType: 1 | 3,
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
          toshibaApproval || advisorId || eqReport.IsPcrnRequired ? {} : null,
      };

      if (toshibaApproval || advisorId) {
        (payload.EquipmentApprovalData.TargetDate = targetDate
          ? dayjs(targetDate).format(DATE_FORMAT)
          : null),
          (payload.EquipmentApprovalData.IsPcrnRequired =
            pcrnAttachmentsRequired),
          (payload.EquipmentApprovalData.IsToshibaDiscussion = false),
          (payload.EquipmentApprovalData.EquipmentId = parseInt(id)),
          (payload.EquipmentApprovalData.AdvisorId = advisorId ?? 0);
      }
      if (eqReport?.IsPcrnRequired) {
        payload.EquipmentApprovalData.EmailAttachments = emailAttacments;
      }
      // approveAskToAmmend(payload, {
      //   onSuccess: (Response) => {
      //     console.log("ask to ammend / approve  Response: ", Response);
      //     navigate("/", {
      //       state: {
      //         currentTabState: "myapproval-tab",
      //       },
      //     });
      //   },

      //   onError: (error) => {
      //     console.error("Export error:", error);
      //   },
      // });

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
        IsToshibaDiscussion: true,
        TargetDate: dayjs(targetDate).format(DATE_FORMAT) ?? null,
        Comment: comment,
        AdvisorId: 0,
      };

      addOrUpdateTargetDate(payload);
      console.log("Approved ", payload);
    } catch (error) {
      console.error(error);
    }
  };

  const onPullbackHandler = async (comment?: string): Promise<void> => {
    try {
      const params: IPullBack = {
        materialConsumptionId: parseInt(id),
        userId: user.employeeId,
        comment: comment,
      };
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
          showWorkflowBtns,
          approverRequest,
          !isToshibaDiscussionTargetDatePast,
          !isToshibaApprovalTargetDatePast
        )}
        {showWorkflowBtns && approverRequest ? (
          <>
            <button
              disabled={
                isToshibaDiscussionTargetDatePast ||
                isToshibaApprovalTargetDatePast
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
                    cancelText: "No",
                    cancelButtonProps: { className: "btn-outline-primary" },
                    onOk() {
                      openCommentsPopup("Approve", false, true, false);
                    },
                    onCancel() {
                      openCommentsPopup("Approve", false, false, false);
                    },
                  });
                } else if (user?.employeeId == eqReport?.SectionHeadId) {
                  openCommentsPopup("Approve", false, false, true);
                } else {
                  openCommentsPopup("Approve", false, false, false);
                }
                setsubmitbuttontext("Approve");
              }}
            >
              Approve
            </button>
          </>
        ) : (
          <></>
        )}
        {showWorkflowBtns && approverRequest ? (
          <>
            <button
              disabled={
                isToshibaDiscussionTargetDatePast ||
                isToshibaApprovalTargetDatePast
              }
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("Amendment", false, false, false);
                setsubmitbuttontext("Ask to Amend");
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <></>
        )}
        {showWorkflowBtns && approverRequest ? (
          <button
            disabled={
              isToshibaDiscussionTargetDatePast ||
              isToshibaApprovalTargetDatePast
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

        {eqReport?.IsSubmit &&
        eqReport?.CreatedBy == user?.employeeId &&
        eqReport?.Status != REQUEST_STATUS.UnderAmendment ? (
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
          showWorkflowBtns && (
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
        {true && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              openCommentsPopup("Approve", false, false, false);
              setapprovedByToshiba(true);
              setsubmitbuttontext("Approve");
              handleToshibaReview();
            }}
          >
            Toshiba Approved
          </button>
        )}
        {eqReport?.Status == REQUEST_STATUS.UnderToshibaApproval && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              openCommentsPopup("Reject", false, false, false);
              handleToshibaReview();
            }}
          >
            Toshiba Rejected
          </button>
        )}
        {(user.employeeId == eqReport?.AdvisorId || user.isQcTeamHead) &&
          isTargetDateSet && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                openCommentsPopup("AddUpdateTargetDate", null, true);
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
          targetDate={eqReport?.ToshibaDiscussionTargetDate ?? null}
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
    </>
  );
};

export default WorkFlowButtons;
