import { Button, Modal, Tabs, TabsProps } from "antd";
import * as React from "react";
import Workflow from "./Workflow";
import History from "./History";
import { LeftCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import RequestForm from "./RequestForm";
import { MESSAGES } from "../../../GLOBAL_CONSTANT";
import * as dayjs from "dayjs";
import { IAddUpdateReportPayload } from "../../../api/AddUpdateReport.api";
import { AnyObject } from "antd/es/_util/type";

const { confirm } = Modal;

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string>("1");
  const [isSave, setIsSave] = React.useState<boolean>(true);

  // const { mutate: addUpdateReport } = useAddUpdateReport();

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const goBack = () => {
    navigate(-1);
  };

  const formRef = React.useRef<any>(null);

  const CreatePayload = (values: AnyObject) => {
    const payload: IAddUpdateReportPayload = {
      ReportNo: values.reportNo, //done
      RequestBy: values.requestedBy, //done
      CheckedBy: values.CheckedBy, //done
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
      ChangeRiskManagementList: values.ChangeRiskManagementList, // Ensure this is an array of ChangeRiskManagement objects
      IsSubmit: !isSave, //done
      CreatedBy: 1, //need to change
      CreatedDate: dayjs(),
      ModifiedBy: values.ModifiedById, // need to change conditionally
      ModifiedDate: dayjs(), // change conditionally , if modifying then pass only
    };
    console.log({ payload });
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
          console.log("Data:", values);
          // try {
          //   await addUpdateReport();
          // } catch (error) {
          //   console.error("Error submitting form:", error);
          // }
          CreatePayload(values);
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

  // const CreatePhotosPayload = (photos: AnyObject) => {

  // }

  const handleFormSubmit = (values: any) => {
    console.log({ values });

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
      children: <Workflow />,
    },
  ];

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
        tabBarExtraContent={
          activeTabKey === "1" && (
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
          )
        }
        items={items}
      />
    </div>
  );
};

export default ReportFormPage;
