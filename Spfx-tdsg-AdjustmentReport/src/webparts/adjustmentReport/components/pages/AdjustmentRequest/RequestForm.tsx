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
  Table,
} from "antd";
import * as React from "react";
import { disabledDate } from "../../../utils/helper";
import * as dayjs from "dayjs";
import ChangeRiskManagementForm from "./ChangeRiskManagementForm";
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
import { renameFolder } from "../../../utils/utility";
import { WebPartContext } from "../../../context/WebPartContext";
import { fromPairs } from "@microsoft/sp-lodash-subset";

const { Option } = Select;
const { TextArea } = Input;

interface RequestFormProps {
  reportData?: any;
}

const RequestForm = React.forwardRef(() => {
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
  const { data: reportData } = useGetAdjustmentReportById(
    id ? parseInt(id) : 0
  );
  console.log("GetByIdData", reportData);
  const { mutate: addUpdateReport } = useAddUpdateReport();
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

  // Handlers for Before Images
  const handleAddBeforeImage = (name: string, url: string) => {
    const newAttachment: IAdjustmentReportPhoto = {
      AdjustmentReportPhotoId: 0,
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      DocumentName: name,
      DocumentFilePath: url,
      IsOldPhoto: true, // Assuming 'before' images are old photos
      SequenceId: beforeAdjustmentReportPhotos.length + 1, // Get the next sequence based on before images
    };

    const updatedAttachments: IAdjustmentReportPhoto[] = [
      ...beforeAdjustmentReportPhotos,
      newAttachment,
    ];

    setbeforeAdjustmentReportPhotos(updatedAttachments);
    form.setFieldsValue({ beforeImages: updatedAttachments });
    console.log({ updatedAttachments });
    console.log({ beforeAdjustmentReportPhotos });
  };

  const handleRemoveBeforeImage = (documentName: string) => {
    const updatedAttachments = beforeAdjustmentReportPhotos
      .filter((doc) => doc.DocumentName !== documentName) // Remove the document by name
      .map((doc, index) => ({
        ...doc,
        SequenceId: index + 1, // Reassign SequenceId after removal
      }));

    setbeforeAdjustmentReportPhotos(updatedAttachments);
    form.setFieldsValue({ beforeImages: updatedAttachments });
    console.log({ beforeAdjustmentReportPhotos });
  };

  // Handlers for After Images
  const handleAddAfterImage = (name: string, url: string) => {
    const newAttachment: IAdjustmentReportPhoto = {
      AdjustmentReportPhotoId: 0,
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      DocumentName: name,
      DocumentFilePath: url,
      IsOldPhoto: false, // Assuming 'after' images are new photos
      SequenceId: afterAdjustmentReportPhotos.length + 1, // Get the next sequence based on after images
    };

    const updatedAttachments: IAdjustmentReportPhoto[] = [
      ...afterAdjustmentReportPhotos,
      newAttachment,
    ];

    setafterAdjustmentReportPhotos(updatedAttachments);
    form.setFieldsValue({ afterImages: updatedAttachments });
    console.log({ updatedAttachments });
    console.log({ afterAdjustmentReportPhotos });
  };

  const handleRemoveAfterImage = (documentName: string) => {
    const updatedAttachments = afterAdjustmentReportPhotos
      .filter((doc) => doc.DocumentName !== documentName) // Remove the document by name
      .map((doc, index) => ({
        ...doc,
        SequenceId: index + 1, // Reassign SequenceId after removal
      }));

    setafterAdjustmentReportPhotos(updatedAttachments);
    form.setFieldsValue({ afterImages: updatedAttachments });
    console.log({ afterAdjustmentReportPhotos });
  };

  // Use effect to set report data when it becomes available
  const loadData = async () => {
    if (isEditMode || isViewMode) {
      // Populate initial form values
      setreportNo(reportData?.ReturnValue.ReportNo);
      setCRMRequired(reportData?.ReturnValue.ChangeRiskManagementRequired);
      setCRM(reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport);
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
      const crmSectionCount =
        reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport.length;
      const sections = [];
      for (let i = 0; i < crmSectionCount; i++) {
        sections.push(i);
      }
      setFormSections(sections);
      if (reportData?.ReturnValue.IsSubmit) {
        setsubmitted(true);
      }
      console.log({ cRM });
      console.log({ formSections });
      console.log(
        reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport
      );
      setselectedMachine(parseInt(reportData?.ReturnValue.MachineName ?? "0")); // Set machine initially
      setbeforeAdjustmentReportPhotos(
        reportData?.ReturnValue?.Photos.BeforeImages
      );
      setbeforeImages(reportData?.ReturnValue?.BeforeImages)
      setafterImages(reportData?.ReturnValue?.AfterImages)
      setafterAdjustmentReportPhotos(
        reportData?.ReturnValue?.Photos.AfterImages
      );
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
          ? dayjs(reportData?.ReturnValue.CreatedDate)
          : currentDateTime,
        observation: reportData?.ReturnValue.Observation,
        rootCause: reportData?.ReturnValue.RootCause,
        adjustmentDescription: reportData?.ReturnValue.AdjustmentDescription,
        conditionAfterAdjustment:
          reportData?.ReturnValue.ConditionAfterAdjustment,
        describeProblem: reportData?.ReturnValue.DescribeProblem,
      });

      // Pre-filter sub-machines based on the machine from reportData?
      if (
        reportData?.ReturnValue.MachineName &&
        subMachinesResult?.ReturnValue
      ) {
        const initialFiltered = subMachinesResult.ReturnValue.filter(
          (subMachine: any) =>
            subMachine.MachineId === reportData.ReturnValue.MachineName
        );
        setFilteredSubMachines(initialFiltered);
      }
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
    When: [{ required: true, message: "Please enter When Date" }],
    Area: [{ required: true, message: "Please select Area" }],
    Section: [{ required: true, message: "Please select Section Name" }],
    Machine: [{ required: true, message: "Please select Machine Name" }],
    OtherMachine: [
      { required: true, message: "Please enter other Machine Name" },
    ],
    SubMachine: [{ required: true, message: "Please select Sub Machine Name" }],
    OtherSubMachine: [
      { required: true, message: "Please enter other Machine Name" },
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
      AfterImages: afterImages ,
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
        onSuccess:async (response:any) => {
          if (mode == "add") {
             await renameFolder(
              DocumentLibraries.Adjustment_Attachments,
              WEB_URL,
              webPartContext.spHttpClient,
              user?.employeeId.toString(),
              response?.ReturnValue?.AdjustmentReportNo
            );
          }
        },
        onError: () => {
          void message.error("Failed to save . Please try again.");
        },
      });
      navigate(-1);
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
        debugger
        try {
          const advisorId = form.getFieldValue("AdvisorId");

           debugger
           if (!advisorId) {
            void message.error("Please Select an Advisor")// Prevents the modal from closing
          }
          const payload = CreatePayload(values, operation);
          debugger
          payload.AdvisorId = advisorId
          debugger
          await addUpdateReport(payload);
          debugger
          //navigate(-1);
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      },
      onCancel: () => {
        console.log("Submission cancelled");
      },
    });
  };
  const onResubmitFormHandler = async (values: any, operation?: any) => {
    try {
      // await form.validateFields();
      const payload = CreatePayload(values, operation);
      await addUpdateReport(payload);

      navigate(-1);
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
  // const handleUpload = async (file: any) => {
  //   const MAX_FILES = 5;
  //   const MAX_FILE_SIZE_MB = 10;
  //   const ALLOWED_FILE_TYPES = [
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "application/vnd.ms-excel",
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     "application/pdf",
  //     "application/vnd.ms-powerpoint",
  //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //   ];

  //   // Check if the file with the same name already exists in the fileList
  //   const isDuplicate = fileList.some(
  //     (existingFile: any) => existingFile.name === file.name
  //   );

  //   if (isDuplicate) {
  //     // Display a message indicating that the file already exists
  //     void displayjsx.showErrorMsg(
  //       `File with the name "${file.name}" already exists.`
  //     );
  //     return false; // Prevent the file from being added to the list
  //   }

  //   // Validate the maximum file count
  //   if (fileList.length >= MAX_FILES) {
  //     void displayjsx.showErrorMsg(
  //       `Cannot upload more than ${MAX_FILES} files.`
  //     );
  //     return false;
  //   }

  //   // Validate file size (convert size from bytes to MB)
  //   const fileSizeInMB = file.size / (1024 * 1024);
  //   if (fileSizeInMB > MAX_FILE_SIZE_MB) {
  //     void displayjsx.showErrorMsg(
  //       `Image "${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
  //     );
  //     return false;
  //   }

  //   // Validate file type using `some` instead of `includes`
  //   const isAllowedFileType = ALLOWED_FILE_TYPES.some(
  //     (type) => type === file.type
  //   );

  //   if (!isAllowedFileType) {
  //     void displayjsx.showErrorMsg(
  //       `Image type not supported. Allowed types are: JPG,JPEG and PNG.`
  //     );
  //     return false;
  //   }

  //   if (isEditMode) {
  //     const folderName = reportNo;
  //     const uploadFileItem = file; // Process only the new file

  //     if (uploadFileItem && folderName) {
  //       try {

  //         // Check and create folder if necessary
  //         const isValidFolder = await checkAndCreateFolder(
  //           webPartContext,
  //           "TechnicalSheetDocs",
  //           folderName
  //         );

  //         console.log(isValidFolder);
  //         // Upload the file
  //         await uploadFile(
  //           webPartContext,
  //           "TechnicalSheetDocs",
  //           folderName,
  //           uploadFileItem,
  //           uploadFileItem.name
  //         );

  //         // Add a record in the technical attachments
  //         await createTechnicalAttachment({
  //           TechnicalId: id,
  //           DocumentName: uploadFileItem.name,
  //           CreatedBy: user?.employeeId,
  //         });

  //         // Refresh the technical instruction to get the updated file list
  //         const data = await getTechnicalInstructionById(id!);
  //         const returnValue = data.ReturnValue;
  //         setFileList(
  //           mapTechnicalAttachments(returnValue.technicalAttachmentAdds)
  //         );
  //         void displayjsx.showSuccess(
  //           `${uploadFileItem.name} saved successfully.`
  //         );
  //       } catch (error) {
  //         void displayjsx.showErrorMsg(
  //           `Failed to saved ${uploadFileItem.name}.`
  //         );
  //         //console.error("Error uploading files:", error);
  //       } finally {
  //       }
  //     }
  //   } else {
  //     if (intialFolderName == "") {
  //       setIntialFolderName(
  //         `${user?.employeeId}_${Date.now().toString().slice(-6)}`
  //       );
  //     } else {
  //     }

  //     const folderName = intialFolderName;

  //     const uploadFileItem = file; // Process only the new file
  //     if (uploadFileItem) {
  //       try {
  //         // Check and create folder if necessary
  //         const isValidFolder = await checkAndCreateFolder(
  //           webPartContext,
  //           "AdjustmentReportDocs",
  //           folderName
  //         );

  //         console.log(isValidFolder);
  //         // Upload the file
  //         await uploadFile(
  //           webPartContext,
  //           "AdjustmentReportDocs",
  //           folderName,
  //           uploadFileItem,
  //           uploadFileItem.name
  //         );

  //         // If no duplicate, add the file to the fileList directly
  //         setFileList([...fileList, file]);
  //       } catch (error) {
  //         void displayjsx.showErrorMsg(
  //           `Failed to saved ${uploadFileItem.name}.`
  //         );
  //       } finally {
  //       }
  //     }
  //   }

  //   // Return false to prevent the default upload behavior
  //   return false;
  // };

  // Forward form instance to parent component
  // React.useImperativeHandle(ref, () => ({
  //   submit: () => {
  //     form.submit();
  //   },
  // }));

  return (
    <>
      <div
        style={{
          position: "relative",
          left: "1580px",
          bottom: "80px",
          zIndex: "1000",
        }}
      >
        <>
          <div className="d-flex gap-3">
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
        </>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={initialData}
      >
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item label="Report No" name="reportNo">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Adjustment Done By" name="requestedBy" 
            initialValue={user?.employeeName}>
              <Input placeholder="-" disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="When"
              name="dateTime"
              rules={[{ required: true, message: "Please Select Date" }]}
            >
              <DatePicker
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                disabledDate={disabledDate}
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
                disabled={isViewMode}
                placeholder="Select Checked By"
                loading={checkedloading}
                options={[
                  ...(checkedByResult?.ReturnValue?.map((checkedBy) => ({
                    label: checkedBy.employeeName,
                    value: checkedBy.employeeId,
                  })) || []),
                  ...(checkedByResult?.ReturnValue
                    ? [{ label: "Not Applicable", value: -1 }]
                    : []),
                ]}
              >
                {checkedByResult?.ReturnValue &&
                  checkedByResult.ReturnValue.map((checkedBy) => (
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
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item
              label={<span className="text-muted w-95">Section Name</span>}
              name="SectionId"
              rules={[{ required: true }]}
            >
              <Select
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
            <Form.Item
              label="Area"
              name="area"
              rules={[
                { required: true, message: "Please select at least one area" },
              ]}
            >
              <Select
                disabled={isViewMode}
                mode="multiple"
                placeholder="Select Area"
                showSearch={false}
                loading={arealoading}
                onChange={(selected) => {
                  if (selected.includes("all")) {
                    const allAreaIds =
                      areasResult?.ReturnValue.map(
                        (area: IArea) => area.AreaId
                      ) || [];
                    // If "Select All" is checked, select all items. Otherwise, clear selection.
                    form.setFieldValue(
                      "area",
                      selected.length === allAreaIds.length + 1
                        ? []
                        : allAreaIds
                    );
                  }
                }}
              >
                {/* "Select All" Option */}
                <Option key="all" value="all">
                  Select All
                </Option>
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
              <Form.Item label="Other Machine Name" name="OtherMachine">
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={1}
                  maxLength={500}
                  placeholder="Provide additional details (optional)"
                />
              </Form.Item>
            )}
          </Col>
          <Col span={6}>
            <Form.Item
              label="Sub-Machine Name"
              name="subMachineName"
              rules={[
                {
                  required: true,
                  message: "Please select at least one sub-machine name",
                },
              ]}
            >
              <Select
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                mode="multiple"
                placeholder="Select Sub-Machine Name"
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
              <Form.Item label="Other SubMachine Name " name="OtherSubMachine">
                <TextArea
                  disabled={
                    isViewMode || (!isAdmin && submitted && !underamendment)
                  }
                  rows={1}
                  maxLength={500}
                  placeholder="Provide additional details (optional)"
                />
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item
              label="Describe Problem"
              name="describeProblem"
              rules={[{ required: true }]}
            >
              <TextArea
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                rows={1}
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
              rules={[{ required: true }]}
            >
              <TextArea
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                rows={4}
                maxLength={2000}
                placeholder="Enter your observation"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Root Cause"
              name="rootCause"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
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
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item
              label="Condition After Adjustment"
              name="conditionAfterAdjustment"
              rules={[
                {
                  required: true,
                  message: "Please upload before images!",
                },
              ]}
            >
              <TextArea
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                rows={4}
                maxLength={2000}
                placeholder="Describe the condition after adjustment"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            {/* <Form.Item
              label="Before Images"
              name="beforeImages"
              rules={[
                {
                  required: true,
                  message: "Please upload before images!",
                },
              ]}
            >
              <FileUpload
                disabled={
                  isViewMode || (!isAdmin && submitted && !underamendment)
                }
                key={`file-upload-before-images`}
                folderName={
                  form.getFieldValue("reportNo") ?? user?.employeeId.toString()
                }
                subFolderName={"BeforeImages"}
                libraryName={DocumentLibraries.Adjustment_Attachments}
                files={beforeAdjustmentReportPhotos?.map((a) => ({
                  ...a,
                  uid: a.AdjustmentReportPhotoId?.toString() ?? "",
                  name: a.DocumentName,
                  url: `${a.DocumentFilePath}`,
                }))}
                setIsLoading={(loading: boolean) => {
                  // setIsLoading(loading);
                }}
                isLoading={false}
                onAddFile={handleAddBeforeImage}
                onRemoveFile={handleRemoveBeforeImage}
                uploadType="before"
              />
            </Form.Item> */}

            <Form.Item
              label={<span className="text-muted">Before Attachments</span>}
              name="BeforeImages"
            >
              {/* all types except exe  ,  max size -30MB  , no-10*/}
              {console.log("USERID", user?.employeeId.toString())}
              <FileUpload
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
                  url: `${WEB_URL}/${a.BeforeImgPath}`,
                }))}
                setIsLoading={(loading: boolean) => {
                  // setIsLoading(loading);
                }}
                isLoading={false}
                onAddFile={(name: string, url: string) => {
                  const existingAttachments = beforeImages ?? [];
                  console.log("FILES", existingAttachments);
                  const newAttachment: IBeforeImages = {
                    AdjustmentBeforeImageId: 0,
                    AdjustmentreportId: parseInt(id),
                    BeforeImgName: name,
                    BeforeImgPath: url,
                    CreatedBy: user?.employeeId,
                    ModifiedBy: user?.employeeId,
                  };

                  const updatedAttachments: IBeforeImages[] = [
                    ...existingAttachments,
                    newAttachment,
                  ];

                  void form.validateFields(["BeforeImages"]);
                  setbeforeImages(updatedAttachments);
                }}
                // onRemoveFile={(documentName: string) => {
                //   debugger
                //   const existingAttachments = currSituationAttchments ?? [];

                //   const updatedAttachments = existingAttachments?.filter(
                //     (doc) => doc.CurrSituationDocName !== documentName
                //   );
                //   setcurrSituationAttchments(updatedAttachments);
                //   void form.validateFields(["EquipmentCurrSituationAttachmentDetails"]);

                //   console.log("File Removed");
                // }}
                onRemoveFile={async (documentName: string) => {
                  debugger;
                  const existingAttachments = beforeImages ?? [];

                  const updatedAttachments = existingAttachments?.filter(
                    (doc) => doc.BeforeImgName !== documentName
                  );

                  setbeforeImages(updatedAttachments);

                  console.log("Validation successful after file removal");
                  if (updatedAttachments?.length == 0) {
                    debugger;
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
              label={<span className="text-muted">After Attachments</span>}
              name="AfterImages"
            >
              <FileUpload
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
                  url: `${WEB_URL}/${a.AfterImgPath}`,
                }))}
                setIsLoading={(loading: boolean) => {
                  // setIsLoading(loading);
                }}
                isLoading={false}
                onAddFile={(name: string, url: string) => {
                  const existingAttachments = afterImages ?? [];
                  console.log("After Files", existingAttachments);
                  const newAttachment: IAfterImages = {
                    AdjustmentAfterImageId: 0,
                    AdjustmentreportId: parseInt(id),
                    AfterImgName: name,
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
                // onRemoveFile={(documentName: string) => {
                //   debugger
                //   const existingAttachments = currSituationAttchments ?? [];

                //   const updatedAttachments = existingAttachments?.filter(
                //     (doc) => doc.CurrSituationDocName !== documentName
                //   );
                //   setcurrSituationAttchments(updatedAttachments);
                //   void form.validateFields(["EquipmentCurrSituationAttachmentDetails"]);

                //   console.log("File Removed");
                // }}
                onRemoveFile={async (documentName: string) => {
                  debugger;
                  const existingAttachments = afterImages ?? [];

                  const updatedAttachments = existingAttachments?.filter(
                    (doc) => doc.AfterImgName !== documentName
                  );

                  setafterImages(updatedAttachments);

                  console.log("Validation successful after file removal");
                  if (updatedAttachments?.length == 0) {
                    debugger;
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 16 }}>
              Change Risk Management Required ?
            </span>
            <Radio.Group
              onChange={(e: any) => {
                setCRMRequired(e.target.value);
                setChangeRiskManagementDetails([]);
              }}
              value={cRMRequired}
              name="cRMRequired"
              disabled={isViewMode}
            >
              <Radio value={true} style={{ marginRight: 16 }}>
                Yes
              </Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
        </div>
        {/* Render multiple form sections */}
        {/* {cRMRequired && (
          <div className="flex justify-end items-center my-3">
            <div className="flex items-center gap-x-4">
              <Button type="primary" onClick={addFormSection}>
                Add
              </Button>
            </div>
          </div>
        )} */}
        {/* {cRMRequired &&
          formSections.map((sectionIndex) => (
            <>
            <ChangeRiskManagementForm
              key={sectionIndex}
              index={sectionIndex}
              form={form}
              initialData={cRM[sectionIndex]} // Pass each section's data directly
            />
            <span>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </>
          ))} */}
        {/* {cRMRequired &&
          formSections.map((sectionIndex) => (
            <div key={sectionIndex}>
              <ChangeRiskManagementForm
                index={sectionIndex}
                form={form}
                initialData={cRM[sectionIndex]}
                isModeview={isViewMode} // Pass each section's data directly
              />
              <span
                style={{
                  cursor: "pointer", // Optional: Indicates that the icon is clickable
                  marginLeft: "10px", // Optional: Adds space between the form and the trash icon
                }}
                onClick={() => deleteFormSection(sectionIndex)} // Add your delete handler here
              >
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          ))} */}
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
        {/* 
        <Button
          onClick={handleAdditionalApprovalClick}
          icon={<FileExcelOutlined />}
        //style={{ display: isRequestorDeptHead ? 'inline' : 'none' }}
        >
          Additional Approval
        </Button>
        <AdditionalApprovalModal
          visible={isApprovalModalVisible}
          onClose={() => setApprovalModalVisible(false)}
          onProceed={handleProceed}
        /> */}
      </Form>
    </>
  );
});

export default RequestForm;
