import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
// import { useAuth } from "../../context/AuthContext";
import Page from "../page/page";
import { UserContext } from "../../context/userContext";
import useEquipmentReportByID from "../../apis/equipmentReport/useEquipmentReport/useEquipmentReportById";
import WorkFlowButtons, { IApproverTask } from "../common/WorkFlowButtons";
import useGetApproverFlowData from "../../apis/workflow/useGetApprovalFlowData";
import useGetCurrentApproverData from "../../apis/workflow/useGetCurrentApprover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import useGetEmailAttachmentsData from "../../apis/equipmentReport/useEmailAttachments/useEmailAttachmentsData";
import { REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import EquipmentReportForm from "../EquipmentReport/Form";
import EmailAttachments from "../EquipmentReport/EmailAttachments";
import Workflow, { IWorkflowDetail } from "../EquipmentReport/Workflow";
import History from "../EquipmentReport/History";

type TabName = "form" | "history" | "workflow" | "emailAtachments";

interface EquipmentReportLayoutProps {}

const EquipmentReportLayout: React.FC<EquipmentReportLayoutProps> = ({}) => {
  const user = React.useContext(UserContext);
  const { id, mode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest, currentTabState, fromReviewTab ,allReq } =
    location.state || {};
  const [currentTab, setCurrentTab] = useState<TabName>("form");
  const [currentApproverDetail, setCurrentApproverDetail] = useState<IWorkflowDetail | null>(null);

  const equipmentReport = useEquipmentReportByID(id ? parseInt(id) : undefined);

console.log("allReq",equipmentReport?.data,location.state)
const {data:approverFlowData} = useGetApproverFlowData(
  id ? parseInt(id) : undefined
);
const {data:emailAttachmentData} = useGetEmailAttachmentsData(
  id ? parseInt(id) : undefined
);
console.log("EMDTA",emailAttachmentData)
const currentApprover = useGetCurrentApproverData(
  id ? parseInt(id) : undefined,
  user.employeeId
);

useEffect(() => {
  if (approverFlowData) {
    let approverInReview = null;

    if (approverFlowData.WorkflowTwo?.length > 0) {
      approverInReview = approverFlowData?.WorkflowTwo.find(
        (approver) => approver.Status === REQUEST_STATUS.InReview
      );
    }

    if (!approverInReview && approverFlowData.WorkflowOne?.length > 0) {
      approverInReview = approverFlowData?.WorkflowOne.find(
        (approver) => approver.Status === REQUEST_STATUS.InReview
      );
    }

    setCurrentApproverDetail(approverInReview || null);
  }
}, [approverFlowData]);
  const onBackClick = (): void => {
    console.log("CURRENTSTATE", currentTabState, fromReviewTab ,allReq);
    navigate("/", {
      state: {
        currentTabState: isApproverRequest ? "myapproval-tab": allReq? "allrequest-tab": "myrequest-tab",
      },
    });
  };

  const tabs: {
    id: TabName;
    name: string;
  }[] = [
    {
      id: "form",
      name: "Form",
    },
    {
      id: "history",
      name: "History",
    },
    {
      id: "workflow",
      name: "Workflow",
    },
    emailAttachmentData?.length>0 && {
      id: "emailAtachments",
      name: "Toshiba Attachments",
    },
  ];

  return (
    <Page title="Equipment Improvement Form">
      <div
        className="content w-100 d-flex flex-column"
        style={{
          minHeight: "80vh",
        }}
      >
        <div className="m-3 mb-0 d-flex justify-content-between align-items-center">
          <button
            className="btn btn-link btn-back"
            type="button"
            onClick={onBackClick}
          >
            <FontAwesomeIcon  className="me-2"icon={faCircleChevronLeft} />
            Back
          </button>
          <div className=" justify-content-right mr-50">
            <WorkFlowButtons
                currentApprover={currentApproverDetail}
            currentApproverTask={currentApprover?.data}
            eqReport={equipmentReport?.data}
            isTargetDateSet={equipmentReport?.data?.ToshibaApprovalRequired ||equipmentReport?.data?.ToshibaTeamDiscussion } 
            />
          </div>
        </div>

        <ul
          className="nav nav-tab-bar nav-underline mx-4"
          id="myTab"
          role="tablist"
        >
          {tabs.map((tab) => {
            return (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    currentTab === tab.id ? "active" : ""
                  } tab-link`}
                  id={tab.id}
                  data-bs-toggle="tab"
                  data-bs-target={`#${tab.id}-pane`}
                  type="button"
                  role="tab"
                  aria-controls="myrequest-tab-pane"
                  aria-selected="true"
                  onClick={() => {
                    setCurrentTab(tab.id);
                  }}
                >
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="px-4 pb-4 d-flex  flex-grow-1 row ">
          {currentTab === "form" ? (
            <>
              <div>
                <EquipmentReportForm
                  reportLoading={equipmentReport.isLoading}
                  existingEquipmentReport={equipmentReport.data}
                  mode={mode}
                />
              </div>
            </>
          ) : currentTab === "history" ? (
            <div>
              <History />
            </div>
          ) : currentTab === "workflow" ? (
            <div>
              <Workflow 
               approverTasks={approverFlowData??{ WorkflowOne: [], WorkflowTwo: [] }}
              />
            </div>
          ) :currentTab === "emailAtachments" ? (
            <div>
              <EmailAttachments EQReportNo={equipmentReport?.data?.EquipmentImprovementNo} emailAttachments={emailAttachmentData??[]}/>
            </div>
          ): (
            <></>
          )}
        </div>
      </div>
    </Page>
  );
};

export default EquipmentReportLayout;
