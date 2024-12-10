import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import RequestsTab from "./RequestsTab";
import ApprovalsTab from "./ApprovalsTab";
import "../../../../../../src/styles/customStyles.css";
import AllRequestsTab from "./AllRequestsTab";

const TAB_KEYS = {
  REQUESTS: "1",
  APPROVALS: "3",
  ALLREQUESTS: "4",
};

const TechnicalInstructionList: React.FC = () => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(() => {
    if (location.state?.currentTabState === "myapproval-tab") {
      return TAB_KEYS.APPROVALS;
    } else if (location.state?.currentTabState === "allrequest-tab") {
      return TAB_KEYS.ALLREQUESTS;
    } else {
      return TAB_KEYS.REQUESTS;
    }
  });
  const navigate = useNavigate();

  const tabOperations = (
    <div style={{ marginRight: "34px" }}>
      {activeKey === TAB_KEYS.REQUESTS && (
        <Button
          type="primary"
          onClick={() => navigate("/form/create")}
          icon={<PlusCircleFilled />}
        >
          New Request
        </Button>
      )}
    </div>
  );

  // Refresh content when a tab is clicked
  const handleTabChange = (key: string): void => {
    setActiveKey(key);
  };

  const items = [
    {
      key: TAB_KEYS.REQUESTS,
      label: (
        <span
          className="my-tab-button"
          style={{
            color: activeKey === TAB_KEYS.REQUESTS ? "#c50017" : "#8C8C8C",
            padding: "24px 20px",
          }}
        >
          My Requests
        </span>
      ),
      children: (
        <div
          style={{
            border: "1px solid  #D7DCE4",
            padding: "24px 20px",
          }}
        >
          <RequestsTab />
        </div>
      ),
    },
    {
      key: TAB_KEYS.APPROVALS,
      label: (
        <span
          className="my-tab-button"
          style={{
            color: activeKey === TAB_KEYS.APPROVALS ? "#c50017" : "#8C8C8C",
            padding: "24px 20px",
          }}
        >
          My Approvals
        </span>
      ),
      children: (
        <div
          style={{
            border: "1px solid  #D7DCE4",
            padding: "24px 20px",
          }}
        >
          <ApprovalsTab />
        </div>
      ),
    },
    {
      key: TAB_KEYS.ALLREQUESTS,
      label: (
        <span
          className="my-tab-button"
          style={{
            color: activeKey === TAB_KEYS.ALLREQUESTS ? "#c50017" : "#8C8C8C",
            padding: "24px 20px",
          }}
        >
          All Requests
        </span>
      ),
      children: (
        <div
          style={{
            border: "1px solid  #D7DCE4",
            padding: "24px 20px",
          }}
        >
          <AllRequestsTab />
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="title">TECHNICAL INSTRUCTIONS DASHBOARD</h2>
      <Tabs
        tabBarExtraContent={tabOperations}
        activeKey={activeKey}
        onChange={handleTabChange} // Handle tab change with refresh
        items={items} // Use the new 'items' array
        destroyInactiveTabPane={true}
      />
    </div>
  );
};

export default TechnicalInstructionList;
