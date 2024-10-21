import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { UserContext } from "../../context/userContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IEquipmentImprovementReport } from "../../interface";
import ToshibaApprovalModal from "./ToshibaApproval";
import TextBoxModal from "./TextBoxModal";

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
  seqNumber?: number;
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
  const [advisorRequired, setadvisorRequired] = useState(false);

  const handleToshibaReview = () => {
    setIsModalVisible(true);
  };

  const onApproveAmendHandler = async (
    actionType: 1 | 3,
    comment: string,
    targetDate?:Date,
    advisorId?:number
  ): Promise<void> => {
    try {
      
      console.log("Approved ",comment,targetDate?.toString(),advisorId)
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

  const openCommentsPopup = (
    actionType: WorkflowActionType,
    toshibaRequired?: boolean,
    advisorRequired?:boolean
  ): void => {
    setShowModal(true);
    settoshibaApproval(toshibaRequired);
    setadvisorRequired(advisorRequired)
    setClickedAction(actionType);
  };
  type WorkflowActionType = keyof typeof WORKFLOW_ACTIONS;

  const WORKFLOW_ACTIONS = {
    Approve: (comment: string , targetDate:Date,advisorId:number) => onApproveAmendHandler(1, comment,targetDate,advisorId),
    Amendment: (comment: string,targetDate:Date) => onApproveAmendHandler(3, comment,targetDate),
    PullBack: (comment: string) => onPullbackHandler(comment),
    UpdateTarget: (comment: string) => onPullbackHandler(comment),
  };
  return (
    <>
      <div className="d-flex gap-3 justify-content-end">
        <span
          style={{
            height: "35px",
          }}
        />
        {true ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (false) {
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
                      openCommentsPopup("Approve", true);
                    },
                    onCancel() {
                      openCommentsPopup("Approve", false);
                    },
                  });
                } 
                else if (advisorRequired) {
                  openCommentsPopup("Approve",null,true)
                } 
                else {
                  openCommentsPopup("Approve", false);
                }
                setsubmitbuttontext("Approve");
              }}
            >
              Approve
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                openCommentsPopup("Amendment", false);
                setsubmitbuttontext("Ask to Amend");
              }}
            >
              Ask to Amend
            </button>
          </>
        ) : (
          <>
            {true && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleToshibaReview()}
              >
                Toshiba Team Discussion
              </button>
            )}
          </>
        )}
        {true ? (
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
        <TextBoxModal
          label={"Comments"}
          titleKey={"comment"}
          initialValue={""}
          advisorRequired={advisorRequired}
          toshibaApproval={toshibaApproval}
          isVisible={showModal}
          submitBtnText={submitbuttontext}
          onCancel={() => {
            setShowModal(false);
          }}
          onSubmit={(values: { comment: string , TargetDate?:Date , advisorId?:number}) => {
            setShowModal(false);
            if (values.comment && clickedAction) {
              if (WORKFLOW_ACTIONS[clickedAction]) {
                WORKFLOW_ACTIONS[clickedAction](values.comment,values.TargetDate,values.advisorId).catch((error) =>
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
