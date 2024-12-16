import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import * as React from "react";
import { disabledfutureDate, disabledPastDate } from "../../../utils/helper";
import * as dayjs from "dayjs";
import { useGetAllMachines } from "../../../hooks/useGetAllMachines";
import { useGetAllSubMachines } from "../../../hooks/useGetAllSubMachines";
import { ISubMachine } from "../../../api/GetAllSubMachines.api";
import { IArea } from "../../../api/GetAllAreas.api";
import { useEffect, useState } from "react";
import { useGetCheckedBy } from "../../../hooks/useGetCheckedBy";
import { useGetAllAreas } from "../../../hooks/useGetAllAreas";
import {
  ChangeRiskManagement,
  IAddUpdateReportPayload,
  IAdjustmentReport,
} from "../../../api/AddUpdateReport.api";
import { useUserContext } from "../../../context/UserContext";
import { useGetAdjustmentReportById } from "../../../hooks/useGetAdjustmentReportById";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FileUpload from "../fileUpload/FileUpload";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DocumentLibraries,
  OPERATION,
  REQUEST_STATUS,
  WEB_URL,
} from "../../../GLOBAL_CONSTANT";
import { useAddUpdateReport } from "../../../hooks/useAddUpdateReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  IAdjustmentReportPhoto,
  IAfterImages,
  IBeforeImages,
  IChangeRiskData,
} from "../../../interface";
import { useGetAllSections } from "../../../hooks/useGetAllSections";
import { ColumnsType } from "antd/es/table";
import { useGetAllEmployees } from "../../../hooks/useGetAllEmployees";
import { useGetAllAdvisors } from "../../../hooks/useGetAllAdvisors";
import Operation from "antd/es/transfer/operation";
import { getBase64, renameFolder } from "../../../utils/utility";
import { WebPartContext } from "../../../context/WebPartContext";
import { fromPairs } from "@microsoft/sp-lodash-subset";

const { Option } = Select;
const { TextArea } = Input;

interface RequestFormProps {
  reportData?: any;
  formisLoading?:boolean
}

