import React, { useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RequestSection from "../TroubleReport/RequestSection";
import ApprovalSection from "../TroubleReport/ApprovalSection";
import TroubleReview from "../TroubleReport/TroubleReview";

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
      id: "myreview-tab",
      name: "Reviews",
    },
    {
      id: "myapproval-tab",
      name: "Approvals",
    },
  ];

  return (
    <DashboardLayout>
      <div className="content flex-grow-1 p-4">
        <div className="text-end px-4 position-relative">
          <div className="request-btn">
            <Link to={"/form/add"}>
              {currentTab === "myrequest-tab" && (
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
                    navigate("/", {
                      state: {
                        currentTabState: isApproverRequest
                          ? "myapproval-tab"
                          : "myrequest-tab",
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
            <RequestSection />
          ) : currentTab === "myapproval-tab" ? (
            <>
              <ApprovalSection />
            </>
          ) : currentTab === "myreview-tab" ? (
            <>
              <TroubleReview />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TroubleReport;
