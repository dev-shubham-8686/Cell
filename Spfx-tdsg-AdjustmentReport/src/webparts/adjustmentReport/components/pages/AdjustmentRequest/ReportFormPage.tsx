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
import { IAdjustmentReportPhoto } from "../../../interface";
import { useEffect } from "react";
// import { useEffect } from "react";
// import { useGetApprorverFlowData } from "../../../hooks/useGetApprorverFlowData";

const { confirm } = Modal;

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string>("1");
  const [operation, setOperation] = React.useState<string>("");
  const [isSave, setIsSave] = React.useState<boolean>(true);
  const [isAmendReSubmitTask, seIsAmendReSubmitTask] = React.useState<boolean>(false);
  const [approverFlowData, setapproverFlowData] = React.useState<any>([]);
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
  const { data: reportData } = useGetAdjustmentReportById(id ? parseInt(id, 10) : 0);
  const { mutate: getCurrentApprover } = useGetCurrentApprover();
  const { data : approvalData} = useGetApprorverFlowData(id ? parseInt(id, 10) : 0);
  const {data: head} = useGetSectionHead(id ? parseInt(id, 10) : 0);

  const {data: departmentHead} = useGetDepartmentHead(id ? parseInt(id, 10) : 0);
  console.log("approval data",approvalData)
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const goBack = () => {
    navigate(-1);
  };

  const loadData = async () => {
    if (isEditMode || isViewMode) {
      setexistingAdjustmentReport(reportData?.ReturnValue);

      console.log(user?.employeeId,head?.ReturnValue)
      setadvisorRequired(user?.employeeId == parseInt(head?.ReturnValue, 10));

      console.log(user?.employeeId,departmentHead?.ReturnValue)
      setisdepartmentHead(user?.employeeId == parseInt(departmentHead?.ReturnValue, 10));

      if (reportData?.ReturnValue?.IsSubmit) {
        setsubmitted(true);
      }

      if (
        reportData?.ReturnValue?.Status == REQUEST_STATUS.UnderAmendment &&
        reportData?.ReturnValue.EmployeeId == user?.employeeId
      ) {
        setunderAmmendment(true);
      }

      getCurrentApprover(
        {
          AdjustmentReportId: id ? parseInt(id, 10) : 0,
          userId: user?.employeeId ? user?.employeeId : 0
        },
        {
          onSuccess: (data) => {
            console.log("getCurrentApprover data",data)
            setcurrentApproverTask(data.ReturnValue);
          }
        },
      )

      console.log(id ? parseInt(id, 10) : 0, { currentApproverTask }, user?.employeeId ? user?.employeeId : 0)

    }
  };

  React.useEffect(() => {
    void loadData();
  }, [reportData, isEditMode, isViewMode]);


 

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Form",
      children: <RequestForm />,
    },
    {
      key: "2",
      label: "History",
      children: <History />,
    },
    {
      key: "3",
      label: "Workflow",
      children: <Workflow submitted={reportData?.ReturnValue?.IsSubmit} approverTasks={approvalData ? approvalData : []} advisorId={reportData?.ReturnValue?.AdvisorId} />,
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

      {/* {!isViewMode && activeTabKey === "1" && underAmmendment && (
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
      )} */}

      {true && (
        <WorkFlowButtons
          currentApproverTask={currentApproverTask}
          existingAdjustmentReport={existingAdjustmentReport}
          //isFormModified={isEditMode && isViewMode == false ? true : false}
          isFormModified={isEditMode ? true : false}
          departmentHead={existingAdjustmentReport?.DepartmentHeadId==user?.employeeId}
          depDivHead={existingAdjustmentReport?.DeputyDivHead==user?.employeeId}
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

