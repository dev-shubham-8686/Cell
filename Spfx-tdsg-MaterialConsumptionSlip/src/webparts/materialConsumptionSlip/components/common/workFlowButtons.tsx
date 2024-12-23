import React, { useContext, useEffect, useState } from "react";
import TextBoxModal from "./textBoxModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import useApproveAskToAmmend from "../../apis/workflow/useApproveAskToAmmend";
import { UserContext } from "../../context/userContext";
import usePullBack from "../../apis/workflow/usePullBack";
import { IMaterialConsumptionSlipForm } from "../../interface";
import { IApproverTask } from "../../apis/workflow/useGetCurrentApprover/useGetCurrentApprover";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface IApproveAskToAmendPayload {
  ApproverTaskId: number;
  CurrentUserId: number;
  type: 1 | 3; // 1 for Approve and 3 for Ask to Amend
  comment: string;
  materialConsumptionId: number;
}

export interface IPullBack {
  materialConsumptionId: number;
  userId: number;
  comment: string;
}
export interface IWorkFlowProps {
  isFormModified:boolean
  currentApproverTask: IApproverTask;
  existingMaterialConsumptionSlip?: IMaterialConsumptionSlipForm;
}
const WorkFlowButtons: React.FC<IWorkFlowProps> = ({
  currentApproverTask,
  existingMaterialConsumptionSlip,
  isFormModified
}) => {
  const user = useContext(UserContext);
  const { id ,mode } = useParams();
  const {  info } = Modal;
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [showWorkflowBtns, setShowWorkflowBtns] = useState<boolean>(false);
  const [clickedAction, setClickedAction] = useState<WorkflowActionType>();
  const [submitbuttontext, setsubmitbuttontext] = useState<string>("Save");
  const [approverRequest, setApproverRequest] = useState(isApproverRequest);

  const { mutate: approveAskToAmmend ,isLoading:approvingRequest } = useApproveAskToAmmend(
    id ? parseInt(id) : undefined,
    user.employeeId
  );
  const { mutate: pullBack,isLoading:pullbacking } = usePullBack(
    id ? parseInt(id) : undefined,
    user.employeeId
  );

  const onApproveAmendHandler = async (
    actionType: 1 | 3,
    comment?: string
  ): Promise<void> => {
    try {
      const payload: IApproveAskToAmendPayload = {
        ApproverTaskId: currentApproverTask.approverTaskId,
        CurrentUserId: user.employeeId,
        type: actionType,
        comment: comment,
        materialConsumptionId: parseInt(id),
      };

      approveAskToAmmend(payload, {
        onSuccess: (Response) => {
          
          console.log("ATA Response: ", Response);
          navigate("/",{
            state: {
              currentTabState: "myapproval-tab",
            }});
        },
        
        onError: (error) => {
          console.error("Export error:", error);
        },
  
      });
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
      pullBack(params, {
        onSuccess: (Response) => {
          
          console.log("pullback Response: ", Response);
          navigate(`/material-consumption-slip`);
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
    );
  }, [currentApproverTask]);

  const openCommentsPopup = (actionType?: WorkflowActionType): void => {
    setShowModal(true);
    setClickedAction(actionType);
  };
  type WorkflowActionType = keyof typeof WORKFLOW_ACTIONS;

  const WORKFLOW_ACTIONS = {
    Approve: (comment: string) => onApproveAmendHandler(1, comment),
    Amendment: (comment: string) => onApproveAmendHandler(3, comment),
    PullBack: (comment: string) => onPullbackHandler(comment),
  };
  return (
    <>
{    console.log("LOADING",approvingRequest,pullbacking)}      

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
              onClick={() => {
                if(isFormModified){
                  info({
                    title: "Please save the data before proceeding further.",
                    icon: (
                      <ExclamationCircleOutlined
                        style={{ fontSize: "24px", color: "#faad14" }}
                      />
                    ),
                    okText: "OK",
                    okButtonProps: { className: "btn btn-primary" },
                    okType: "primary",
                    onOk() {
                      console.log("OK clicked");
                    },
                  });
                }
                else{
                openCommentsPopup("Approve");
                setsubmitbuttontext("Approve");
                }
              }}
            >
              Approve
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                if(isFormModified){
                  info({
                    title: "Please save the data before proceeding further.",
                    icon: (
                      <ExclamationCircleOutlined
                        style={{ fontSize: "24px", color: "#faad14" }}
                      />
                    ),
                    okText: "OK",
                    okButtonProps: { className: "btn btn-primary" },
                    okType: "primary",
                    onOk() {
                      console.log("OK clicked");
                    },
                  });
                }
                else{
                openCommentsPopup("Amendment");
                setsubmitbuttontext("Ask to Amend");
                }
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <></>
        )}
        {existingMaterialConsumptionSlip?.isSubmit &&
        existingMaterialConsumptionSlip?.status != "UnderAmendment" &&
        user.employeeId == existingMaterialConsumptionSlip?.userId &&
        existingMaterialConsumptionSlip?.seqNumber < 2 ? (
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
        }}
        isRequiredField={true}
      />
      <Spin spinning={(approvingRequest||pullbacking)} fullscreen />
    </>
  );
};

export default WorkFlowButtons;
