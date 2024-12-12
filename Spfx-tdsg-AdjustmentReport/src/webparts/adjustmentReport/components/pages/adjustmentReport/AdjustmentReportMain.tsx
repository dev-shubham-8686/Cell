import * as React from "react";
// import PageLayout from "../../pageLayout/PageLayout";
import { Button, Tabs, TabsProps } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import MyRequest from "./MyRequest";
import MyApproval from "./MyApproval";
import AllRequest from "./AllRequest";

const AdjustmentReportMain: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTabState =
  location.state?.currentTabState || "myrequest-tab";


  const onAddRequest = () => {
    navigate("/form/add");
  };

  const getKeyFromTabState = (tabState: string): string => {
    switch (tabState) {
      case "myapproval-tab":
        return "2";
      case "allrequest-tab":
        return "3";
      default:
        return "1";
    }
  };

  const handleTabChange = (key: string) => {
    navigate("/", {
      state: {
        currentTabState:
          key == "1"
            ? "myrequest-tab"
            : key == "2"
            ? "myapproval-tab"
            : key == "3"
            ? "allrequest-tab"
            : ""
      },
    });
  };
  const operations = (
    <Button
      type="primary"
      className="request-button"
      onClick={() => onAddRequest()}
      icon={<PlusCircleOutlined />}
    >
      New Request
    </Button>
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "My Requests",
      children: <MyRequest />,

      // <AdjustmentReportRequests />
    },
    {
      key: "2",
      label: "My Approvals",
      children: <MyApproval />,
      // <AdjustmentReportApprovals />
    },
    {
      key: "3",
      label: "All Requests",
      children: <AllRequest />,
    },
  ];
  return (
    <div className="p-6">
      <Tabs
        tabBarExtraContent={operations}
        items={items}
        onChange={handleTabChange}
        activeKey={getKeyFromTabState(currentTabState)}
      />
    </div>
  );
};

export default AdjustmentReportMain;
