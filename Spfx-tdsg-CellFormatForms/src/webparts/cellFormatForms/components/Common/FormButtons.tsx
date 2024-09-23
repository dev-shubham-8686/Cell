import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { Modal, Spin } from "antd";
import { IAPIResponse } from "../utils/Handler/interface";
import TextBoxModal from "./TextBoxModal";
import { setIsLoading } from "../../store/actions/common";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ICurrentReviewRole } from "../TroubleReport/Form";
import {
  IWorkflowActionPayload,
  pullbackAction,
  reOpenAction,
  reSubmitAction,
} from "../utils/Handler/Workflow";
import { Levels, REQUEST_STATUS } from "../GLOBAL_CONSTANT";
import CustomModal from "./ReOpenModal";

interface IProps {
  departmentHeadId: number;
  currentlevel: number;
  isModeView: boolean;
  seqNumber: number;
  isReOpen: boolean;
  submitted: boolean;
  status: string;
  isLead: boolean;
  isInReview: boolean;
  showSubmit: boolean;
  showSave: boolean;
  roles: ICurrentReviewRole;
  activeSection?: number;
  isAdmin: boolean;
  requestType: number;
  userId: number;
  currentApproverTaskId: number;
  approverTaskId: number;
  onSaveFormHandler: (showPopUp: boolean) => Promise<void>;
  onsendtoManager: () => Promise<void>;
  onNotify: () => Promise<void>;
  onReviewbyRM: () => Promise<void>;
  onAllow: (comment: string) => Promise<void>;
  onDecline: (comment: string) => Promise<void>;
  onSubmit: () => Promise<void>;
  shownotify: boolean;
  employeeOptions: any[];
}

