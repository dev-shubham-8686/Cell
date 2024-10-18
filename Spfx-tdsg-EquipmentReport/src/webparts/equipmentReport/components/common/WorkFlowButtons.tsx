import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { UserContext } from "../../context/userContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IEquipmentImprovementReport } from "../../interface";
import ToshibaApprovalModal from "./ToshibaApproval";

export interface IApproveAskToAmendPayload {
  ApproverTaskId: number;
  CurrentUserId: number;
  type: 1 | 3; // 1 for Approve and 3 for Ask to Amend
  comment: string;
  materialConsumptionId: number;
}
export interface IApproverTask {
    approverTaskId: number;
    status: string; //this will mostly be InReview
    userId: number;
    seqNumber?:number;
  }
export interface IPullBack {
  materialConsumptionId: number;
  userId: number;
  comment: string;
}
export interface IWorkFlowProps {
  currentApproverTask: IApproverTask;
  existingMaterialConsumptionSlip?: IEquipmentImprovementReport;
}
const WorkFlowButtons: React.FC<IWorkFlowProps> = ({
  currentApproverTask,
  existingMaterialConsumptionSlip,
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToshibaReview = () => {
    setIsModalVisible(true);
  };

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
          
              
                openCommentsPopup("Approve");
                setsubmitbuttontext("Approve");
                
              }}
            >
              Approve
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
             
              
                openCommentsPopup("Amendment");
                setsubmitbuttontext("Ask to Amend");
              
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <>
          {true &&  <button
            className="btn btn-primary"
            type="button"
            onClick={() => handleToshibaReview()}
          >
            Toshiba Team Discussion
          </button>}
          </>
        )}
        {true?
          (<button
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
        <ToshibaApprovalModal visible={isModalVisible} setmodalVisible={setIsModalVisible}/>
      </div>
      
    </>
  );
};

export default WorkFlowButtons;
