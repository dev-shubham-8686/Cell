import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

import Page from "../../../page";
import CreateEditMaterialConsumptionSlip from "../createEditMaterialConsumptionSlip";
import useMaterialConsumptionSlip from "../../../../apis/materialConsumptionSlip/useMaterialConsumptionSlip";
import { Spin } from "antd";
import History from "../materialConsumptionHistoryTab/materialConsumptionHistory";
import Workflow, { IWorkflowDetail } from "../materialConsumptionWorkflowTab/materialConsumptionWorkflow";
import CloseModal from "../../../common/CloseModal";
import useGetApproverFlowData from "../../../../apis/workflow/useGetApproverFlowData/useGetApproverFlowData";
import WorkFlowButtons from "../../../common/workFlowButtons";
import useGetCurrentApproverData, { IApproverTask } from "../../../../apis/workflow/useGetCurrentApprover/useGetCurrentApprover";
import { UserContext } from "../../../../context/userContext";
import { sessionExpiredStatus } from "../../../table/useTable";
import displayjsx from "../../../../utility/displayjsx";
import { redirectToHome } from "../../../../utility/utility";
import { REQUEST_STATUS } from "../../../../GLOBAL_CONSTANT";

const tabs = [
  {
    id: "form-tab",
    name: "Form",
  },
  {
    id: "history-tab",
    name: "History",
  },
  {
    id: "workflow-tab",
    name: "Workflow",
  },
];

const CreateEditMaterialConsumptionSlipLayout = () => {
  const { id, mode } = useParams();
  const user = useContext(UserContext);
  const [isFormModified, setIsFormModified] = useState(false);
  const [currentApproverDetail, setCurrentApproverDetail] = useState<IWorkflowDetail | null>(null);

  const navigate = useNavigate();
  const [currentApprovertask, setCurrentApprovertask] =
    useState<IApproverTask>(null);
  const materialConsumptionSlip = useMaterialConsumptionSlip(
    id ? parseInt(id) : undefined,
    (error) => {
      console.error("Error fetching material consumption slip by Id:", error);

      if (sessionExpiredStatus.includes(error.response?.StatusCode)) {
        void displayjsx.showErrorMsg(error.response.Message);
        redirectToHome();
      }
    }
  );

  const { data: approveerFlowData } = useGetApproverFlowData(
    id ? parseInt(id) : undefined
  );

  const currentApprover = useGetCurrentApproverData(
    id ? parseInt(id) : undefined,
    user.employeeId
  );

  useEffect(() => {
    if (currentApprover?.data) {
      setCurrentApprovertask(currentApprover.data);
    }

    if (approveerFlowData) {
      const approverInReview = approveerFlowData?.find(
        (approver) => approver.Status === REQUEST_STATUS.InReview
      );
      setCurrentApproverDetail(approverInReview || null);
    }
  }, [currentApprover, approveerFlowData]);
  const location = useLocation();
  const { isApproverRequest, currentTabState, fromReviewTab } =
    location.state || {};
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const onBack = React.useCallback(() => {
    navigate("/", {
      state: {
        currentTabState: isApproverRequest
          ? "myapproval-tab"
          : "myrequest-tab",
      },
    });
    // navigate("/material-consumption-slip");
  }, []);

  return (
    <Page title="Material Consumption Form">
      <div className="content flex-grow-1 p-4 pt-0">
        <div className=" d-flex justify-content-between align-items-center">
          <button
            className="btn btn-link btn-back pt-2"
            type="button"
            onClick={onBack}
          >
            <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faCircleChevronLeft} />
            Back
          </button>
        </div>
        <WorkFlowButtons
          currentApprover={currentApproverDetail}
          isFormModified={isFormModified}
          currentApproverTask={currentApprovertask}
          existingMaterialConsumptionSlip={materialConsumptionSlip.data}
        />
        <Spin spinning={materialConsumptionSlip.isLoading} fullscreen />

        <ul className="nav nav-tab-bar nav-underline" id="myTab" role="tablist">
          {tabs.map((tab) => {
            return (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  className={`nav-link form-tab ${currentTab === tab.id ? "active" : ""
                    }`}
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

        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="myrequest-tab-pane"
            role="tabpanel"
            aria-labelledby="myrequest-tab"
            tabIndex={0}
          >
            <div
              className="tab-pane fade show active"
              id="myrequest-tab-pane"
              role="tabpanel"
              aria-labelledby="myrequest-tab"
              tabIndex={0}
            >
              {currentTab === "form-tab" && (
                <CreateEditMaterialConsumptionSlip
                  setIsFormModified={setIsFormModified}
                  currentApproverTask={currentApprovertask}
                  key={materialConsumptionSlip.data?.materialConsumptionSlipId}
                  existingMaterialConsumptionSlip={materialConsumptionSlip.data}
                  mode={mode}
                />
              )}
              {currentTab === "history-tab" && (
                <History />
              )}
              {currentTab === "workflow-tab" && (
                <Workflow
                  approverTasks={approveerFlowData ?? []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CreateEditMaterialConsumptionSlipLayout;
