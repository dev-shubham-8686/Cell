import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Page from "../page/page";
import EquipmentReportTable from "./dashboard/EquipmentReportTable";
import EquipmentReportApprovalTable from "./dashboard/EquipmentReportApprovalTable";
import AllRequestTable from "./dashboard/AllRequestTable";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


type TabName = "myrequest-tab" | "myapproval-tab" | "allrequest-tab";

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
      name: "My Requests",
    },
    {
      id: "myapproval-tab",
      name: "My Approvals",
    },
    {
      id: "allrequest-tab",
      name: "All Requests",
    },
  ];

  return (
    <Page title="Equipment Improvement Dashboard">
      <div className="content flex-grow-1 p-4">
        <div className="text-end px-4 position-relative">
          <div className="request-btn">
      
            <Link to={"/form/add"}>
              {currentTab == "myrequest-tab" && (
                <button className="btn btn-primary font-16 ">
                  <FontAwesomeIcon className="me-1 mt-50" icon={faCirclePlus} /> New Request
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
                    navigate("/", {
                      state: {
                        currentTabState: tab.id,
                        allReq:(tab.id == "allrequest-tab") ? true : false,
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
          ) : currentTab === "allrequest-tab" ? (
            <>
              <AllRequestTable />
            </>
          ): (
            <></>
          )}
        </div>
      </div>
    </Page>
  );
};

export default TroubleReport;
