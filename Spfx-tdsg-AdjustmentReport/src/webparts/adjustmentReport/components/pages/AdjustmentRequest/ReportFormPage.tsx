import { Button, Form, Modal, Tabs, TabsProps } from "antd";
import * as React from "react";
import History from "./History";
import { LeftCircleFilled } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import RequestForm from "./RequestForm";
import { getMessage, REQUEST_STATUS } from "../../../GLOBAL_CONSTANT";
import * as dayjs from "dayjs";
import { IAddUpdateReportPayload } from "../../../api/AddUpdateReport.api";
import { AnyObject } from "antd/es/_util/type";
import { useAddUpdateReport } from "../../../hooks/useAddUpdateReport";
import Workflow from "./WorkflowTab";
import { useUserContext } from "../../../context/UserContext";
import { IAdjustmentReportPhoto } from "../../../interface";
import { useUpdateApproveAskToAmend } from "../../../hooks/useUpdateApproveAskToAmend";
import { IAdditionalDepartmentHeads, IApproveAskToAmendPayload } from "../../../api/UpdateApproveAskToAmend.api";
import { IPullBack } from "../../../api/PullBack.api";
import { usePullBack } from "../../../hooks/usePullBack";
import { useGetAdjustmentReportById } from "../../../hooks/useGetAdjustmentReportById";
import { useGetCurrentApprover } from "../../../hooks/useGetCurrentApprover";
import { useGetApprorverFlowData } from "../../../hooks/useGetApprorverFlowData";
import { useGetSectionHead } from "../../../hooks/useGetSectionHead";
import { useGetDepartmentHead } from "../../../hooks/useGetDepartmentHead";
import WorkFlowButtons from "../../common/workFlowButtons";
// import { useEffect } from "react";
// import { useGetApprorverFlowData } from "../../../hooks/useGetApprorverFlowData";