const RequestForm :React.FC<RequestFormProps> = ({
 reportData,
 formisLoading
}) => {
  const [form] = Form.useForm();
  const currentDateTime = dayjs();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  console.log({ isApproverRequest });
  const [ChangeRiskManagementDetails, setChangeRiskManagementDetails] =
    useState<IChangeRiskData[]>([]);
  const [beforeAdjustmentReportPhotos, setbeforeAdjustmentReportPhotos] =
    useState<IAdjustmentReportPhoto[]>([]);
  const [afterAdjustmentReportPhotos, setafterAdjustmentReportPhotos] =
    useState<IAdjustmentReportPhoto[]>([]);
  const [showOtherSubMachine, setShowOtherSubMachine] = useState(false);

  const [showOtherMachine, setshowOtherMachine] = useState(false);
  const [selectedAdvisor, setselectedAdvisor] = useState<number>(null);
  const [cRMRequired, setCRMRequired] = React.useState<boolean>(false);
  const [formSections, setFormSections] = React.useState<number[]>([0]); // Initially, one form section
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(
    null
  );
  const [beforeImages, setbeforeImages] = useState<IBeforeImages[] | []>([]);

  const [afterImages, setafterImages] = useState<IAfterImages[] | []>([]);
  const { data: employeesResult } = useGetAllEmployees();

  const [filteredSubMachines, setFilteredSubMachines] = useState<ISubMachine[]>(
    []
  );
  const [reportNo, setreportNo] = React.useState<string>("");
  const [cRM, setCRM] = React.useState<ChangeRiskManagement[]>([]);
  //const [isApprovalModalVisible, setApprovalModalVisible] = useState(false);
  const { data: machinesResult, isLoading: machineloading } =
    useGetAllMachines();
  const { data: subMachinesResult, isLoading: submachineloading } =
    useGetAllSubMachines();
  const { data: areasResult, isLoading: arealoading } = useGetAllAreas();
  const { data: sections, isLoading: sectionIsLoading } = useGetAllSections();
  const [selectedMachine, setselectedMachine] = useState<number | 0>(0);
  const [submitted, setsubmitted] = useState(false);
  const [underamendment, setunderamendment] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const webPartContext = React.useContext(WebPartContext);

  const { data: advisors } = useGetAllAdvisors();

  const { data: checkedByResult, isLoading: checkedloading } =
    useGetCheckedBy();
  const { mode, id } = useParams();
  console.log({ id });
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const initialData = {
    dateTime: currentDateTime,
    reportNo: reportNo === undefined ? "" : reportNo,
  };
  const { data: reportDataa } = useGetAdjustmentReportById(
    id ? parseInt(id) : 0
  );
  console.log("GetByIdData", reportData);
  console.log("GetById2", reportDataa);
  const { mutate: addUpdateReport , isLoading:savingData} = useAddUpdateReport();
  // Use effect to sync files with form field value
  useEffect(() => {
    // Update the beforeImages field with the latest files count
    form.setFieldsValue({
      beforeImages: beforeAdjustmentReportPhotos?.length
        ? beforeAdjustmentReportPhotos
        : undefined,
    });
    console.log(form.getFieldValue("beforeImages"));
  }, [beforeAdjustmentReportPhotos]);

  useEffect(() => {
    // Update the beforeImages field with the latest files count
    form.setFieldsValue({
      afterImages: afterAdjustmentReportPhotos?.length
        ? afterAdjustmentReportPhotos
        : undefined,
    });
  }, [afterAdjustmentReportPhotos]);
  const handleAreaChange = (values: any) => {
    if (form.getFieldValue("SectionId") == 3) {
      if (values.includes(1)) {
        form.setFieldsValue({ area: [1] });
      }
    }
  };

  // Use effect to set report data when it becomes available
  const loadData = async () => {
    if (isEditMode || isViewMode) {
      // Populate initial form values
      setreportNo(reportData?.ReturnValue.ReportNo);
      setCRMRequired(reportData?.ReturnValue.ChangeRiskManagementRequired);
      const changeRiskData =
        reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport?.map(
          (obj: any, index: any) => {
            return {
              key: index,
              ...obj,
            };
          }
        );

      setChangeRiskManagementDetails(changeRiskData);
      form.setFieldsValue({
        ...reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport,
        ChangeRiskManagementDetails:
          reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport?.map(
            (data: any) => ({
              ...data,
              DueDate: dayjs(data.DueDate, DATE_FORMAT) ?? null,
            })
          ),
      });

      // if (reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport) {
      //   setFormSections(
      //     Array.from({ length: reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport.length }, (_: any, i: any) => i)
      //   );
      // }
      if (user) {
        setisAdmin(user?.isAdmin);
      }
      if (
        reportData?.ReturnValue.Status == REQUEST_STATUS.UnderAmendment &&
        reportData?.ReturnValue.CreatedBy == user?.employeeId
      ) {
        setunderamendment(true);
      }

      // const crmSectionCount =
      //   reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport.length;
      // const sections = [];
      // for (let i = 0; i < crmSectionCount; i++) {
      //   sections.push(i);
      // }
      // setFormSections(sections);
      if (reportData?.ReturnValue.IsSubmit) {
        setsubmitted(true);
      }

      setselectedMachine(parseInt(reportData?.ReturnValue.MachineName ?? "0")); // Set machine initially
      // setbeforeAdjustmentReportPhotos(
      //   reportData?.ReturnValue?.Photos.BeforeImages
      // );
      setbeforeImages(reportData?.ReturnValue?.BeforeImages);
      setafterImages(reportData?.ReturnValue?.AfterImages);
      // setafterAdjustmentReportPhotos(
      //   reportData?.ReturnValue?.Photos.AfterImages
      // );
      if (reportData?.ReturnValue.MachineName == "-1") {
        setshowOtherMachine(true);
      }
      if (reportData?.ReturnValue.SubMachineName.includes(-2)) {
        setShowOtherSubMachine(true);
      }

      form.setFieldsValue({
        reportNo: reportData?.ReturnValue.ReportNo,
        area: reportData?.ReturnValue.Area,
        machineName: reportData?.ReturnValue.MachineName,
        OtherSubMachine: reportData?.ReturnValue.OtherSubMachineName,
        OtherMachine: reportData?.ReturnValue.OtherMachineName,
        subMachineName: reportData?.ReturnValue.SubMachineName,
        SectionId: reportData?.ReturnValue.SectionId,
        requestedBy: reportData?.ReturnValue.RequestBy,
        checkedBy: reportData?.ReturnValue.CheckedBy,
        dateTime: reportData
          ? dayjs(reportData?.ReturnValue?.When,DATE_TIME_FORMAT)
          : currentDateTime,
        observation: reportData?.ReturnValue.Observation,
        rootCause: reportData?.ReturnValue.RootCause,
        adjustmentDescription: reportData?.ReturnValue.AdjustmentDescription,
        conditionAfterAdjustment:
          reportData?.ReturnValue.ConditionAfterAdjustment,
        describeProblem: reportData?.ReturnValue.DescribeProblem,
      });

      // Pre-filter sub-machines based on the machine from reportData?
      // if (
      //   reportData?.ReturnValue.MachineName &&
      //   subMachinesResult?.ReturnValue
      // ) {
      //   const initialFiltered = subMachinesResult.ReturnValue.filter(
      //     (subMachine: any) =>
      //       subMachine.MachineId === reportData.ReturnValue.MachineName
      //   );
      //   setFilteredSubMachines(initialFiltered);
      // }
    }
  };

  React.useEffect(() => {
    void loadData();
  }, [reportData, isEditMode, isViewMode, subMachinesResult, form]);

  // Handle machine change by user, clearing subMachineName selection
  // const handleMachineChange = (value: any) => {
  //   if (value === "other") {
  //     setshowOtherMachine(true);
  //     form.setFieldValue("machineName", "other"); // Keep only "Other" selected
  //   } else {
  //     setshowOtherMachine(false);
  //     setSelectedMachineId(value); // Update selected machine ID
  //     setFilteredSubMachines([]); // Clear filtered options temporarily
  //     form.setFieldsValue({ subMachineName: [] });
  //     setShowOtherSubMachine(false) // Reset sub-machine selection
  //   }
  // };

  const handleMachineChange = (values: any) => {
    setselectedMachine(values);

    setShowOtherSubMachine(false);

    if (values == -1) {
      setshowOtherMachine(true);
    } else {
      setshowOtherMachine(false);
      form.setFieldsValue({
        OtherMachine: "",
      });
    }
    form.setFieldsValue({
      subMachineName: [],
      OtherSubMachine: "",
    });
  };

  const handleSectionChange = () => {
    form.setFieldsValue({ area: [] });
  };

  const handleSubMachineChange = (values: any) => {
    if (values.includes(-1)) {
      form.setFieldsValue({ subMachineName: [-1] });
      setShowOtherSubMachine(false);
    } else if (values.includes(-2)) {
      setShowOtherSubMachine(true);
    } else {
      setShowOtherSubMachine(false);
      form.setFieldsValue({
        subMachineName: values,
        OtherSubMachine: "",
      });
    }
    console.log("OtherSub", showOtherSubMachine, showOtherMachine);
  };

  const validationRules = {
    Date: [{ required: true, message: "Please Enter Date & Time" }],
    Area: [{ required: true, message: "Please select Area" }],
    CheckedBy: [{ required: true, message: "Please select Checked By" }],
    Section: [{ required: true, message: "Please select Section Name" }],
    Machine: [{ required: true, message: "Please select Machine Name" }],
    OtherMachine: [
      { required: true, message: "Please enter other Machine Name" },
    ],
    SubMachine: [{ required: true, message: "Please select Sub Machine Name" }],
    OtherSubMachine: [
      { required: true, message: "Please enter other Sub Machine Name" },
    ],
    ConditionAfterAdj: [
      { required: true, message: "Please enter Condition After Adjustment" },
    ],
    AdjustmentDescription: [
      { required: true, message: "Please enter Adjustment Description" },
    ],
    RootCause: [{ required: true, message: "Please enter Root Cause" }],
    Observation: [{ required: true, message: "Please enter Observation" }],
    DescribeProblem: [
      { required: true, message: "Please enter Describe Problem" },
    ],
    ImpName: [{ required: true, message: "Please enter Improvement Name" }],
    ImpDesc: [
      { required: true, message: "Please enter Improvement Description" },
    ],
    Purpose: [{ required: true, message: "Please enter Purpose" }],
    CurrSituation: [
      { required: true, message: "Please enter Current Situation" },
    ],
    Changes: [{ required: true, message: "Please enter Changes" }],
    Function: [{ required: true, message: "Please enter Function" }],
    Risks: [{ required: true, message: "Please enter Risk " }],
    Factor: [{ required: true, message: "Please enter Factor/causes" }],
    CounterMeasure: [
      { required: true, message: "Please enter Counter Measure" },
    ],
    DueDate: [{ required: true, message: "Please select Due Date" }],
    Person: [{ required: true, message: "Please select Person In Charge" }],
    Results: [{ required: true, message: "Please enter Results " }],
    TargetDate: [{ required: true, message: "Please select Target Date" }],
    ActualDate: [{ required: true, message: "Please select Actual Date" }],
    ResultMonitoring: [
      { required: true, message: "Please select Result Monitoring" },
    ],
    ResultStatus: [{ required: true, message: "Please enter Result Status" }],
    ResultMonitoringDate: [
      { required: true, message: "Please select Result Monitoring Date" },
    ],

    attachment: [{ required: true, message: "Please upload attachment" }],
  };

  // const handleAdditionalApprovalClick = () => {
  //   setApprovalModalVisible(true);
  // };

  // const handleProceed = (approvalData) => {
  //   // Process the approvalData, which contains selected department heads and sequences
  //   console.log("Additional Approvals:", approvalData);
  //   setApprovalModalVisible(false);

  //   // Here, integrate logic to add department heads to the workflow.
  // };

  // Watch selectedMachineId for updates and filter sub-machines accordingly
  useEffect(() => {
    if (selectedMachineId && subMachinesResult?.ReturnValue) {
      const filtered = subMachinesResult.ReturnValue.filter(
        (subMachine: any) => subMachine.MachineId === selectedMachineId
      );
      setFilteredSubMachines(filtered);
    } else {
      setFilteredSubMachines([]);
    }
  }, [selectedMachineId, subMachinesResult]);

  // const addFormSection = () => {
  //   setFormSections((prevSections) => [...prevSections, prevSections.length]);
  //   console.log({ formSections });
  // };

  // const deleteFormSection = (sectionIndex: number) => {
  //
  //   setFormSections((prevSections) =>
  //     prevSections.filter((_, index) => index !== sectionIndex)
  //   );
  //
  //   form.setFieldsValue({
  //     [`changes-${sectionIndex}`]: "",
  //     [`riskWithChanges-${sectionIndex}`]: "",
  //     [`factor-${sectionIndex}`]: "",
  //     [`counterMeasures-${sectionIndex}`]: "",
  //     [`function-${sectionIndex}`]: "",
  //     [`date-${sectionIndex}`]: "",
  //     [`personInCharge-${sectionIndex}`]: "",
  //     [`results-${sectionIndex}`]: "",
  //   });
  //   const values = form.getFieldsValue();
  //
  //   console.log("CR after deleting ", formSections);
  //   console.log(`Deleted section at index: ${sectionIndex}`);
  // };

  const CreatePayload = (values: any, operation?: any) => {
    console.log("FormData", values);

    const payload: IAddUpdateReportPayload = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      EmployeeId: user?.employeeId,
      SectionId: values.SectionId,
      ReportNo: values.reportNo, //done
      RequestBy: values.requestedBy, //done
      CheckedBy: values.checkedBy, //done
      When: values.dateTime, // need to confirm
      Area: values.area, //done
      MachineName: values.machineName,
      OtherMachineName: values.OtherMachine,
      OtherSubMachineName: values.OtherSubMachine, //done
      SubMachineName: values.subMachineName, //done
      DescribeProblem: values.describeProblem, //done
      Observation: values.observation, //done
      RootCause: values.rootCause, //done
      AdjustmentDescription: values.adjustmentDescription, //done
      ConditionAfterAdjustment: values.conditionAfterAdjustment, // done
      ChangeRiskManagementRequired: cRMRequired, // done
      ChangeRiskManagement_AdjustmentReport: ChangeRiskManagementDetails, // Ensure this is an array of ChangeRiskManagement objects
      IsSubmit:
        operation == OPERATION.Submit || operation == OPERATION.Resubmit, //done
      IsAmendReSubmitTask: operation == OPERATION.Resubmit,
      BeforeImages: beforeImages,
      AfterImages: afterImages,
      CreatedBy: user?.employeeId, //need to change
      CreatedDate: dayjs(),
      ModifiedBy: user?.employeeId, // need to change conditionally
      ModifiedDate: dayjs(), // change conditionally , if modifying then pass only
    };
    return payload;
  };
  const onSaveFormHandler = (values: any, operation?: any) => {
    try {
      const payload = CreatePayload(values, operation);
      //const res =

      addUpdateReport(payload, {
        onSuccess: async (response: any) => {
          if (mode == "add") {
            await renameFolder(
              DocumentLibraries.Adjustment_Attachments,
              WEB_URL,
              webPartContext.spHttpClient,
              user?.employeeId.toString(),
              response?.ReturnValue?.AdjustmentReportNo
            );
            navigate("/");
          }
          navigate("/");
        },
        onError: () => {
          void message.error("Failed to save . Please try again.");
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onSubmitFormHandler = async (values: any, operation?: any) => {
    // await form.validateFields();
    Modal.confirm({
      // title: "Are you sure you want to submit the form?",
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            name="AdvisorId"
            label="Select an advisor"
            rules={[{ required: true, message: "Please select an advisor." }]}
          >
            <Select
              allowClear
              placeholder="Select an advisor"
              options={advisors.map((advisor) => ({
                label: advisor.employeeName,
                value: advisor.employeeId,
              }))}
              onChange={(e) => {
                setselectedAdvisor(e);
                console.log("Advisor", selectedAdvisor);
              }}
            />
          </Form.Item>
        </Form>
      ),
      okText: "Submit",
      cancelText: "Cancel",
      okButtonProps: { className: "btn btn-primary mb-1" },
      cancelButtonProps: { className: "btn-outline-primary" },
      onOk: async () => {
        try {
          const advisorId = form.getFieldValue("AdvisorId");

          await form.validateFields();

          const payload = CreatePayload(values, operation);

          payload.AdvisorId = advisorId;

          await addUpdateReport(payload,{
            onSuccess: async (response: any) => {
              if (mode == "add") {
                await renameFolder(
                  DocumentLibraries.Adjustment_Attachments,
                  WEB_URL,
                  webPartContext.spHttpClient,
                  user?.employeeId.toString(),
                  response?.ReturnValue?.AdjustmentReportNo
                );
                navigate("/");
              }
              navigate("/");
            },
            onError: () => {
              void message.error("Failed to save . Please try again.");
            },
          });

          // navigate("/");
        } catch (error) {
          console.error("Error submitting form:", error);
          throw error;
        }
      },
      onCancel: () => {
        form.setFieldsValue({ AdvisorId: null});
        console.log("Submission cancelled");
      },
    });
  };
  const onResubmitFormHandler = async (values: any, operation?: any) => {
    try {
      //await form.validateFields();
      const payload = CreatePayload(values, operation);
      await addUpdateReport(payload, {
        onSuccess: async (response: any) => {
          console.log("Resubmit Success Res",response)
          navigate("/");
        },
        onError: () => {
          void message.error("Failed to save . Please try again.");
        },
      });

      // navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const onFinish = async (operation?: any) => {
    const values = form.getFieldsValue();
    await form.validateFields();
    if (operation == OPERATION.Save) {
      onSaveFormHandler(values, operation);
    }
    if (operation == OPERATION.Submit) {
      await onSubmitFormHandler(values, operation);
    }
    if (operation == OPERATION.Resubmit) {
      await onResubmitFormHandler(values, operation);
    }
  };

  const handleAdd = (): void => {
    const newData: IChangeRiskData[] = [
      ...ChangeRiskManagementDetails,
      {
        key: ChangeRiskManagementDetails?.length,
        Changes: "",
        FunctionId: "",
        RiskAssociated: "",
        Factor: "",
        CounterMeasures: "",
        DueDate: null,
        PersonInCharge: null,
        Results: "",
      },
    ];
    setChangeRiskManagementDetails(newData);
    console.log(
      "after adding change req data",
      ChangeRiskManagementDetails,
      newData
    );
  };

  const handleDelete = (key: React.Key): void => {
    const newData = ChangeRiskManagementDetails.filter(
      (item) => item.key !== key
    ).map((item, index) => {
      return {
        ...item,
        key: index,
        DueDate: item.DueDate ? dayjs(item.DueDate, DATE_FORMAT) : null,
      };
    });

    console.log("after deleting", ChangeRiskManagementDetails, newData);
    setChangeRiskManagementDetails(newData);
    // form.resetFields();

    form.setFieldsValue({
      ["ChangeRiskManagementDetails"]: newData,
    });
  };

  const onChangeTableData = (
    key: number,
    updateField: string | any,
    value: string | number | string[] | boolean
  ): void => {
    const newData = ChangeRiskManagementDetails.map((item: IChangeRiskData) => {
      if (item.key == key) {
        return {
          ...item, // Spread the existing item
          [updateField]: value, // Update the specific field
        };
      }
      return item;
    });
    setChangeRiskManagementDetails(newData);
    console.log("Uppdated Change risk", ChangeRiskManagementDetails, newData);
  };

  const nestedTableColumns: ColumnsType<any> = [
    {
      title: "Changes",
      dataIndex: "Changes",
      key: "Changes",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "Changes"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "Changes",
              ]) ?? record.employeeId
            }
            rules={validationRules.Changes}
          >
            <Input
              maxLength={100}
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              style={{ width: "100%" }}
              placeholder="Please enter Changes"
              onChange={(e) => {
                onChangeTableData(record.key, "Changes", e.target.value);
              }}
              className="custom-disabled-select"
            />
          </Form.Item>
        );
      },
      width: "30%",
      sorter: false,
    },
    {
      title: "Function",
      dataIndex: "FunctionId",
      key: "FunctionId",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "FunctionId"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "FunctionId",
              ]) ?? record.employeeId
            }
            rules={validationRules.Function}
          >
            <TextArea
              maxLength={1000}
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              style={{ width: "100%" }}
              placeholder="Select function"
              onChange={(e) => {
                onChangeTableData(record.key, "FunctionId", e.target.value);
              }}
              className="custom-disabled-select"
            />
          </Form.Item>
        );
      },
      width: "30%",
      sorter: false,
    },
    {
      title: "Risk Associated with Changes",
      dataIndex: "RiskAssociated ",
      key: "RiskAssociated ",
      render: (_, record) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "RiskAssociated"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "RiskAssociated",
              ]) ?? record.comment
            }
            style={{ margin: 0 }}
            rules={validationRules.Risks}
          >
            <TextArea
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              maxLength={1000}
              placeholder="Enter risks"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "RiskAssociated", e.target.value);
              }}
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Factor/Causes",
      dataIndex: "Factor",
      key: "Factor",
      render: (_, record) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "Factor"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "factor",
              ]) ?? record.comment
            }
            style={{ margin: 0 }}
            rules={validationRules.Factor}
          >
            <TextArea
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              maxLength={1000}
              placeholder="Add Factor"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "Factor", e.target.value);
              }}
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Counter Measures",
      dataIndex: "CounterMeasures",
      key: "CounterMeasures",
      render: (_, record) => {
        return (
          <Form.Item
            name={[
              "ChangeRiskManagementDetails",
              record.key,
              "CounterMeasures",
            ]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "CounterMeasures",
              ]) ?? record.comment
            }
            style={{ margin: 0 }}
            rules={validationRules.CounterMeasure}
          >
            <TextArea
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              maxLength={1000}
              placeholder="Add Counter Measures"
              rows={2}
              onChange={(e) => {
                onChangeTableData(
                  record.key,
                  "CounterMeasures",
                  e.target.value
                );
              }}
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Due Date",
      dataIndex: "DueDate",
      key: "DueDate",
      render: (_, record) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "DueDate"]}
            // initialValue={
            //   record?.DueDate ? dayjs(record.DueDate, "DD-MM-YYYY") : null
            // }
            rules={validationRules.DueDate}
          >
            <DatePicker
              //  value={
              //   record?.DueDate
              //     ? dayjs(record?.DueDate).format(DATE_FORMAT) // Pass the date in correct format to dayjs
              //     : undefined
              // }
              format="DD-MM-YYYY"
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              onChange={(date, dateString) => {
                onChangeTableData(record.key, "DueDate", dateString);
              }}
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Person in Charge",
      dataIndex: "PersonInCharge",
      key: "PersonInCharge",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "PersonInCharge"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "PersonInCharge",
              ]) ?? record.employeeId
            }
            rules={validationRules.Person}
          >
            <Select
              allowClear
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              showSearch
              optionFilterProp="children"
              style={{ width: "100%" }}
              placeholder="Select Person in Charge "
              onChange={(value) => {
                onChangeTableData(record.key, "PersonInCharge", value);
              }}
              filterOption={(input, option) =>
                option?.label
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={employeesResult.ReturnValue?.map((emp) => ({
                label: emp.employeeName,
                value: emp.employeeId,
              }))}
              className="custom-disabled-select"
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Results",
      dataIndex: "Results",
      key: "Results",
      render: (_, record) => {
        return (
          <Form.Item
            name={["ChangeRiskManagementDetails", record.key, "Results"]}
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "Results",
              ]) ?? record.comment
            }
            style={{ margin: 0 }}
            rules={validationRules.Results}
          >
            <TextArea
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              maxLength={1000}
              placeholder="Enter results"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "Results", e.target.value);
              }}
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: <p className="text-center p-0 m-0 ">Action</p>,
      key: "action",
      render: (_, record) => {
        return (
          <div className="action-cell">
            <button
              disabled={
                isViewMode || (!isAdmin && submitted && !underamendment)
              }
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleDelete(record.key);
              }}
            >
              <span>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </div>
        );
      },

      sorter: false,
    },
  ];

  return (
    <>
      <div
      className="button-wrapper"
      >
       
          <div className="button-container" >
            {!isViewMode && (!submitted || underamendment) && (
              <button
                className="btn btn-primary"
                onClick={() => onFinish(OPERATION.Save)}
              >
                <i className="fa-solid fa-floppy-disk" />
                Save
              </button>
            )}

            {!isViewMode && !submitted && (
              <button
                className="btn btn-darkgrey "
                onClick={() => onFinish(OPERATION.Submit)}
              >
                <i className="fa-solid fa-share-from-square" />
                Submit
              </button>
            )}

            {!isViewMode && underamendment && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => onFinish(OPERATION.Resubmit)}
              >
                Resubmit
              </button>
            )}
          </div>
      
      </div>
      <div className="bg-white p-4 form">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={initialData}
        >
          <Row gutter={48} className="mb-3">
            <Col span={6}>
              <Form.Item label="Report No" name="reportNo">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Adjustment Done By"
                name="requestedBy"
                initialValue={user?.employeeName}
              >
                <Input placeholder="-" disabled />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Date & Time"
                name="dateTime"
                rules={validationRules.Date}
              >
                <DatePicker
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  disabledDate={disabledPastDate}
                  showTime
                  placeholder="Date & Time"
                  format={DATE_TIME_FORMAT}
                  className="bg-antdDisabledBg border-antdDisabledBorder w-full"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Checked By"
                name="checkedBy"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  disabled={isViewMode}
                  placeholder="Select Checked By"
                  loading={checkedloading}
                  options={[
                    ...(employeesResult?.ReturnValue?.map((checkedBy) => ({
                      label: checkedBy.employeeName,
                      value: checkedBy.employeeId,
                    })) || []),
                    ...(checkedByResult?.ReturnValue
                      ? [{ label: "Not Applicable", value: -1 }]
                      : []),
                  ]}
                >
                  {employeesResult?.ReturnValue &&
                    employeesResult.ReturnValue.map((checkedBy) => (
                      <Option
                        key={checkedBy.employeeId}
                        value={checkedBy.employeeId}
                      >
                        {checkedBy.employeeName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} className="mb-3">
            <Col span={6}>
              <Form.Item
                label={<span className="text-muted w-95">Section Name</span>}
                name="SectionId"
                rules={validationRules.Section}
              >
                <Select
                  allowClear
                  placeholder="Select Section Name"
                  disabled={isViewMode}
                  showSearch
                  // onChange={handleSectionChange}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={sections?.ReturnValue?.map((section) => ({
                    label: section.sectionName,
                    value: section.sectionId,
                  }))}
                  onChange={handleSectionChange}
                  loading={sectionIsLoading}
                  className="custom-disabled-select"
                >
                  {/* {troubles?.map((trouble) => (
                      <Select.Option
                        key={trouble.troubleId}
                        value={trouble.troubleId}
                      >
                        {trouble.name}
                      </Select.Option>
                    ))} */}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Area" name="area" rules={validationRules.Area}>
                <Select
                  allowClear
                  disabled={isViewMode}
                  mode="multiple"
                  placeholder="Select Area"
                  showSearch={false}
                  loading={arealoading}
                  onChange={handleAreaChange}
                  // onChange={(selected) => {
                  //   if (selected.includes("all")) {
                  //     const allAreaIds =
                  //       areasResult?.ReturnValue.map(
                  //         (area: IArea) => area.AreaId
                  //       ) || [];
                  //     // If "Select All" is checked, select all items. Otherwise, clear selection.
                  //     form.setFieldValue(
                  //       "area",
                  //       selected.length === allAreaIds.length + 1
                  //         ? []
                  //         : allAreaIds
                  //     );
                  //   }
                  // }}
                >
                  {/* "Select All" Option */}
                  {/* <Option key="all" value="all">
                  Select All
                </Option> */}
                  {/* Other Options */}
                  {areasResult?.ReturnValue &&
                    areasResult.ReturnValue.map((area: IArea) => (
                      <Option key={area.AreaId} value={area.AreaId}>
                        {area.AreaName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Machine Name"
                name="machineName"
                rules={validationRules.Machine}
              >
                <Select
                  allowClear
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  placeholder="Select Machine Name"
                  onChange={handleMachineChange}
                  loading={machineloading}
                  options={[
                    ...(machinesResult?.ReturnValue?.map((machine) => ({
                      label: machine.MachineName,
                      value: machine.MachineId,
                    })) || []),
                    ...(machinesResult?.ReturnValue
                      ? [{ label: "Other", value: -1 }]
                      : []),
                  ]}
                />
              </Form.Item>

              {showOtherMachine && (
                <Form.Item
                  label="Other Machine Name"
                  name="OtherMachine"
                  // rules={validationRules.OtherMachine}
                >
                  <TextArea
                    disabled={
                      isViewMode || (!isAdmin && submitted && !underamendment)
                    }
                    rows={1}
                    maxLength={500}
                    placeholder="Enter Other Machine"
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={6}>
              <Form.Item
                label="Sub Machine Name"
                name="subMachineName"
                rules={validationRules.SubMachine}
              >
                <Select
                  allowClear
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  mode="multiple"
                  placeholder="Select Sub Machine Name"
                  onChange={handleSubMachineChange}
                  options={[
                    ...(selectedMachine !== 0 && selectedMachine !== -1
                      ? [{ label: "All", value: -1 }]
                      : []),
                    ...(subMachinesResult?.ReturnValue?.filter(
                      (submachine: ISubMachine) =>
                        submachine.MachineId === selectedMachine
                    )?.map((subdevice: ISubMachine) => ({
                      label: subdevice.SubMachineName,
                      value: subdevice.SubMachineId,
                    })) || []),
                    ...(selectedMachine !== 0
                      ? [{ label: "Other", value: -2 }]
                      : []),
                  ]}
                  loading={submachineloading}
                />
              </Form.Item>

              {showOtherSubMachine && (
                <Form.Item
                  label="Other Sub Machine Name "
                  name="OtherSubMachine"
                  // rules={validationRules.OtherSubMachine}
                >
                  <TextArea
                    disabled={
                      isViewMode || (!isAdmin && submitted && !underamendment)
                    }
                    rows={1}
                    maxLength={500}
                    placeholder="Enter Other Sub Machine"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row gutter={48} className="mb-3">
            <Col span={6}>
              <Form.Item
                label="Describe Problem"
                name="describeProblem"
                rules={validationRules.DescribeProblem}
              >
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the problem"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              {/* Observation */}
              <Form.Item
                label="Observation"
                name="observation"
                rules={validationRules.Observation}
              >
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Enter the observation"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Root Cause"
                name="rootCause"
                rules={validationRules.RootCause}
              >
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the root cause"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Adjustment Description"
                name="adjustmentDescription"
                rules={validationRules.AdjustmentDescription}
              >
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the adjustment made"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48} className="mb-3">
            <Col span={6}>
              <Form.Item
                label="Condition After Adjustment"
                name="conditionAfterAdjustment"
                rules={validationRules.ConditionAfterAdj}
              >
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={2}
                  maxLength={2000}
                  placeholder="Describe the condition after adjustment"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    {beforeImages?.length != 0 ? (
                      <span style={{ color: "#CF1919", fontSize: "1.3rem" }}>
                        *{" "}
                      </span>
                    ) : (
                      ""
                    )}
                    <span className="text-muted">Before Attachments</span>
                  </span>
                }
                name="BeforeImages"
                rules={
                  beforeImages?.length == 0 ? validationRules.attachment : null
                }
              >
                {/* all types except exe  ,  max size -30MB  , no-10*/}
                {console.log("USERID", user?.employeeId.toString())}
                <FileUpload
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  key={`file-upload-before-images`}
                  folderName={
                    form.getFieldValue("reportNo") !== ""
                      ? form.getFieldValue("reportNo")
                      : user?.employeeId.toString()
                  }
                  subFolderName={"Before Images"}
                  libraryName={DocumentLibraries.Adjustment_Attachments}
                  files={beforeImages?.map((a) => ({
                    ...a,
                    uid: a.AdjustmentBeforeImageId?.toString() ?? "",
                    name: a.BeforeImgName,
                    url: "",
                  }))}
                  setIsLoading={(loading: boolean) => {
                    // setIsLoading(loading);
                  }}
                  isLoading={false}
                  onAddFile={async (name: string, url: string, file: File) => {
                    const existingAttachments = beforeImages ?? [];
                    console.log("FILES", existingAttachments);
                    let imageBytes: string | null = null;

                    if (file.type.startsWith("image")) {
                      // Use FileReader to read the file as a Base64-encoded string
                      imageBytes = await getBase64(file);
                    } else {
                      console.error("The file is not an image:", file.type);
                    }
                    
                    const newAttachment: IBeforeImages = {
                      AdjustmentBeforeImageId: 0,
                      AdjustmentreportId: parseInt(id),
                      BeforeImgName: name,
                      BeforeImgPath: url,
                      CreatedBy: user?.employeeId,
                      ModifiedBy: user?.employeeId,
                      BeforeImgBytes: imageBytes,
                    };
                    
                    const updatedAttachments: IBeforeImages[] = [
                      ...existingAttachments,
                      newAttachment,
                    ];
                    void form.validateFields(["BeforeImages"]);

                    setbeforeImages(updatedAttachments);
                  }}
                  onRemoveFile={async (documentName: string) => {
                    const existingAttachments = beforeImages ?? [];

                    const updatedAttachments = existingAttachments?.filter(
                      (doc) => doc.BeforeImgName !== documentName
                    );

                    setbeforeImages(updatedAttachments);

                    console.log("Validation successful after file removal");
                    if (updatedAttachments?.length == 0) {
                      form.setFieldValue("BeforeImages", []);
                    }
                    await form.validateFields(["BeforeImages"]);

                    console.log("File Removed");
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span>
                    {afterImages?.length != 0 ? (
                      <span style={{ color: "#CF1919", fontSize: "1.3rem" }}>
                        *{" "}
                      </span>
                    ) : (
                      ""
                    )}
                    <span className="text-muted">After Attachments</span>
                  </span>
                }
                name="AfterImages"
                rules={
                  afterImages?.length == 0 ? validationRules.attachment : null
                }
              >
                <FileUpload
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  key={`file-upload-after-images`}
                  folderName={
                    form.getFieldValue("reportNo") !== ""
                      ? form.getFieldValue("reportNo")
                      : user?.employeeId.toString()
                  }
                  subFolderName={"After Images"}
                  libraryName={DocumentLibraries.Adjustment_Attachments}
                  files={afterImages?.map((a) => ({
                    ...a,
                    uid: a.AdjustmentAfterImageId?.toString() ?? "",
                    name: a.AfterImgName,
                    url: "",
                  }))}
                  setIsLoading={(loading: boolean) => {
                    // setIsLoading(loading);
                  }}
                  isLoading={false}
                  onAddFile={async (name: string, url: string, file: File) => {
                    const existingAttachments = afterImages ?? [];

                    console.log("FileObject", file);
                    console.log("After Files", existingAttachments);

                    let imageBytes: string | null = null;

                    if (file.type.startsWith("image")) {
                      // Use FileReader to read the file as a Base64-encoded string

                      imageBytes = await getBase64(file);
                    } else {
                      console.error("The file is not an image:", file.type);
                    }

                    const newAttachment: IAfterImages = {
                      AdjustmentAfterImageId: 0,
                      AdjustmentreportId: parseInt(id),
                      AfterImgName: name,
                      AfterImgBytes: imageBytes,
                      AfterImgPath: url,
                      CreatedBy: user?.employeeId,
                      ModifiedBy: user?.employeeId,
                    };

                    const updatedAttachments: IAfterImages[] = [
                      ...existingAttachments,
                      newAttachment,
                    ];

                    void form.validateFields(["AfterImages"]);
                    setafterImages(updatedAttachments);
                  }}
                  onRemoveFile={async (documentName: string) => {
                    const existingAttachments = afterImages ?? [];

                    const updatedAttachments = existingAttachments?.filter(
                      (doc) => doc.AfterImgName !== documentName
                    );

                    setafterImages(updatedAttachments);

                    console.log("Validation successful after file removal");
                    if (updatedAttachments?.length == 0) {
                      form.setFieldValue("AfterImages", []);
                    }
                    await form.validateFields(["AfterImages"]);

                    console.log("After File Removed");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <span style={{ marginRight: 16 }}>
                Change Risk Management Required ?
              </span>
              {console.log(
                "Radio Group",
                form.getFieldValue("cRMRequired"),
                cRMRequired
              )}
              <Radio.Group
                onChange={(e: any) => {
                  setCRMRequired(e.target.value);
                  setChangeRiskManagementDetails([]);
                }}
                value={cRMRequired}
                name="cRMRequired"
                // disabled={isViewMode}
              >
                <Radio
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                      ? !cRMRequired
                      : false
                  }
                  value={true}
                  style={{ marginRight: 16 }}
                >
                  Yes
                </Radio>
                <Radio
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                      ? cRMRequired
                      : false
                  }
                  value={false}
                >
                  No
                </Radio>
              </Radio.Group>
            </div>
          </div>
          {console.log("CHANGE RISK DATA", ChangeRiskManagementDetails)}{" "}
          {cRMRequired ? (
            <div>
              <div className="d-flex justify-content-between my-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "20px", color: "#C50017" }}
                >
                  Change Risk Management
                </p>
                {console.log("Mode", mode)}
                {(mode == "add" || !isViewMode) && (
                  <button
                    className="btn btn-primary mt-3"
                    type="button"
                    onClick={handleAdd}
                  >
                    <i className="fa-solid fa-circle-plus" /> Add
                  </button>
                )}
              </div>
              <Table
                className="change-risk-table"
                dataSource={ChangeRiskManagementDetails}
                columns={nestedTableColumns}
                scroll={{ x: "max-content" }}
                // locale={{
                //   emptyText: (
                //     <div style={{ height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                //       <Empty description="No Data Available" />
                //     </div>
                //   ),
                // }}
              />
            </div>
          ) : (
            <></>
          )}
        </Form>
        <Spin spinning={formisLoading || savingData} fullscreen />
      </div>
    </>
  );
};

export default RequestForm;
