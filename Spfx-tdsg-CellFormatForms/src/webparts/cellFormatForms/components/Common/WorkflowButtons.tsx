import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";

import { Modal, Spin } from "antd";
import { IAPIResponse } from "../utils/Handler/interface";
import TextBoxModal from "./TextBoxModal";
import { setIsLoading } from "../../store/actions/common";
import { ICurrentReviewRole } from "../TroubleReport/Form";
import {
  approveAskToAmendAction,
  IApproveAskToAmendPayload,
  IRejectPayload,
  rejectAction,
} from "../utils/Handler/Workflow";
import { MESSAGES } from "../GLOBAL_CONSTANT";
import { captureEmailApprovalRedirection } from "../utils/utility";

const WorkflowButtons: React.FC<any> = ({
  currentApproverTaskId, //InReview task exists
  seqNumber,
}) => {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  const ACTIVE_SECTION = useSelector<IAppState, number>(
    (state) => state.Common.activeFormSection
  );

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [clickedAction, setClickedAction] = useState<WorkflowActionType>();
  const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>(false);
  const [submitbuttontext, setsubmitbuttontext] = useState<string>("Save");
  const [showWorkflowBtns, setWorkflowBtns] = useState<boolean>(false);
  const [approverRequest, setApproverRequest] = useState(isApproverRequest);

  const { confirm, info } = Modal;
  const viewSubmit = (): boolean => {
    return true;
  };

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

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
    setShowSubmitBtn(viewSubmit());
  }, []);

  useEffect(() => {
    setWorkflowBtns(currentApproverTaskId && currentApproverTaskId !== 0);
  }, [currentApproverTaskId]);

  const onSubmitHandler = async (): Promise<void> => {
    setShowLoader(true);
    try {
      //await props.onSubmit();
    } finally {
      setShowLoader(false);
    }
  };

  const onResubmitHandler = async (comment?: string): Promise<void> => {
    setShowLoader(true);
    try {
      // Your resubmit logic here
    } finally {
      setShowLoader(false);
    }
  };

  const onPullbackHandler = async (comment?: string): Promise<void> => {
    setShowLoader(true);
    try {
      // Your pullback logic here
    } finally {
      setShowLoader(false);
    }
  };

  const onApproveAmendHandler = async (
    actionType: 1 | 3,
    comment?: string
  ): Promise<void> => {
    setShowLoader(true);
    try {
      const params: IApproveAskToAmendPayload = {
        ApproverTaskId: currentApproverTaskId,
        CurrentUserId: EMPLOYEE_ID,
        type: actionType,
        comment: comment,
        troubleReportId: parseInt(id),
      };

      const response: IAPIResponse = await approveAskToAmendAction(params);

      navigate(`/`, {
        state: { currentTabState: "myapproval-tab" },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };

  const onRejectHandler = async (
    actionType: 2,
    comment?: string
  ): Promise<void> => {
    setShowLoader(true);
    try {
      const params: IRejectPayload = {
        ApproverTaskId: currentApproverTaskId,
        CurrentUserId: EMPLOYEE_ID,
        type: actionType,
        comment: comment,
        troubleReportId: parseInt(id),
      };
      const response: IAPIResponse = await rejectAction(params);
      if (response?.Status) {
        navigate(`/`, {
          state: { currentTabState: "myapproval-tab" },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };

  const WORKFLOW_ACTIONS = {
    submit: onSubmitHandler,
    reSubmit: (comment: string) => onResubmitHandler(comment),
    pullBack: (comment: string) => onPullbackHandler(comment),
    Approve: (comment: string) => onApproveAmendHandler(1, comment),
    Reject: (comment: string) => onRejectHandler(2, comment),
    Amendment: (comment: string) => onApproveAmendHandler(3, comment),
  };

  type WorkflowActionType = keyof typeof WORKFLOW_ACTIONS;

  const openCommentsPopup = (actionType?: WorkflowActionType): void => {
    setShowModal(true);
    setClickedAction(actionType); // Define setClickedAction if needed
  };

  return (
    <>
      {/* {props.roles.isRaiser && <h1>HEYYYYYYY</h1>} */}
      <div className="d-flex gap-3 justify-content-end">
        <span
          style={{
            height: "35px",
          }}
        />
        {showWorkflowBtns && approverRequest ? (
          <>
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (seqNumber > 1) {
                  info({
                    title: MESSAGES.approvalInfoMsg,
                    icon: (
                      <i
                        className="fa-solid fa-circle-exclamation"
                        style={{ marginRight: "10px", marginTop: "7px" }}
                      />
                    ),
                    okText: "OK",

                    okButtonProps: {
                      className: "btn-primary",
                    },
                    cancelButtonProps: {
                      className: "btn-outline-primary",
                    },
                    onOk() {
                      openCommentsPopup("Approve");
                      setsubmitbuttontext("Approve");
                    },
                  });
                } else {
                  openCommentsPopup("Approve");
                  setsubmitbuttontext("Approve");
                }
              }}
            >
              Approve
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                openCommentsPopup("Reject");
                setsubmitbuttontext("Reject");
              }}
            >
              Reject
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("Amendment");
                setsubmitbuttontext("Amendment");
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
      <TextBoxModal
        label={"Comments"}
        titleKey={"comment"}
        initialValue={""}
        isVisible={showModal}
        submitBtnText={submitbuttontext}
        onCancel={() => {
          setShowModal(false);
        }}
        onSubmit={(values: { comment: string }) => {
          setShowModal(false);
          if (values.comment && clickedAction) {
            if (WORKFLOW_ACTIONS[clickedAction]) {
              WORKFLOW_ACTIONS[clickedAction](values.comment).catch((error) =>
                console.error("Error in executing the workflow action:", error)
              ); // Execute the corresponding action
            } else {
              console.error(`Unknown action: ${clickedAction}`);
            }
          } else {
            console.error("Comments or clickedAction is not defined.");
          }

          setIsLoading(false);
        }}
        isRequiredField={true}
      />
      <Spin spinning={showLoader} fullscreen />
    </>
  );
};

export default WorkflowButtons;
