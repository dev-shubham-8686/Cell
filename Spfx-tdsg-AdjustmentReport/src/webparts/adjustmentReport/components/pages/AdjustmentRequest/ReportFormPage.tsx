import { Button, Form, Modal, Tabs, TabsProps } from "antd";
import * as React from "react";
import History from "./History";
import { LeftCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import PageLayout from "../../pageLayout/PageLayout";
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
  const { data: reportData , isLoading:reportisLoading } = useGetAdjustmentReportById(id ? parseInt(id, 10) : 0);
  const { mutate: getCurrentApprover } = useGetCurrentApprover();
  const { data : approvalData} = useGetApprorverFlowData(id ? parseInt(id, 10) : 0);
  const {data: head} = useGetSectionHead(id ? parseInt(id, 10) : 0);
  const location = useLocation();
  const { isApproverRequest, currentTabState, allReq } =location.state || {};

  const {data: departmentHead} = useGetDepartmentHead(id ? parseInt(id, 10) : 0);
  console.log("approval data",approvalData)
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const goBack = () => {
    navigate("/", {
      state: {
        currentTabState: isApproverRequest ? "myapproval-tab": allReq? "allrequest-tab": "myrequest-tab",
      },
    });
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
      children: <RequestForm  reportData={reportData??[]} formisLoading={reportisLoading}/>,
    },
    {
      key: "2",
      label: "History",
      children: <History />,
    },
    {
      key: "3",
      label: "Workflow",
      children: <Workflow status = {reportData?.ReturnValue?.Status} submitted={reportData?.ReturnValue?.IsSubmit} approverTasks={approvalData ? approvalData : []} advisorId={reportData?.ReturnValue?.AdvisorId} />,
    },
  ];

  const extraContent = (
    <div>
      
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
    <PageLayout title="Adjustment Report Form">
    <div>
      <Button
        icon={<LeftCircleFilled />}
        onClick={goBack}
        type="text"
        className="btn-back"
      >
        Back
      </Button>
      <Tabs
      className="position-relative"
        activeKey={activeTabKey}
        onChange={handleTabChange}
        tabBarExtraContent={extraContent}
        items={items}
      />
    </div>
    </PageLayout>
  );
};

export default ReportFormPage;

