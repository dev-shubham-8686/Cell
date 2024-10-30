import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Page from "../page/page";
import EquipmentReportTable from "./dashboard/EquipmentReportTable";
import EquipmentReportApprovalTable from "./dashboard/EquipmentReportApprovalTable";


type TabName = "myrequest-tab" | "myapproval-tab" | "myreview-tab";

const TroubleReport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest, currentTabState } = location.state || {};
  const [currentTab, setCurrentTab] = useState<TabName>(
    currentTabState ?? "myrequest-tab"
  );
  const tabs: {
    id: TabName;
    name: string;
  }[] = [
    {
      id: "myrequest-tab",
      name: "Requests",
    },
    {
      id: "myapproval-tab",
      name: "Approvals",
    },
  ];

  return (
    <Page title="Equipment Report Dashboard">
      <div className="content flex-grow-1 p-4">
        <div className="text-end px-4 position-relative">
          <div className="request-btn">
      
            <Link to={"/equipment-improvement-report/form/add"}>
              {currentTab == "myrequest-tab" && (
                <button className="btn btn-primary font-16 ">
                  <i className="fa-solid fa-circle-plus me-1" /> Request
                </button>
              )}
            </Link>
          </div>
        </div>

        <ul className="nav nav-tab-bar nav-underline" id="myTab" role="tablist">
          {tabs.map((tab) => {
            return (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    currentTab === tab.id ? "active" : ""
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
                    navigate("/equipment-improvement-report", {
                      state: {
                        currentTabState: tab.id,
                      },
                    });
                  }}
                >
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="tab-content" id="myTabContent">
          {currentTab === "myrequest-tab" ? (
            <EquipmentReportTable />
          ) : currentTab === "myapproval-tab" ? (
            <>
              <EquipmentReportApprovalTable />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Page>
  );
};

export default TroubleReport;