const { confirm } = Modal;

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string>("1");
  const [operation, setOperation] = React.useState<string>("");
  const [isSave, setIsSave] = React.useState<boolean>(true);
  const [isAmendReSubmitTask, seIsAmendReSubmitTask] = React.useState<boolean>(false);
  //const [approverFlowData, setapproverFlowData] = React.useState<any>([]);
  const { mode, id } = useParams();
  const { user } = useUserContext();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  console.log({ user })
  console.log({ mode })
  const { mutate: addUpdateReport } = useAddUpdateReport();
  const [submitted, setsubmitted] = React.useState(false);
  const [underAmmendment, setunderAmmendment] = React.useState(false);
  const [advisorRequired, setadvisorRequired] = React.useState(false);
  const [isdepartmentHead, setisdepartmentHead] = React.useState(false);
  const [currentApproverTask, setcurrentApproverTask] = React.useState<any>(null);
  const [existingAdjustmentReport, setexistingAdjustmentReport] = React.useState<any>(null);
  const { mutate: askToAmend } = useUpdateApproveAskToAmend();
  const { mutate: pullback } = usePullBack();
  const { data: reportData } = useGetAdjustmentReportById(id ? parseInt(id, 10) : 0);
  const { mutate: getCurrentApprover } = useGetCurrentApprover();
  const { data : approvalData} = useGetApprorverFlowData(id ? parseInt(id, 10) : 0);
  const {data: head} = useGetSectionHead(id ? parseInt(id, 10) : 0);

  const {data: departmentHead} = useGetDepartmentHead(id ? parseInt(id, 10) : 0);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const goBack = () => {
    navigate(-1);
  };

  const loadData = async () => {
    if (isEditMode || isViewMode) {
      setexistingAdjustmentReport(reportData?.ReturnValue);

      console.log(user?.EmployeeId,head?.ReturnValue)
      setadvisorRequired(user?.EmployeeId == parseInt(head?.ReturnValue, 10));

      console.log(user?.EmployeeId,departmentHead?.ReturnValue)
      setisdepartmentHead(user?.EmployeeId == parseInt(departmentHead?.ReturnValue, 10));

      if (reportData?.ReturnValue?.IsSubmit) {
        setsubmitted(true);
      }

      if (
        reportData?.ReturnValue?.Status == REQUEST_STATUS.UnderAmendment &&
        reportData?.ReturnValue.EmployeeId == user?.EmployeeId
      ) {
        setunderAmmendment(true);
      }

      getCurrentApprover(
        {
          AdjustmentReportId: id ? parseInt(id, 10) : 0,
          userId: user?.EmployeeId ? user?.EmployeeId : 0
        },
        {
          onSuccess: (data) => {
            setcurrentApproverTask(data.ReturnValue);
          }
        },
      )

      console.log(id ? parseInt(id, 10) : 0, { currentApproverTask }, user?.EmployeeId ? user?.EmployeeId : 0)

    }
  };

  React.useEffect(() => {
    void loadData();
  }, [reportData, isEditMode, isViewMode]);

  const formRef = React.useRef<any>(null);

  // useEffect(() => {
  //   setapproverFlowData(useGetApprorverFlowData(id ? parseInt(id, 10) : 0).data.ReturnValue);
  // }, []);

  const CreatePayload = (values: AnyObject) => {
    console.log({ values })
    const beforeImages: IAdjustmentReportPhoto[] = values.beforeImages;
    const afterImages: IAdjustmentReportPhoto[] = values.afterImages;

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
      ChangeRiskManagementRequired: values.ChangeRiskManagementRequired, // done
      ChangeRiskManagement_AdjustmentReport: values.ChangeRiskManagementList, // Ensure this is an array of ChangeRiskManagement objects
      IsSubmit: !isSave, //done
      IsAmendReSubmitTask: isAmendReSubmitTask,
      Photos: { BeforeImages: beforeImages, AfterImages: afterImages },
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
        title: getMessage(operation),
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

  const handleSave = (isSave: boolean, operation: string) => {
    setIsSave(isSave);
    setOperation(operation);

    if (operation === "onReSubmit") {
      seIsAmendReSubmitTask(true);
    }

    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleFormSubmit = (values: any) => {
    onSaveFormHandler(true, values);
  };

  const handleApprove = async (comment: string, advisorId: number, approvalSequence : any): Promise<void> => {
    debugger
    const data: IApproveAskToAmendPayload = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.EmployeeId ? user?.EmployeeId : 0,
      Type: 1, //Approved
      Comment: comment,
      AdjustmentId: id ? parseInt(id, 10) : 0,
      AdvisorId : advisorId,
      additionalDepartmentHeads: approvalSequence as IAdditionalDepartmentHeads[],
    };

    askToAmend(
      data,
      {
        onSuccess: (data) => {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });

        }
      }
    );
  };

  const handleAskToAmend = async (comment: string): Promise<void> => {
    const data: IApproveAskToAmendPayload = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.EmployeeId ? user?.EmployeeId : 0,
      Type: 3, //AskToAmend
      Comment: comment,
      AdjustmentId: id ? parseInt(id, 10) : 0,
    };

    askToAmend(
      data,
      {
        onSuccess: (data) => {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });

        }
      }
    );
  };

  const handlePullBack = async (comment: string): Promise<void> => {
    const data: IPullBack = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      userId: user?.EmployeeId ? user?.EmployeeId : 0,
      comment: comment,
    };

    pullback(
      data,
      {
        onSuccess: (data) => {
          navigate("/");
        }
      }
    );
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
      children: <Workflow approverTasks={approvalData ? approvalData : []} />,
    },
  ];

  const extraContent = (
    <div>
      {/* {!isViewMode &&
        activeTabKey === "1" &&
        !submitted && ( //||
          //(currentApproverTask?.userId == user?.employeeId //&& currentApproverTask?.seqNumber != 3)
          <Form.Item
            style={{
              display: "inline-block", // Ensure inline layout
              marginRight: "10px", // Add some space between the buttons
            }}
          >
            <Button
              type="primary"
              onClick={() => handleSave(true, "onSave")}
              className="request-button"
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
          </Form.Item>  
        )} */}

      {/* {!isViewMode && activeTabKey === "1" && !submitted && (
        <Form.Item
          style={{
            display: "inline-block", // Inline display for second button as well
            marginRight: "10px",
          }}
        >
          <Button
            type="primary"
            onClick={() => handleSave(false, "onSubmit")}
            className="request-button"
          >
            Submit
          </Button>
        </Form.Item>
      )} */}

      {!isViewMode && activeTabKey === "1" && underAmmendment && (
        <Form.Item
          style={{
            display: "inline-block", // Inline display for second button as well
            marginRight: "10px",
          }}
        >
          <Button
            type="primary"
            onClick={() => handleSave(false, "onReSubmit")}
            className="request-button"
          >
            Resubmit
          </Button>
        </Form.Item>
      )}

      {true && (
        <WorkFlowButtons
          onApprove={handleApprove}
          onAskToAmend={handleAskToAmend}
          onPullBack={handlePullBack}
          currentApproverTask={currentApproverTask}
          existingAdjustmentReport={existingAdjustmentReport}
          //isFormModified={isEditMode && isViewMode == false ? true : false}
          isFormModified={isEditMode ? true : false}
          advisorRequired={advisorRequired}
          departmentHead={isdepartmentHead}
        />
      )}
    </div>
  );

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

