import { Button, Tabs, TabsProps } from "antd";
import * as React from "react";
import AdjustmentRequestForm from "./AdjustmentRequestForm";
import Workflow from "./Workflow";
import History from "./History";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// type TabName = "form" | "history" | "workflow";

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveTabKey(key); // Update activeTabKey when tab changes
  };

  //   const fetchInitialValues = async (id: string) => {};

  const goBack = () => {
    navigate(-1);
  };

  const formRef = React.useRef<any>(null);

  const onSaveRequest = () => {
    if (formRef.current) {
      console.log("Calling submitForm on AdjustmentRequestForm");
      formRef.current.submitForm();
    }
  };

  const handleFormFinish = (values: any) => {
    console.log("Form submitted with values:", values);
    // Perform your API call here
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Form",
      children: (
        <AdjustmentRequestForm ref={formRef} onFinish={handleFormFinish} />
      ),
    },
    {
      key: "2",
      label: "History",
      children: <History />,
    },
    {
      key: "3",
      label: "Workflow",
      children: <Workflow />,
    },
  ];
  return (
    <div>
      <Button
        icon={<LeftOutlined />}
        onClick={goBack}
        type="text"
        className="btn-back no-styles"
      >
        Back
      </Button>
      <Tabs
        activeKey={activeTabKey} // Set active tab key
        onChange={handleTabChange} // Trigger on tab change
        tabBarExtraContent={
          activeTabKey === "1" && ( // Conditionally render Save button if Form tab is active
            <Button onClick={onSaveRequest} className="request-button">
              Save
            </Button>
          )
        }
        items={items}
      />
    </div>
  );
};

export default ReportFormPage;
