import { Button, Modal, Tabs, TabsProps } from "antd";
import * as React from "react";
import History from "./History";
import { LeftCircleFilled } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import RequestForm from "./RequestForm";
import { MESSAGES } from "../../../GLOBAL_CONSTANT";
import * as dayjs from "dayjs";
import { IAddUpdateReportPayload } from "../../../api/AddUpdateReport.api";
import { AnyObject } from "antd/es/_util/type";
import { useAddUpdateReport } from "../../../hooks/useAddUpdateReport";
import Workflow from "./WorkflowTab";
import { useUserContext } from "../../../context/UserContext";
// import { useEffect } from "react";
// import { useGetApprorverFlowData } from "../../../hooks/useGetApprorverFlowData";

const { confirm } = Modal;

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string>("1");
  const [isSave, setIsSave] = React.useState<boolean>(true);
  //const [approverFlowData, setapproverFlowData] = React.useState<any>([]);
  const { mode, id } = useParams();
  const { user } = useUserContext();
  console.log({user})
  console.log({ mode })
  const { mutate: addUpdateReport } = useAddUpdateReport();

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const goBack = () => {
    navigate(-1);
  };

  const formRef = React.useRef<any>(null);

  // useEffect(() => {
  //   setapproverFlowData(useGetApprorverFlowData(id ? parseInt(id, 10) : 0).data.ReturnValue);
  // }, []);

  const CreatePayload = (values: AnyObject) => {
    
    const payload: IAddUpdateReportPayload = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      EmployeeId: user?.EmployeeId,
      ReportNo: values.reportNo, //done
      RequestBy: values.requestedBy, //done
      CheckedBy: values.checkedBy, //done
      When: values.dateTime, // need to confirm
      Area: values.area, //done
      MachineName: values.machineName, //done
      SubMachineName: values.subMachineName, //done
      DescribeProblem: values.describeProblem, //done
      Observation: values.observation, //done
      RootCause: values.rootCause, //done
      AdjustmentDescription: values.adjustmentDescription, //done
      ConditionAfterAdjustment: values.conditionAfterAdjustment, // done
      Photos: values.Photos,
      ChangeRiskManagementRequired: values.ChangeRiskManagementRequired, // done
      ChangeRiskManagement_AdjustmentReport: values.ChangeRiskManagementList, // Ensure this is an array of ChangeRiskManagement objects
      IsSubmit: !isSave, //done
      //CreatedBy: values.requestedBy, //need to change
      CreatedDate: dayjs(),
      ModifiedBy: values.ModifiedById, // need to change conditionally
      ModifiedDate: dayjs(), // change conditionally , if modifying then pass only
    };
    return payload;
  };

  const onSaveFormHandler = (showPopUp: boolean, values: any) => {
    if (showPopUp) {
      confirm({
        title: MESSAGES.onSave,
        icon: (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "10px", marginTop: "7px" }}
          />
        ),
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        okButtonProps: { className: "modal-ok-button" },
        onOk: async () => {
          try {
            const payload = CreatePayload(values);
            //const res = 
            addUpdateReport(payload);
            navigate(-1);
          } catch (error) {
            console.error("Error submitting form:", error);
          }
        },
        onCancel() {
          console.log("Cancel submission");
        },
      });
    }
  };

  const handleSave = (isSave: boolean) => {
    setIsSave(isSave);

    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleFormSubmit = (values: any) => {
    onSaveFormHandler(true, values);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Form",
      children: <RequestForm ref={formRef} onFormSubmit={handleFormSubmit} />,
    },
    {
      key: "2",
      label: "History",
      children: <History />,
    },
    {
      key: "3",
      label: "Workflow",
      children: <Workflow approverTasks={[]} />,
    },
  ];
  
  const extraContent = activeTabKey === "1" ? (
    <div>
      <Button
        type="primary"
        onClick={() => handleSave(true)}
        className="request-button"
        style={{ marginRight: "10px" }}
      >
        Save
      </Button>
      <Button
        type="primary"
        onClick={() => handleSave(false)}
        className="request-button"
      >
        Submit
      </Button>
    </div>
  ) : activeTabKey === "3" ? (
    <Button
      type="primary"
      onClick={() => console.log("Additional Approval Action")}
      className="request-button"
    >
      Additional Approval
    </Button>
  ) : null;


  return (
    <div>
      <Button
        icon={<LeftCircleFilled />}
        onClick={goBack}
        type="text"
        className="btn-back no-styles"
      >
        Back
      </Button>
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        tabBarExtraContent={extraContent}
        items={items}
      />
    </div>
  );
};

export default ReportFormPage;