const FormButtons: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  const [clickedAction, setClickedAction] = useState<WorkflowActionType>();

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [isReOpenModalVisible, setIsReOpenModalVisible] = useState(false);
  const isAdmin = useSelector<IAppState, boolean>(
    (state) => state.Common.userRole.isAdmin
  );

  const { confirm } = Modal;
  const { id } = useParams();
  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const onSaveHandler = async (): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onSaveFormHandler(true);
    } finally {
      setShowLoader(false);
    }
  };

  const onSubmitHandler = async (): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onSubmit();
    } finally {
      setShowLoader(false);
    }
  };

  const onAllow = async (comment?: string): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onAllow(comment);
    } finally {
      setShowLoader(false);
      comment = "";
    }
  };

  const onDisallow = async (comment?: string): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onDecline(comment);
    } finally {
      setShowLoader(false);
      comment = "";
    }
  };

  const onSendToManager = async (): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onsendtoManager();
    } finally {
      setShowLoader(false);
    }
  };

  const onNotifyMembers = async (): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onNotify();
    } finally {
      setShowLoader(false);
    }
  };

  const onReview = async (): Promise<void> => {
    setShowLoader(true);
    try {
      await props.onReviewbyRM();
    } finally {
      setShowLoader(false);
    }
  };

  const onResubmitHandler = async (comment?: string): Promise<void> => {
    // confirm({
    //   title: "Are you sure you want to Re-submit the form?",
    //   icon: (
    //     <i
    //       className="fa-solid fa-circle-exclamation"
    //       style={{ marginRight: "10px", marginTop: "7px" }}
    //     />
    //   ),
    //   okText: "Yes",
    //   okType: "primary",
    //   cancelText: "No",
    //   onOk: async () => {
    try {
      setShowLoader(true);
      const payload = {
        troubleReportId: parseInt(id),
        isSubmit: true,
        modifiedBy: EMPLOYEE_ID,
        isAmendReSubmitTask: true,
        approverTaskId: props.approverTaskId,
        comment: comment,
      };

      props.onSaveFormHandler(false).catch((error) => {
        console.error("Unhandled promise rejectino:", error);
      });

      const response = await reSubmitAction(payload);

      if (response) {
        navigate("/", {
          state: {
            currentTabState: "myreview-tab",
          },
        });
      }
    } finally {
      setShowLoader(false);
    }
    //   },
    //   onCancel() {
    //     console.log("Cancel submission");
    //   },
    // });
  };

  // const resubmitAction = (): void => {
  //   setClickedAction("reSubmit");
  //   Modal.confirm({
  //     title: (
  //       <p className="text-black-50_e8274897">
  //         Only the saved sections of the form will be submitted. Have you saved
  //         the data by clicking the &apos;Save&apos; button?
  //       </p>
  //     ),
  //     icon: <ExclamationCircleFilled />,
  //     okText: "Yes",
  //     onOk: async () => {
  //       setShowModal(true);
  //     },
  //   });
  // };

  const execReopen = async (raiserId: number) => {
    console.log("raiserId", raiserId);
    try {
      setShowLoader(true);
      const troubleReportId = parseInt(id);
      const response = await reOpenAction(troubleReportId, raiserId);

      if (response?.ReturnValue > 0) {
        // navigate(`/form/edit/${response.ReturnValue}`, {
        //   state: {
        //     currentTabState: "myreview-tab",
        //   },
        // });
        navigate(`/`);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const onReOpenHandler = () => {
    Modal.confirm({
      title: "Are you sure you want to Re-Open the form?",
      icon: (
        <i
          className="fa-solid fa-circle-exclamation"
          style={{ marginRight: "10px", marginTop: "7px" }}
        />
      ),
      okText: "Yes",
      okType: "primary",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      cancelText: "No",
      onOk: () => {
        setIsReOpenModalVisible(true); // Show custom modal
      },
      onCancel() {
        setShowLoader(false);
      },
    });
  };

  const handleOk = async (raiserId: number | null) => {
    if (raiserId) {
      await execReopen(raiserId);
      setIsReOpenModalVisible(false);
    }
  };

  const onPullbackHandler = async (comment?: string): Promise<void> => {
    setShowLoader(true);
    try {
      const params: IWorkflowActionPayload = {
        troubleReportId: parseInt(id),
        userId: EMPLOYEE_ID,
        comment: comment,
      };

      const response: IAPIResponse = await pullbackAction(params);
    } finally {
      navigate(`/`, {
        state: { currentTabState: "myrequest-tab" },
      });
      setShowLoader(false);
    }
  };

  const WORKFLOW_ACTIONS = {
    submit: onSubmitHandler,
    allow: (comment: string) => onAllow(comment),
    decline: (comment: string) => onDisallow(comment),
    reSubmit: (comment: string) => onResubmitHandler(comment),
    pullBack: (comment: string) => onPullbackHandler(comment),
    // approve: (comment: string) => onApproveAmendHandler(1, comment),
    // reject: (comment: string) => onRejectHandler(comment),
    // askToAmend: (comment: string) => onApproveAmendHandler(3, comment),
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
        {!isApproverRequest && (
          <>
            {(isAdmin ||
              (((props.showSave &&
                !props.submitted &&
                !props.roles.isWorkDoneMember &&
                !props.roles.isReviewRM) ||
                ((props.roles.isRaiser || props.roles.isRM) &&
                  props.currentlevel < Levels.Level1) ||
                (props.roles.isWorkDoneLead && props.approverTaskId !== 0)) &&
                props.approverTaskId == 0 &&
                !(props.status === REQUEST_STATUS.UnderReview) &&
                // (props.submitted && props.roles.isWorkDoneLead &&
                //(props.roles.isRM || props.roles.status === "InProcess") &&
                // (!props.roles.isRaiser?props.roles.status==REQUEST_STATUS.InProcess:true) &&
                !props.isModeView)) && (
              <button className="btn btn-primary" onClick={onSaveHandler}>
                Save
              </button>
            )}
            {props.isLead &&
              (props.roles.isRM || isAdmin) &&
              //  props.roles.status == "InProcess" &&
              !props.isModeView && (
                <button className="btn btn-primary" onClick={onNotifyMembers}>
                  Notify Members
                </button>
              )}
            {(props.roles.isWorkDoneLead || isAdmin) &&
              !props.isModeView &&
              props.approverTaskId == 0 &&
              props.roles.status === "InProcess" && (
                <button className="btn btn-primary" onClick={onReview}>
                  Review By Managers
                </button>
              )}
            {props.status === REQUEST_STATUS.Draft && !props.isModeView && (
              <button className="btn btn-primary" onClick={onSendToManager}>
                Notify Manager
              </button>
            )}
            {(props.roles.isReviewRM || isAdmin) &&
              props.roles.status === "InProcess" && (
                //true&&
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    openCommentsPopup("decline");
                  }}
                >
                  Decline
                </button>
              )}
            {(props.roles.isReviewRM || isAdmin) &&
              props.roles.status === "InProcess" && (
                // true&&
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    openCommentsPopup("allow");
                  }}
                >
                  Allow
                </button>
              )}
            {console.log(
              "submitcondition",
              props.roles.isWorkDoneLead,
              !props.isModeView,
              props.showSubmit,
              !props.submitted,
              props.currentlevel,
              props.roles.isWorkDoneLead &&
                !props.isModeView &&
                props.showSubmit &&
                !props.submitted &&
                props.currentlevel === Levels.Level4
            )}
            {(props.roles.isWorkDoneLead || isAdmin) &&
              !props.isModeView &&
              props.showSubmit &&
              !props.submitted &&
              props.currentlevel === Levels.Level4 && (
                <button
                  // disabled={!(props.status==REQUEST_STATUS.Reviewed)}
                  className="btn btn-darkgrey"
                  onClick={onSubmitHandler}
                >
                  <i className="fa-solid fa-share-from-square" />
                  <span>Submit</span>
                </button>
              )}
            {(props.roles.isWorkDoneLead || isAdmin) &&
              props.submitted &&
              !props.approverTaskId &&
              props.seqNumber < 2 && (
                <button
                  className="btn btn-primary"
                  onClick={() => openCommentsPopup("pullBack")}
                >
                  Pull Back
                </button>
              )}
            {(props.roles.isWorkDoneLead || isAdmin) &&
              props.submitted &&
              props.approverTaskId !== 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => openCommentsPopup("reSubmit")}
                >
                  Re-Submit
                </button>
              )}
            {props.status === REQUEST_STATUS.Completed &&
              !props.isReOpen &&
              (props.departmentHeadId === EMPLOYEE_ID || isAdmin) && (
                <button className="btn btn-primary" onClick={onReOpenHandler}>
                  Re-Open
                </button>
              )}
          </>
        )}
      </div>
      <TextBoxModal
        // modelTitle="Are you Sure You want to Proceed?"
        label={"Comments"}
        titleKey={"comment"}
        initialValue={""}
        isVisible={showModal}
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
        submitBtnText="Proceed"
      />
      <CustomModal
        isVisible={isReOpenModalVisible}
        onCancel={() => setIsReOpenModalVisible(false)}
        onOk={handleOk}
        options={props?.employeeOptions ?? []}
      />
      <Spin spinning={showLoader} fullscreen />
    </>
  );
};

export default FormButtons;
