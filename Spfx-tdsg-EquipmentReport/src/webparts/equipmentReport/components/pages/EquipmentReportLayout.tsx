import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
// import { useAuth } from "../../context/AuthContext";
import Workflow from "../equipmentReport/Workflow";
import History from "../equipmentReport/History";
import Page from "../page/page";
import { UserContext } from "../../context/userContext";
import EquipmentReportForm from "../equipmentReport/Form";
import useEquipmentReportByID from "../../apis/equipmentReport/useEquipmentReport/useEquipmentReportById";
import WorkFlowButtons from "../common/WorkFlowButtons";
import useGetApproverFlowData from "../../apis/workflow/useGetApprovalFlowData";
import useGetCurrentApproverData from "../../apis/workflow/useGetCurrentApprover";

type TabName = "form" | "history" | "workflow";

interface EquipmentReportLayoutProps {}

const EquipmentReportLayout: React.FC<EquipmentReportLayoutProps> = ({}) => {
  const user = React.useContext(UserContext);
  const { id, mode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest, currentTabState, fromReviewTab } =
    location.state || {};
  const [currentTab, setCurrentTab] = useState<TabName>("form");
  const equipmentReport = useEquipmentReportByID(id ? parseInt(id) : undefined);

console.log("EQ Report data",equipmentReport?.data)
const {data:approverFlowData} = useGetApproverFlowData(
  id ? parseInt(id) : undefined
);
const currentApprover = useGetCurrentApproverData(
  id ? parseInt(id) : undefined,
  user.employeeId
);

  const onBackClick = (): void => {
    console.log("CURRENTSTATE", currentTabState, fromReviewTab);
    navigate("/equipment-improvement-report", {
      state: {
        currentTabState: isApproverRequest ? "myapproval-tab" : "myrequest-tab",
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
  ];

  return (
    <Page title="Equipment Report Form">
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
            <i className="fa-solid fa-circle-chevron-left" />
            Back
          </button>
          <div className=" justify-content-right mr-50">
            <WorkFlowButtons currentApproverTask={currentApprover?.data}
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
          ) : (
            <></>
          )}
        </div>
      </div>
    </Page>
  );
};

export default EquipmentReportLayout;
