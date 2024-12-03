import * as React from "react";
// import PageLayout from "../../pageLayout/PageLayout";
import { Button, Tabs, TabsProps } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdjustmentReportRequests from "./AdjustmentReportRequests";
import AdjustmentReportApprovals from "./AdjustmentReportApprovals";
import MyRequest from "./MyRequest";
import MyApproval from "./MyApproval";
import AllRequest from "./AllRequest";

const AdjustmentReportMain: React.FC = () => {
  const navigate = useNavigate();
  const onAddRequest = () => {
    navigate("/form/add");
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
      children: <MyRequest/>
      
      // <AdjustmentReportRequests />
      ,
    },
    {
      key: "2",
      label: "My Approvals",
      children: <MyApproval/>
      // <AdjustmentReportApprovals />
      ,
    },
    {
      key: "3",
      label: "All Requests",
      children: <AllRequest/>
      ,
    },
  ];
  return (
    <div className="p-6">
      <Tabs tabBarExtraContent={operations} items={items} />
    </div>
  );
};

export default AdjustmentReportMain;
