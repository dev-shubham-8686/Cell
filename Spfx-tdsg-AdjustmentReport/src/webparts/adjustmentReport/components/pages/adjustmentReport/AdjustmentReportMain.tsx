import * as React from "react";
// import PageLayout from "../../pageLayout/PageLayout";
import { Button, Tabs, TabsProps } from "antd";
import AdjustmentReportRequests from "./AdjustmentReportRequests";
import AdjustmentReportApprovals from "./AdjustmentReportApprovals";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
      Request
    </Button>
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "My Requests",
      children: <AdjustmentReportRequests />,
    },
    {
      key: "2",
      label: "Approvals",
      children: <AdjustmentReportApprovals />,
    },
  ];
  return (
    <div className="p-6">
      <Tabs tabBarExtraContent={operations} items={items} />
    </div>
  );
};

export default AdjustmentReportMain;
