import * as React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import Page from "../../page";
import MaterialConsumptionTable from "./materialConsumptionTable";
import MaterialConsumptionApproverTable from "./materialConsumptionApproverTable";

const tabs = [
  {
    id: "myrequest-tab",
    name: "Requests",
  },
  {
    id: "myapproval-tab",
    name: "Approvals",
  },
];

const MaterialConsumptionSlips: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isApproverRequest, currentTabState } = location.state || {};
  const [currentTab, setCurrentTab] = useState(currentTabState ?? "myrequest-tab");
  console.log("CUREENTTAB",location.state,currentTab)

  return (
    <Page title="Material Consumption Dashboard">
      <div className="content flex-grow-1 p-4">
      <div className="request-btn">
        {currentTab === "myrequest-tab" && (
          <div className="text-end">
            <Link to="/form/add">
              <button className="btn btn-primary">
                <FontAwesomeIcon className="me-1 mt-50" icon={faCirclePlus} /> New Request
              </button>
            </Link>
          </div>
          
        )}
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

        <div className="tab-content-dashboard" id="myTabContent">
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
              {currentTab === "myrequest-tab" && <MaterialConsumptionTable />}
              {currentTab === "myapproval-tab" && (
                <MaterialConsumptionApproverTable />
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default MaterialConsumptionSlips;
