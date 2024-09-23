import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";

import {
  getCurrentApproverTask,
  getWorkflowDetails,
  IApproverTask,
  IWorkflowDetail,
} from "../utils/Handler/Workflow";
import { IAppState } from "../../store/reducers";
import WorkflowButtons from "../Common/WorkflowButtons";

type TabName = "form" | "history" | "workflow";
interface ReportFormPageProps {
  context: any;
  HistoryComponent: React.ComponentType<any>;
  WorkflowComponent: React.ComponentType<any>;
}
const ReportFormPage: React.FC<ReportFormPageProps> = ({
  HistoryComponent,
  context,
  children,
  WorkflowComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const location = useLocation();
  const { isApproverRequest, currentTabState, fromReviewTab } =
    location.state || {};
  const [currentTab, setCurrentTab] = useState<TabName>("form");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [approverTasks, setApproverTasks] = useState<IWorkflowDetail[]>([]);
  const [currentApprovertask, setCurrentApprovertask] =
    useState<IApproverTask>(null);
  const { id, action } = useParams();
  const onBackClick = (): void => {
    // if (currentTab === "form") {
    //   confirm({
    //     title: (
    //       <p className="text-black-50_e8274897">
    //         Only the completed sections will be saved as draft. Do you want to
    //         proceed?
    //       </p>
    //     ),
    //     icon: <ExclamationCircleFilled />,
    //     onOk() {
    //       dispatch(setActiveFormSection(0));
    //       dispatch(setFormSectionStatus(Array.from(Array(10).fill("pending"))));
    //       navigate("/");
    //     },
    //     onCancel() {
    //       console.log("Cancel");
    //     },
    //   });
    // } else {
    console.log("CURRENTSTATE", currentTabState, fromReviewTab);
    navigate("/", {
      state: {
        currentTabState: fromReviewTab
          ? "myreview-tab"
          : isApproverRequest
          ? "myapproval-tab"
          : "myrequest-tab",
      },
    });
    // }
  };

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const fetchWorkflowDetails = async (): Promise<void> => {
    try {
      const response = await getWorkflowDetails(parseInt(id));

      if (response?.length > 0) {
        setApproverTasks(response);
      }

      console.log("Response workflowDetails ", response);
    } catch (error) {
      console.error(
        "Error in executing the fetchWorkflowDetails function",
        error
      );
    }
  };

  const getCurrentApproverTaskDetails = async (): Promise<void> => {
    try {
      const response = await getCurrentApproverTask(parseInt(id), EMPLOYEE_ID);

      console.log("getCurrentApproverTaskDetails", response);

      if (response) setCurrentApprovertask(response);
    } catch (error) {
      console.error("Error while fetching the Approver Task Details");
    }
  };

  useEffect(() => {
    const executeAsyncFunctions = async (): Promise<void> => {
      setShowLoader(true);
      try {
        const results = await Promise.allSettled([
          fetchWorkflowDetails(),
          // fetchWorkflowHistoryDetails(),
          getCurrentApproverTaskDetails(),
        ]);

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Error during data fetching for function ${index + 1}:`,
              result.reason
            );
          }
        });
      } finally {
        setShowLoader(false);
      }
    };

    if (id) {
      executeAsyncFunctions().catch((e) =>
        console.error("Error during data fetching:", e)
      );
    }
  }, [id, EMPLOYEE_ID]);

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
    <DashboardLayout>
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
            <WorkflowButtons
              currentApproverTaskId={currentApprovertask?.approverTaskId}
              seqNumber={currentApprovertask?.seqNumber ?? 0}
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
        <div className="px-4 pt-3 pb-4 d-flex gap-3 flex-grow-1 row ">
          {currentTab === "form" ? (
            <>
              {/* <VehicleRequisitionForm context={context} /> */}
              {children}
            </>
          ) : currentTab === "history" ? (
            <HistoryComponent />
          ) : currentTab === "workflow" ? (
            <WorkflowComponent
              approverTasks={approverTasks}
              requestStatus={undefined}
              userId={76}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportFormPage;
