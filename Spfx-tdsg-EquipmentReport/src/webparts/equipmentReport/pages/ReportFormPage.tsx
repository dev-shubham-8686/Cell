import * as React from "react";
import{ useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";
import { useAuth } from "../context/AuthContext";
import Workflow from "../components/EquipmentReport/Workflow";
import History from "../components/EquipmentReport/History";
import Form from "../components/EquipmentReport/Form";

type TabName = "form" | "history" | "workflow";

interface ReportFormPageProps {

}

const ReportFormPage: React.FC<ReportFormPageProps> = ({

}) => {
  const { userRole } = useAuth(); // Replace with context
  const navigate = useNavigate();
  const { confirm } = Modal;
  const location = useLocation();
  const { isApproverRequest, currentTabState, fromReviewTab } =
    location.state || {};
  const [currentTab, setCurrentTab] = useState<TabName>("form");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [approverTasks, setApproverTasks] = useState<any[]>([]);
  const [currentApprovertask, setCurrentApprovertask] =
    useState<any>(null);
  const { id } = useParams();

  const onBackClick = (): void => {
    console.log("CURRENTSTATE", currentTabState, fromReviewTab);
    navigate("/trouble-report", {
      state: {
        currentTabState: fromReviewTab
          ? "myreview-tab"
          : isApproverRequest
          ? "myapproval-tab"
          : "myrequest-tab",
      },
    });
  };

  const EMPLOYEE_ID = userRole.employeeId; // Replace with context value

//   const fetchWorkflowDetails = async (): Promise<void> => {
//     try {
//       const response = await getWorkflowDetails(parseInt(id));

//       if (response?.length > 0) {
//         setApproverTasks(response);
//       }

//       console.log("Response workflowDetails ", response);
//     } catch (error) {
//       console.error(
//         "Error in executing the fetchWorkflowDetails function",
//         error
//       );
//     }
//   };

//   const getCurrentApproverTaskDetails = async (): Promise<void> => {
//     try {
//       const response = await getCurrentApproverTask(parseInt(id), EMPLOYEE_ID);

//       console.log("getCurrentApproverTaskDetails", response);

//       if (response) setCurrentApprovertask(response);
//     } catch (error) {
//       console.error("Error while fetching the Approver Task Details");
//     }
//   };

//   useEffect(() => {
//     const executeAsyncFunctions = async (): Promise<void> => {
//       setShowLoader(true);
//       try {
//         const results = await Promise.allSettled([
//           fetchWorkflowDetails(),
//           getCurrentApproverTaskDetails(),
//         ]);

//         results.forEach((result, index) => {
//           if (result.status === "rejected") {
//             console.error(
//               `Error during data fetching for function ${index + 1}:`,
//               result.reason
//             );
//           }
//         });
//       } finally {
//         setShowLoader(false);
//       }
//     };

//     if (id) {
//       executeAsyncFunctions().catch((e) =>
//         console.error("Error during data fetching:", e)
//       );
//     }
//   }, [id, EMPLOYEE_ID]);

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
    // <DashboardLayout>
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
          {/* <div className=" justify-content-right mr-50">
            {console.log("seqNumber", currentApprovertask)}
            <WorkflowButtons
              currentApproverTaskId={currentApprovertask?.approverTaskId}
              seqNumber={currentApprovertask?.seqNumber ?? 0}
            />
          </div> */}
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
           
              <div><Form/></div>
            </>
          ) : currentTab === "history" ? (
            
            <div><History/></div>
          ) : currentTab === "workflow" ? (
           
            <div><Workflow/></div>
          ) : (
            <></>
          )}
        </div>
      </div>
  )
    {/* </DashboardLayout> */}
 
};


export default ReportFormPage;
