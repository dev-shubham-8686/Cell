import {
  ConfigProvider,
  Empty,
  Modal,
  Select,
  Spin,
  Table,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { DatePicker, Input, Button, Upload, Form } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DocumentLibraries,
  REQUEST_STATUS,
  WEB_URL,
} from "../../GLOBAL_CONSTANT";
import { ColumnsType } from "antd/es/table";
import {
  IChangeRiskData,
  ICurrentSituationAttachments,
  IEquipmentImprovementReport,
  IImprovementAttachments,
  IPCRNAttchments,
} from "../../interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCreateEditEQReport from "../../apis/equipmentReport/useCreateEditEQReport/useCreateEditEQReport";
import useMachineMaster from "../../apis/masters/useMachineMaster";
import useSubMachineMaster, {
  ISubMachineMaster,
} from "../../apis/masters/useSubMachineMaster";
import useSectionMaster from "../../apis/masters/useSectionMaster";
import useFunctionMaster from "../../apis/masters/useFunctionMaster";
import FileUpload from "../fileUpload/FileUpload";
import { getBase64, renameFolder } from "../../utility/utility";
import { WebPartContext } from "../../context/webpartContext";
import OptionalReviewModal from "../common/OptionalReviewModal";
import useAreaMaster from "../../apis/masters/useAreaMaster";
import SubmitModal from "../common/SubmitModal";
import { IUser, UserContext } from "../../context/userContext";
import useEmployeeMaster from "../../apis/masters/useEmployeeMaster";
import displayjsx from "../../utility/displayjsx";
import useResultMonitorDetails from "../../apis/masters/useResultMonitor";
import useImpCategoryMaster from "../../apis/masters/useImpCategory";

const { TextArea } = Input;

interface ICreateEditEquipmentReportProps {
  reportLoading?: boolean;
  existingEquipmentReport?: IEquipmentImprovementReport;
  mode?: string;
}

const EquipmentReportForm: React.FC<ICreateEditEquipmentReportProps> = ({
  existingEquipmentReport,
  reportLoading,
}) => {
  dayjs.extend(customParseFormat);

  const navigate = useNavigate();
  const { confirm } = Modal;
  const webPartContext = React.useContext(WebPartContext);
  const { id, mode } = useParams();
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<
    IEquipmentImprovementReport | []
  >([]);
  const user: IUser = useContext(UserContext);
  const isModeView = mode === "view" ? true : false;
  const [ChangeRiskManagementDetails, setChangeRiskManagementDetails] =
    useState<IChangeRiskData[]>([]);
  const eqReportSave = useCreateEditEQReport();

  const { data: resultMonitoringDetails, isLoading: ResultMonitorLoading } =
    useResultMonitorDetails();
  const { data: machines, isLoading: deviceIsLoading } = useMachineMaster();
  const { data: areas, isLoading: areaIsLoading } = useAreaMaster();
  const { data: subMachines, isLoading: subMachineIsLoading } =
    useSubMachineMaster();
    const { data: impCategories, isLoading: categoryIsLoading } =
    useImpCategoryMaster();
  const { data: sections, isLoading: sectionIsLoading } = useSectionMaster();
  const { data: employees, isLoading: employeeIsLoading } = useEmployeeMaster();
  const [improvementAttchments, setImprovementAttchments] = useState<
    IImprovementAttachments[] | []
  >([]);
  // const [pcrnAttachments, setpcrnAttachments] = useState<IPCRNAttchments>();
  const [currSituationAttchments, setcurrSituationAttchments] = useState<
    ICurrentSituationAttachments[] | []
  >([]);
  const [selectedMachine, setselectedMachine] = useState<number | 0>(0);
  const [showSubmitModal, setshowSubmitModal] = useState<boolean>(false);
  const [submitted, setsubmitted] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [resultsubmitted, setresultsubmitted] = useState(false);
  const [showOtherSubMachine, setshowOtherSubMachine] =
    useState<boolean>(false);
    const [showOtherImpCategory, setshowOtherImpCategory] =
    useState<boolean>(false);
  const [showOtherMachine, setshowOtherMachine] = useState<boolean>(false);
  // const [pcrnSubmission, setpcrnSubmission] = useState(false);
  const [underAmmendment, setunderAmmendment] = useState(false);
  const [resultUnderAmmendment, setresultUnderAmmendment] = useState(false);
  const [underLogicalAmmendment, setunderLogicalAmmendment] = useState(false);
  const [enableActualDate, setenableActualDate] = useState(false);
  const [enablRMDate, setenablRMDate] = useState(false);
  const [enableResultStatus, setenableResultStatus] = useState(false);
  const [showResultMonitoringDate, setshowResultMonitoringDate] =
    useState(false);

  const handleMachineChange = (values: any) => {
    
    setselectedMachine(values);
    // form.setFieldsValue({
    //   SubMachineName: [],
    // });
    setshowOtherSubMachine(false);

    if (values == -1) {
      
      setshowOtherMachine(true);
      // form.setFieldsValue({
      //   OtherMachineName:existingEquipmentReport?.OtherMachineName ??""
      // });
    } else {
      
      setshowOtherMachine(false);
      form.setFieldsValue({
        OtherMachineName: "",
      });
    }
    form.setFieldsValue({
      SubMachineName: [],
      otherSubMachine: "",
    });
  };
  const handleSubMachineChange = (values: any) => {
    
    if (values.includes(-1)) {
      form.setFieldsValue({ SubMachineName: [-1] });
      setshowOtherSubMachine(false);
    } else if (values.includes(-2)) {
      setshowOtherSubMachine(true);
      // form.setFieldsValue({
      //   SubMachineName: values,
      //   otherSubMachine:existingEquipmentReport?.otherSubMachine ??""
      // });
    } else {
      setshowOtherSubMachine(false);
      form.setFieldsValue({
        SubMachineName: values,
        otherSubMachine: "",
      });
    }
    console.log("OtherSub", showOtherSubMachine, showOtherMachine);
  };

  const handleImpCategoryChange = (values: any) => {
  if (values.includes(-1)) {
      setshowOtherImpCategory(true);
    } 
    else {
      setshowOtherImpCategory(false);
      form.setFieldsValue({
        OtherImprovementCategory: "",
      });
    }
  };
  // const { data: employees, isLoading: employeeisLoading } = useEmployeeMaster();

  const handleAreaChange = (values: any) => {
    if (form.getFieldValue("SectionId") == 3) {
      if (values.includes(1)) {
        form.setFieldsValue({ AreaId: [1] });
      }
    }
  };
  const handleSectionChange = () => {
    form.setFieldsValue({ AreaId: [] });
  };

  const handleModalSubmit = async (sectionHead?: string) => {
    void form.validateFields();

    const values: IEquipmentImprovementReport = form.getFieldsValue();
    values.SectionHeadId = sectionHead
      ? parseInt(sectionHead)
      : existingEquipmentReport?.SectionHeadId;
    values.EquipmentImprovementAttachmentDetails = improvementAttchments;
    values.EquipmentCurrSituationAttachmentDetails = currSituationAttchments;
    values.IsSubmit = true;
    values.isAmendReSubmitTask = false; // Set the sectionHead value in the form values
    values.EquipmentImprovementId = parseInt(id);
    values.IsPcrnRequired = existingEquipmentReport?.IsPcrnRequired
      ? true
      : false;
    values.CreatedBy = id
      ? existingEquipmentReport?.CreatedBy
      : user.employeeId;
    values.ModifiedBy = user?.employeeId;
    if (existingEquipmentReport?.WorkflowStatus == REQUEST_STATUS.W1Completed) {
      let resultDate;
      if (form.getFieldValue("ResultMonitoringId") == 3) {
        resultDate = dayjs().subtract(1, "day");
      } else if (form.getFieldValue("ResultMonitoringId") == 1) {
        resultDate = dayjs().add(7, "day");
      } else {
        resultDate = form.getFieldValue("ResultMonitoringDate");
      }
      values.ResultAfterImplementation = {
        ...values.ResultAfterImplementation,
        PCRNNumber: form.getFieldValue("PCRNNumber"),
        ActualDate: form.getFieldValue("ActualDate"),
        TargetDate: form.getFieldValue("TargetDate"),
        ResultStatus: form.getFieldValue("ResultStatus"),
        ResultMonitoringId: form.getFieldValue("ResultMonitoringId"),
        ResultMonitoringDate: resultDate,
        IsResultSubmit: true,
        IsResultAmendSubmit: false,
      };
    }
    // Call the submit API here

    eqReportSave.mutate(
      { ...values },
      {
        onSuccess: (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          navigate(`/`);
        },
        onError: (error) => {
          console.error("On submit error:", error);
        },
      }
    );
  };

  const onSubmitFormHandler = async (): Promise<void> => {
    // if (
    //   existingEquipmentReport?.IsPcrnRequired ||
    //   existingEquipmentReport?.WorkflowLevel === 2
    // ) {
    try {
      // if (existingEquipmentReport?.Status == REQUEST_STATUS.PCRNPending) {
      //   await form.validateFields(["PcrnAttachments"]);
      // }
      if (existingEquipmentReport?.WorkflowLevel === 2) {
        await form.validateFields([
          "TargetDate",
          "ActualDate",
          "ResultMonitoring",
          "ResultMonitoringDate",
          "ResultStatus",
          "PCRNNumber",
        ]);
      } else {
        
        await form.validateFields();
      }
      Modal.confirm({
        title: "Are you sure you want to submit the form?",
        okText: "Submit",
        okButtonProps: { className: "btn btn-primary mb-1" },
        cancelButtonProps: { className: "btn-outline-primary" },
        cancelText: "Cancel",
        onOk: async () => {
          await handleModalSubmit();
        },
        onCancel: () => {
          console.log("submit canceled");
        },
      });
    } catch (error) {
      // Validation failed, and the modal won't open
      console.log("Validation failed:", error);
    }

    // else {
    //   setshowSubmitModal(true);
    // }
  };

  const handleModalReSubmit = (sectionHead?: string) => {
    const values: IEquipmentImprovementReport = form.getFieldsValue();
    values.EquipmentImprovementId = parseInt(id);
    values.IsSubmit = true;
    values.isAmendReSubmitTask = true;
    values.EquipmentImprovementAttachmentDetails = improvementAttchments;
    values.EquipmentCurrSituationAttachmentDetails = currSituationAttchments;
    values.SectionHeadId = existingEquipmentReport?.SectionHeadId;
    values.IsPcrnRequired = existingEquipmentReport?.IsPcrnRequired
      ? true
      : false;
    values.ModifiedBy = user.employeeId;
    if (existingEquipmentReport?.WorkflowStatus == REQUEST_STATUS.W1Completed) {
      let resultDate;
      if (form.getFieldValue("ResultMonitoringId") == 3) {
        resultDate = dayjs().subtract(1, "day");
      } else if (form.getFieldValue("ResultMonitoringId") == 1) {
        resultDate = dayjs().add(7, "day");
      } else {
        resultDate = form.getFieldValue("ResultMonitoringDate");
      }
      values.ResultAfterImplementation = {
        ...values.ResultAfterImplementation,
        PCRNNumber: form.getFieldValue("PCRNNumber"),
        ActualDate: form.getFieldValue("ActualDate"),
        TargetDate: form.getFieldValue("TargetDate"),
        ResultStatus: form.getFieldValue("ResultStatus"),
        ResultMonitoringId: form.getFieldValue("ResultMonitoringId"),
        ResultMonitoringDate: resultDate,
        IsResultSubmit: true,
        IsResultAmendSubmit: true,
      };
    }

    eqReportSave.mutate(
      { ...values },
      {
        onSuccess: (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          navigate(`/`);
        },
        onError: (error) => {
          console.error("On submit error:", error);
        },
      }
    );
  };

  const onReSubmitFormHandler = async (): Promise<void> => {
    try {
      // if (existingEquipmentReport?.Status == REQUEST_STATUS.PCRNPending) {
      //   await form.validateFields(["PcrnAttachments"]);
      // }
    
        await form.validateFields();
      
      Modal.confirm({
        title: "Are you sure you want to resubmit the form?",
        okText: "Resubmit",
        okButtonProps: { className: "btn btn-primary mb-1" },
        cancelButtonProps: { className: "btn-outline-primary" },
        cancelText: "Cancel",
        onOk: async () => {
          // Call the resubmit function if user confirms
          handleModalReSubmit();
        },
        onCancel: () => {
          // Close the modal if user cancels
          console.log("Resubmit canceled");
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const onSaveAsDraftHandler = async (): Promise<void> => {
    const values: IEquipmentImprovementReport = form.getFieldsValue();
    values.EquipmentImprovementAttachmentDetails = improvementAttchments;
    values.EquipmentCurrSituationAttachmentDetails = currSituationAttchments;
    values.IsPcrnRequired = existingEquipmentReport?.IsPcrnRequired
      ? true
      : false;
    values.SectionHeadId = existingEquipmentReport?.SectionHeadId;
    // values.PcrnAttachments = pcrnAttachments ? pcrnAttachments : null;
    values.IsSubmit = false;
    values.isAmendReSubmitTask = false;
    values.CreatedBy = id
      ? existingEquipmentReport?.CreatedBy
      : user.employeeId;
    values.ModifiedBy = user.employeeId;
    
    if (existingEquipmentReport?.WorkflowStatus == REQUEST_STATUS.W1Completed) {
      
      let resultDate;
      if (form.getFieldValue("ResultMonitoringId") == 3) {
        resultDate = dayjs().subtract(1, "day");
      } else if (form.getFieldValue("ResultMonitoringId") == 1) {
        resultDate = dayjs().add(7, "day");
      } else {
        resultDate = form.getFieldValue("ResultMonitoringDate");
      }
      if (existingEquipmentReport?.IsPcrnRequired) {
      }
      
      values.ResultAfterImplementation = {
        ...values.ResultAfterImplementation,
        PCRNNumber: form.getFieldValue("PCRNNumber"),
        ActualDate: form.getFieldValue("ActualDate"),
        TargetDate: form.getFieldValue("TargetDate"),
        ResultStatus: form.getFieldValue("ResultStatus"),
        ResultMonitoringId: form.getFieldValue("ResultMonitoringId"),
        ResultMonitoringDate: resultDate,
        IsResultSubmit: false,
      };
    }
    
    
    console.log("form saved as draft data", values);
    if (id) {
      values.EquipmentImprovementId = parseInt(id);
    }
    if (underLogicalAmmendment || underLogicalAmmendment) {
      values.IsSubmit = true;
    }
    
    console.log("values", values);
    if (!isAdmin) {
      if (existingEquipmentReport?.WorkflowLevel == 2) {
        
        const fieldsToExclude = [
          "ActualDate",
          "ResultMonitoring",
          "ResultMonitoringDate",
          "ResultStatus",
          "PCRNNumber",
        ];
        
        const allFields = Object.keys(form.getFieldsValue());
        console.log("ALL FIELDS", allFields);
        const fieldsToValidate = allFields.filter(
          (field) => !fieldsToExclude.includes(field)
        );
        await form.validateFields(fieldsToValidate);
        //: TODO Need to update
        await form.validateFields();
      } else {
        

        console.log(
          "CURRENT ATTACHMENT",
          currSituationAttchments,
          form.getFieldValue("EquipmentCurrSituationAttachmentDetails")
        );
        await form.validateFields();
      }
    }
    eqReportSave.mutate(
      { ...values },
      {
        onSuccess: (Response: any) => {
          console.log("ONSAVE RES", Response);
          if (mode == "add") {
            void renameFolder(
              DocumentLibraries.EQ_Report,
              WEB_URL,
              webPartContext.spHttpClient,
              user?.employeeId.toString(),
              Response.ReturnValue.EquipmentImprovementNo
            );
          }
          navigate(`/`);
        },
        onError: (error) => {
          console.error("On Save error:", error);
        },
      }
    );
  };

  const validationRules = {
    When: [{ required: true, message: "Please enter When Date" }],
    Area: [{ required: true, message: "Please select Area" }],
    Section: [{ required: true, message: "Please select Section Name" }],
    Machine: [{ required: true, message: "Please select Machine Name" }],
    ImprovementCategory: [{ required: true, message: "Please select Improvement Category" }],
    OtherImprovementCategory: [
      { required: true, message: "Please enter Other Improvement Category" },
    ],
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
    ActualDate: [
      { required: enableResultStatus, message: "Please select Actual Date" },
    ],
    ResultMonitoring: [
      {
        required: enableResultStatus,
        message: "Please select Result Monitoring",
      },
    ],
    ResultStatus: [
      { required: enableResultStatus, message: "Please enter Result Status" },
    ],
    ResultMonitoringDate: [
      {
        required: enableResultStatus,
        message: "Please select Result Monitoring Date",
      },
    ],

    attachment: [{ required: true, message: "Please upload attachment" }],
    PCRNNumber: [
      { required: enableResultStatus, message: "Please enter PCRN Number" },
    ],
  };

  // const handleSubMachines = async () => {
  //   try {

  //     if (subMachines) {
  //       const trbl = subMachines.map((item: ISubMachineMaster) => {
  //         if (item.SubMachineName.toLowerCase() === "other") {
  //           return {
  //             label: item.sub,
  //             value: -1,
  //           };
  //         }

  //         return {
  //           label: item.name,
  //           value: item.troubleId,
  //         };
  //       });

  //       setTroubles(trbl);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching troubles:", error);
  //   }
  // };
  // useEffect(() => {
  //   //fetch troubles
  //   handleSubMachines().catch((error) => {
  //     console.error("Unhandled promise rejection:", error);
  //   });
  // }, []);

  useEffect(() => {
    // form.setFieldsValue({
    //   ChangeRiskManagementDetails: existingEquipmentReport?.ChangeRiskManagementDetails??ChangeRiskManagementDetails,
    // });
    if (user) {
      setisAdmin(user?.isAdmin);
    }
    if (existingEquipmentReport) {
      const changeRiskData =
        existingEquipmentReport?.ChangeRiskManagementDetails?.map(
          (obj, index) => {
            return {
              key: index,
              ...obj,
            };
          }
        );
      form.setFieldsValue({
        ...existingEquipmentReport,
        ChangeRiskManagementDetails:
          existingEquipmentReport?.ChangeRiskManagementDetails?.map((data) => ({
            ...data,
            DueDate: dayjs(data.DueDate, DATE_FORMAT) ?? null,
          })),
      });
      if (
        existingEquipmentReport?.ResultAfterImplementation
          ?.ResultMonitoringId == 3
      ) {
        setenableResultStatus(true);
      }
      if (existingEquipmentReport?.ResultAfterImplementation?.TargetDate) {
        setenableActualDate(true);
      }
      if (existingEquipmentReport?.ResultAfterImplementation?.ActualDate) {
        setenablRMDate(true);
      }
      if (
        existingEquipmentReport?.ResultAfterImplementation
          ?.ResultMonitoringId == 2
      ) {
        setshowResultMonitoringDate(true);
      }
      if (existingEquipmentReport?.ResultAfterImplementation?.ActualDate) {
        form.setFieldsValue({
          ActualDate: dayjs(
            existingEquipmentReport?.ResultAfterImplementation?.ActualDate,
            DATE_FORMAT
          ),
        });
      }

      if (
        dayjs().isAfter(
          dayjs(
            existingEquipmentReport?.ResultAfterImplementation
              ?.ResultMonitoringDate,
            DATE_FORMAT
          ),
          "day"
        )
      ) {
        setenableResultStatus(true);
      }

      if (
        (existingEquipmentReport?.WorkflowStatus ==
          REQUEST_STATUS.W1Completed ||
          existingEquipmentReport?.Status != REQUEST_STATUS.Approved) &&
        existingEquipmentReport?.ResultAfterImplementation?.TargetDate
      ) {
        form.setFieldsValue({
          TargetDate:
            dayjs(
              existingEquipmentReport?.ResultAfterImplementation?.TargetDate,
              DATE_FORMAT
            ) ?? "-",
          PCRNNumber:
            existingEquipmentReport?.ResultAfterImplementation?.PCRNNumber,
          ResultMonitoringId:
            existingEquipmentReport?.ResultAfterImplementation
              ?.ResultMonitoringId,
          ResultStatus:
            existingEquipmentReport?.ResultAfterImplementation.ResultStatus,
          ResultMonitoringDate: existingEquipmentReport?.ResultAfterImplementation
          ?.ResultMonitoringDate? dayjs(
            existingEquipmentReport?.ResultAfterImplementation
              ?.ResultMonitoringDate,
            DATE_FORMAT
          ):null,
        });
      }
      
      
      // form.setFieldValue([""])
      setImprovementAttchments(
        existingEquipmentReport?.EquipmentImprovementAttachmentDetails ?? []
      );
      
      // setpcrnAttachments(existingEquipmentReport?.PcrnAttachments ?? null);
      setcurrSituationAttchments(
        existingEquipmentReport?.EquipmentCurrSituationAttachmentDetails ?? []
      );
      
      setselectedMachine(parseInt(existingEquipmentReport?.MachineName ?? "0"));
      setChangeRiskManagementDetails(changeRiskData);
      console.log(
        "CHangeRisk data ",
        existingEquipmentReport?.ChangeRiskManagementDetails,
        changeRiskData
      );
      if (existingEquipmentReport?.MachineName == "-1") {
        setshowOtherMachine(true);
      }
      if(existingEquipmentReport?.ImprovementCategory.includes(-1)){
        setshowOtherImpCategory(true)
      }
      if (existingEquipmentReport?.SubMachineName.includes(-2)) {
        setshowOtherSubMachine(true);
      }
      // handleMachineChange(existingEquipmentReport?.MachineName);
      // handleSubMachineChange(existingEquipmentReport?.SubMachineName);

      if (
        existingEquipmentReport?.Status == REQUEST_STATUS.UnderAmendment &&
        existingEquipmentReport?.CreatedBy == user.employeeId &&
        existingEquipmentReport?.WorkflowLevel == 1
      ) {
        setunderAmmendment(true);
      }
      if (
        existingEquipmentReport?.Status == REQUEST_STATUS.UnderAmendment &&
        existingEquipmentReport?.CreatedBy == user.employeeId &&
        existingEquipmentReport?.WorkflowLevel == 2
      ) {
        setresultUnderAmmendment(true);
      }
      if (
        existingEquipmentReport?.Status == REQUEST_STATUS.LogicalAmendment &&
        existingEquipmentReport?.CreatedBy == user.employeeId
      ) {
        setunderLogicalAmmendment(true);
      }
      // if (existingEquipmentReport?.IsPcrnRequired) {
      //   setpcrnSubmission(true);
      // }
      if (existingEquipmentReport?.IsSubmit) {
        setsubmitted(true);
      }
      if (existingEquipmentReport?.ResultAfterImplementation?.IsResultSubmit) {
        setresultsubmitted(true);
      }
    }

    console.log(
      "CHangeRisk data ",
      existingEquipmentReport?.ChangeRiskManagementDetails
    );
  }, [existingEquipmentReport]);

  const handleTargetDateChange = (date: Dayjs | null) => {
    if (date) {
      setenableActualDate(true);
    } else {
      setenableActualDate(false);
      form.setFieldValue("ActualDate", null);
    }
  };
  const handleActualDateChange = (date: Dayjs | null) => {
    if (date) {
      setenablRMDate(true);
      form.setFieldValue("ResultMonitoringDate", null);
    } else {
      setenablRMDate(false);
      form.setFieldValue("ResultMonitoringDate", null);
    }
  };
  const disablePastAndNext7Days = (current) => {
    const actualDate = form.getFieldValue("ActualDate");
    const actualDateDayjs = dayjs(actualDate); // Convert ActualDate to a Day.js object
    const next7Days = actualDateDayjs.add(8, "day");
    return (
      current &&
      (current.isBefore(actualDateDayjs, "day") || current.isBefore(next7Days, "day"))
    );
  };

  const disableActualDates = (current) => {
    const CreatedDate = form.getFieldValue("CreatedDate");
    const actualDateDayjs = dayjs(CreatedDate); // Convert ActualDate to a Day.js object
    const next7Days = actualDateDayjs.add(8, "day");
    return (
      current &&
      (current.isBefore(actualDateDayjs, "day") || current.isBefore(next7Days, "day"))
    );
  };

  const handleResultMonitoringDateChange = () => {
    form.setFieldValue("ResultStatus", "");
    setenableResultStatus(false);
  };

  const handleResultMonitoringChange = (value) => {
    
    // form.setFieldValue("ResultStatus","");
    // setenableResultStatus(false)
    if (value == 2) {
      form.setFieldValue("ResultMonitoringDate", null);
      setshowResultMonitoringDate(true);
      setenableResultStatus(false);
    } else if (value == 3) {
      form.setFieldValue("ResultMonitoringDate", dayjs().subtract(1, "day"));
      //form.setFieldValue("ResultMonitoringDate", null);
      setenableResultStatus(true);
      setshowResultMonitoringDate(false);
    } else {
      const actualDate = form.getFieldValue("ActualDate");
      const resultDate = actualDate?dayjs(actualDate).add(7, "day"): null;
      form.setFieldValue("ResultMonitoringDate", resultDate);
      setshowResultMonitoringDate(false);
      setenableResultStatus(false);
    }
    form.setFieldValue("ResultStatus", "");
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
    updateField: string,
    value: string | number | string[] | boolean
  ): void => {
    const newData = ChangeRiskManagementDetails.map((item: IChangeRiskData) => {
      if (item.key == key) {
        item[updateField] = value;
      }
      return item;
    });
    setChangeRiskManagementDetails(newData);
    console.log("Uppdated Change risk", ChangeRiskManagementDetails, newData);
  };

  console.log("Latest Change risk data", ChangeRiskManagementDetails);
  console.log("SubMachine", subMachines);
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
      width: 120,
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
            {console.log(
              "CHECK",
              existingEquipmentReport?.ChangeRiskManagementDetails[record.key],
              record
            )}
            <DatePicker
              //  value={
              //   record?.DueDate
              //     ? dayjs(record?.DueDate).format(DATE_FORMAT) // Pass the date in correct format to dayjs
              //     : undefined
              // }
              format={DATE_FORMAT}
              disabled={
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
              options={employees?.map((emp) => ({
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
                isModeView ||
                (!isAdmin &&
                  submitted &&
                  !underAmmendment &&
                  (resultsubmitted ? !underLogicalAmmendment : true))
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
              type="button"
              style={{ background: "none", border: "none" }}
              onClick={() => {
                handleDelete(record.key);
              }}
              disabled={
                isModeView ||
                (!isAdmin &&
                  ((submitted &&
                    !underAmmendment &&
                    (resultsubmitted ? !underLogicalAmmendment : true)) ||
                    (existingEquipmentReport?.CreatedBy !== user?.employeeId &&
                      existingEquipmentReport?.Status ===
                        REQUEST_STATUS.Draft)))
              }
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
    <div className="d-flex flex-column gap-3 w-100 h-100">
      <div className={user?.isAdmin?"admin-form-btn-row":"form-btn-row"}>
        <>
          <div className="d-flex gap-3">
            {(mode == "add" ||
              (isAdmin && !isModeView) ||
              (!isModeView &&
                (!submitted ||
                  underAmmendment ||
                  (resultsubmitted && underLogicalAmmendment) ||
                  (existingEquipmentReport?.WorkflowStatus ==
                    REQUEST_STATUS.W1Completed &&
                    existingEquipmentReport?.Status !=
                      REQUEST_STATUS.LogicalAmendment)) &&
                existingEquipmentReport?.CreatedBy === user?.employeeId)) && (
              <button
                className="btn btn-primary"
                onClick={onSaveAsDraftHandler}
              >
                <i className="fa-solid fa-floppy-disk" />
                Save
              </button>
            )}

            {(mode == "add" ||
              (isAdmin && !isModeView && (!submitted && existingEquipmentReport?.CreatedBy==user?.employeeId) ) ||
              (!isModeView &&
                ((!submitted &&
                  existingEquipmentReport?.Status !=
                    REQUEST_STATUS.LogicalAmendment &&
                  existingEquipmentReport?.Status !=
                    REQUEST_STATUS.UnderAmendment) ||
                  (existingEquipmentReport?.WorkflowStatus ==
                    REQUEST_STATUS.W1Completed &&
                    enableResultStatus &&
                    existingEquipmentReport?.Status !=
                      REQUEST_STATUS.LogicalAmendment &&
                    existingEquipmentReport?.Status !=
                      REQUEST_STATUS.UnderAmendment)) &&
                existingEquipmentReport?.CreatedBy === user?.employeeId)) && (
              <button
                className="btn btn-darkgrey "
                onClick={onSubmitFormHandler}
              >
                <i className="fa-solid fa-share-from-square" />
                Submit
              </button>
            )}

            {(underAmmendment ||
              resultUnderAmmendment ||
              existingEquipmentReport?.Status ==
                REQUEST_STATUS.LogicalAmendment) &&
              mode != "view" && (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={onReSubmitFormHandler}
                >
                  Resubmit
                </button>
              )}
          </div>
        </>
      </div>
      <div className="bg-white p-4 form">
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 4,
            },
            components: {
              Form: {
                itemMarginBottom: 16,
                labelRequiredMarkColor: "#CF1919",
              },
              Select: {},
            },
          }}
        >
          {console.log("Form Data", existingEquipmentReport)}
          <Form
            layout="vertical"
            form={form}
            initialValues={existingEquipmentReport}
            onValuesChange={(changedValues, allValues) => {
              console.log("Form Changed Values: ", allValues, changedValues);
            }}
          >
            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={
                    <label className="text-muted mb-0 w-95">
                      Application No.
                    </label>
                  }
                  initialValue={"-"}
                  name="EquipmentImprovementNo"
                  rules={validationRules["ApplicationNo"]}
                >
                  <Input disabled maxLength={100} />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label={
                    <label className="text-muted mb-0 w-95">When Date</label>
                  }
                  //  name="When"
                  rules={validationRules.When}
                >
                  <Input
                    className="w-100"
                    disabled
                    value={
                      existingEquipmentReport?.When
                        ? dayjs(
                            existingEquipmentReport?.When,
                            DATE_TIME_FORMAT
                          ).format(DATE_FORMAT)
                        : "-"
                    }
                  />
                </Form.Item>
              </div>

             

              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Section Name</span>}
                  name="SectionId"
                  rules={validationRules.Section}
                >
                  <Select
                    disabled={
                      isModeView || submitted
                      //  ||
                      // (pcrnSubmission &&
                      //   existingEquipmentReport?.Status !=
                      //     REQUEST_STATUS.Draft &&
                      //   !underAmmendment)
                    }
                    showSearch
                    onChange={handleSectionChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={sections?.map((section) => ({
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

                
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Area</span>}
                  name="AreaId"
                  rules={validationRules.Area}
                >
                  <Select
                    allowClear
                    mode="multiple"
                    disabled={isModeView || submitted}
                    showSearch
                    onChange={handleAreaChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={areas?.map((area) => ({
                      label: area.AreaName,
                      value: area.AreaId,
                    }))}
                    loading={areaIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>
              </div>
              
            </div>
            
            
            
            <div className="row mb-3">
             

              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted w-95">Improvement Category</span>
                  }
                  name="ImprovementCategory"
                  rules={validationRules.ImprovementCategory}
                >
                  <Select
                    allowClear
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    showSearch
                    onChange={handleImpCategoryChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    mode="multiple"
                    options={[
                      
                      ...(impCategories
                        ?.map((cat) => ({
                          label: cat.ImpCategoryName,
                          value: cat.ImpCategoryId,
                        })) || []),
                        ...(impCategories ? [{ label: "Other", value: -1 }] : []),
                    ]}
                    loading={categoryIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>

                {showOtherImpCategory && (
                  <div>
                    <Form.Item
                      label="Other Improvement Category"
                      name="OtherImprovementCategory"
                      initialValue={""}
                      // rules={
                      //   showOtherSubMachine ? validationRules.SubMachine : null
                      // }
                    >
                      <Input
                        maxLength={500}
                        disabled={
                          isModeView || (!isAdmin && submitted && !underAmmendment)
                        }
                        className="w-100"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Machine Name</span>}
                  name="MachineName"
                  rules={validationRules.Machine}
                >
                  <Select
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    showSearch
                    onChange={handleMachineChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      ...(machines?.map((machine) => ({
                        label: machine.MachineName,
                        value: machine.MachineId,
                      })) || []),
                      ...(machines ? [{ label: "Other", value: -1 }] : []),
                    ]}
                    // onChange={(value) => {
                    //   setselectedMachine(value);
                    //   form.setFieldsValue({
                    //     SubMachineName: [],
                    //   });
                    // }}
                    loading={deviceIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>

                {showOtherMachine && (
                  <div>
                    <Form.Item
                      label="Other Machine Name"
                      name="OtherMachineName"
                      initialValue={""}
                      // rules={
                      //   showOtherSubMachine ? validationRules.SubMachine : null
                      // }
                    >
                      <Input
                        maxLength={500}
                        disabled={
                          isModeView ||
                          (!isAdmin && submitted && !underAmmendment)
                        }
                        className="w-100"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
              {console.log("selectedmachine", selectedMachine)}{" "}
              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted w-95">Sub Machine Name</span>
                  }
                  name="SubMachineName"
                  rules={validationRules.SubMachine}
                >
                  <Select
                    allowClear
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    showSearch
                    onChange={handleSubMachineChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    mode="multiple"
                    options={[
                      ...(selectedMachine !== 0 && selectedMachine !== -1
                        ? [{ label: "All", value: -1 }]
                        : []),
                      ...(subMachines
                        ?.filter(
                          (submachine) =>
                            submachine.MachineId === selectedMachine
                        )
                        ?.map((subdevice) => ({
                          label: subdevice.SubMachineName,
                          value: subdevice.SubMachineId,
                        })) || []),
                      ...(selectedMachine !== 0
                        ? [{ label: "Other", value: -2 }]
                        : []),
                    ]}
                    loading={subMachineIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>

                {showOtherSubMachine && (
                  <div>
                    <Form.Item
                      label="Other Sub Machine Name"
                      name="otherSubMachine"
                      initialValue={""}
                      // rules={
                      //   showOtherSubMachine ? validationRules.SubMachine : null
                      // }
                    >
                      <Input
                        maxLength={500}
                        disabled={
                          isModeView ||
                          (!isAdmin && submitted && !underAmmendment)
                        }
                        className="w-100"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Improvement Name</span>}
                  name="ImprovementName"
                  rules={validationRules.ImpName}
                >
                  <TextArea
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    maxLength={100}
                    rows={3}
                  />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Purpose</span>}
                  name="Purpose"
                  rules={validationRules.Purpose}
                >
                  <TextArea
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    maxLength={1000}
                    rows={3}
                  />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                 label={
                  <span>
                    {currSituationAttchments.length != 0? (<span style={{ color: "#CF1919",fontSize: "1.3rem"}}>*  </span>):"" }
                    <span className="text-muted">Current Situation Attachments</span>
                  </span>
                }
                  name="EquipmentCurrSituationAttachmentDetails"
                  rules={
                    currSituationAttchments.length == 0
                      ? validationRules.attachment
                      : null
                  }
                >
                  {/* all types except exe  ,  max size -30MB  , no-10*/}
                  {console.log("USERID", user?.employeeId.toString())}
                  <FileUpload
                  showbutton={true}
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    key={`file-upload-current-situation`}
                    folderName={
                      form.getFieldValue("EquipmentImprovementNo") !== "-"
                        ? form.getFieldValue("EquipmentImprovementNo")
                        : user?.employeeId.toString()
                    }
                    subFolderName={"Current Situation Attachments"}
                    libraryName={DocumentLibraries.EQ_Report}
                    files={currSituationAttchments?.map((a) => ({
                      ...a,
                      uid:
                        a.EquipmentCurrSituationAttachmentId?.toString() ?? "",
                      name: a.CurrSituationDocName,
                      url: "",
                    }))}
                    setIsLoading={(loading: boolean) => {
                      // setIsLoading(loading);
                    }}
                    isLoading={false}
                    onAddFile={async (name: string, url: string,file:File) => {
                      const existingAttachments = currSituationAttchments ?? [];
                      console.log("FILES", existingAttachments);
                      let imageBytes: string | null = null;

                      if (file.type.startsWith("image")) {
                        // Use FileReader to read the file as a Base64-encoded string
                        imageBytes = await getBase64(file);
                      } else {
                        console.error("The file is not an image:", file.type);
                      }
                      const newAttachment: ICurrentSituationAttachments = {
                        EquipmentCurrSituationAttachmentId: 0,
                        EquipmentImprovementId: parseInt(id),
                        CurrSituationDocName: name,
                        CurrSituationDocFilePath: url,
                        CurrentImgBytes:imageBytes,
                        CreatedBy: user?.employeeId,
                        ModifiedBy: user?.employeeId,
                      };

                      const updatedAttachments: ICurrentSituationAttachments[] =
                        [...existingAttachments, newAttachment];

                      void form.validateFields([
                        "EquipmentCurrSituationAttachmentDetails",
                      ]);
                      setcurrSituationAttchments(updatedAttachments);

                      console.log("File Added");
                    }}
                    // onRemoveFile={(documentName: string) => {
                    //   
                    //   const existingAttachments = currSituationAttchments ?? [];

                    //   const updatedAttachments = existingAttachments?.filter(
                    //     (doc) => doc.CurrSituationDocName !== documentName
                    //   );
                    //   setcurrSituationAttchments(updatedAttachments);
                    //   void form.validateFields(["EquipmentCurrSituationAttachmentDetails"]);

                    //   console.log("File Removed");
                    // }}
                    onRemoveFile={async (documentName: string) => {
                      
                      const existingAttachments = currSituationAttchments ?? [];

                      const updatedAttachments = existingAttachments?.filter(
                        (doc) => doc.CurrSituationDocName !== documentName
                      );

                      setcurrSituationAttchments(updatedAttachments);

                      console.log("Validation successful after file removal");
                      if (updatedAttachments?.length == 0) {
                        
                        form.setFieldValue(
                          "EquipmentCurrSituationAttachmentDetails",
                          []
                        );
                      }
                      await form.validateFields([
                        "EquipmentCurrSituationAttachmentDetails",
                      ]);

                      console.log("File Removed");
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            {console.log("CON", isModeView, submitted, underAmmendment)}
            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Current Situation</span>}
                  name="CurrentSituation"
                  rules={validationRules.CurrSituation}
                >
                  <TextArea
                    disabled={
                      isModeView || (!isAdmin && submitted && !underAmmendment)
                    }
                    maxLength={1000}
                    rows={3}
                  />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted">Improvement Description</span>
                  }
                  name="Improvement"
                  rules={validationRules.ImpDesc}
                >
                  <TextArea
                    disabled={
                      isModeView ||
                      (!isAdmin &&
                        submitted &&
                        !underAmmendment &&
                        (resultsubmitted ? !underLogicalAmmendment : true))
                    }
                    maxLength={1000}
                    rows={3}
                  />
                </Form.Item>
              </div>

              {console.log(
                "FILES",
                form.getFieldValue("EquipmentImprovementAttachmentDetails"),
                improvementAttchments
              )}
              <div className="col">
                <Form.Item
                 label={
                  <span>
                    {improvementAttchments.length != 0? (<span style={{ color: "#CF1919",fontSize: "1.3rem"}}>*  </span>):"" }
                    <span className="text-muted">Improvement Attachments</span>
                  </span>
                }
                  
                  name="EquipmentImprovementAttachmentDetails"
                  rules={
                    improvementAttchments.length == 0
                      ? validationRules.attachment
                      : null
                  }
                >
                  {/* all types except exe  ,  max size -30MB  , no-10*/}
                  <FileUpload
                  showbutton={true}
                    disabled={
                      // isModeView ||
                      // !(existingEquipmentReport?.Status==REQUEST_STATUS.LogicalAmendmentInReview)||
                      isModeView ||
                      (!isAdmin &&
                        submitted &&
                        !underAmmendment &&
                        (resultsubmitted ? !underLogicalAmmendment : true))
                    }
                    key={`file-upload-improvement`}
                    folderName={
                      form.getFieldValue("EquipmentImprovementNo") !== "-"
                        ? form.getFieldValue("EquipmentImprovementNo")
                        : user?.employeeId.toString()
                    }
                    subFolderName={"Improvement Attachments"}
                    libraryName={DocumentLibraries.EQ_Report}
                    files={improvementAttchments?.map((a) => ({
                      ...a,
                      uid: a.EquipmentImprovementAttachmentId?.toString() ?? "",
                      name: a.ImprovementDocName,
                      url: "",
                    }))}
                    setIsLoading={(loading: boolean) => {
                      // setIsLoading(loading);
                    }}
                    isLoading={false}
                    onAddFile={async(name: string, url: string,file:File) => {
                      const existingAttachments = improvementAttchments ?? [];
                      console.log("FILES", existingAttachments);
                      let imageBytes: string | null = null;

                      if (file.type.startsWith("image")) {
                        imageBytes = await getBase64(file);
                      } else {
                        console.error("The file is not an image:", file.type);
                      }
                      const newAttachment: IImprovementAttachments = {
                        EquipmentImprovementAttachmentId: 0,
                        EquipmentImprovementId: parseInt(id),
                        ImprovementDocName: name,
                        ImprovementDocFilePath: url,
                        ImprovementImgBytes:imageBytes,
                        CreatedBy: user?.employeeId,
                        ModifiedBy: user?.employeeId,
                      };

                      const updatedAttachments: IImprovementAttachments[] = [
                        ...existingAttachments,
                        newAttachment,
                      ];

                      void form.validateFields([
                        "EquipmentImprovementAttachmentDetails",
                      ]);
                      setImprovementAttchments(updatedAttachments);

                      console.log("File Added");
                    }}
                    onRemoveFile={async (documentName: string) => {
                      const existingAttachments = improvementAttchments ?? [];

                      const updatedAttachments = existingAttachments?.filter(
                        (doc) => doc.ImprovementDocName !== documentName
                      );

                      setImprovementAttchments(updatedAttachments);

                      console.log("Validation successful after file removal");
                      if (updatedAttachments?.length == 0) {
                        
                        form.setFieldValue(
                          "EquipmentImprovementAttachmentDetails",
                          []
                        );
                      }
                      await form.validateFields([
                        "EquipmentImprovementAttachmentDetails",
                      ]);

                      console.log("File Removed");
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between my-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "20px", color: "#C50017" }}
                >
                  Change Risk Management
                </p>
                {console.log("Mode", mode)}
                {(mode == "add" ||
                  (isAdmin && !isModeView) ||
                  (!isModeView &&
                    (!submitted ||
                      underAmmendment ||
                      (resultsubmitted && underLogicalAmmendment)) &&
                    existingEquipmentReport?.CreatedBy ===
                      user?.employeeId)) && (
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
            {/* {existingEquipmentReport?.IsPcrnRequired && (
              <>
                <div className="row">
                  <div className="col mt-3">
                    <Form.Item
                      label={
                        <span className="text-muted">PCRN Attachments</span>
                      }
                      name="PcrnAttachments"
                      rules={
                        !pcrnAttachments ? validationRules.attachment : null
                      }
                    >
                      {console.log("PCRN Attachment", pcrnAttachments)}
                      <FileUpload
                        ispcrnRequired={existingEquipmentReport?.IsPcrnRequired}
                        disabled={isModeView || ((!pcrnSubmission&&submitted) && !underAmmendment)}
                        key={`pcrnAttachments`}
                        folderName={
                          form.getFieldValue("EquipmentImprovementNo") ??
                          user?.employeeId.toString()
                        }
                        subFolderName={"PCRN Attachments"}
                        libraryName={DocumentLibraries.EQ_Report}
                        files={
                          pcrnAttachments
                            ? [
                                {
                                  ...pcrnAttachments,
                                  uid:
                                    pcrnAttachments.PcrnAttachmentId?.toString() ??
                                    "",
                                  name: pcrnAttachments.PcrnDocName,
                                  url: pcrnAttachments.PcrnFilePath,
                                },
                              ]
                            : []
                        }
                        setIsLoading={(loading: boolean) => {
                          // setIsLoading(loading);
                        }}
                        isLoading={false}
                        onAddFile={(name: string, url: string) => {
                          // const existingAttachments = pcrnAttachments ?? [];
                          const newAttachment: IPCRNAttchments = {
                            PcrnAttachmentId: 0,
                            EquipmentImprovementId: parseInt(id),
                            PcrnDocName: name,
                            PcrnFilePath: url,
                            CreatedBy: 76,
                            ModifiedBy: 76,
                            IsDeleted: false,
                          };
                          // const updatedAttachments: IPCRNAttchments[] = [
                          //   ...existingAttachments,
                          //   newAttachment,
                          // ];

                          setpcrnAttachments(newAttachment);

                          console.log("PCRN File Added");
                        }}
                        onRemoveFile={(documentName: string) => {
                          if (
                            pcrnAttachments &&
                            pcrnAttachments?.PcrnDocName === documentName
                          ) {
                            setpcrnAttachments(null);
                            console.log("File pcrn Removed");
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </>
            )} */}
            {(existingEquipmentReport?.WorkflowStatus ==
              REQUEST_STATUS.W1Completed ||
              existingEquipmentReport?.Status == REQUEST_STATUS.Completed ||
              (existingEquipmentReport?.WorkflowLevel == 2)) &&
              existingEquipmentReport?.IsSubmit && (
                // true &&
                <div>
                  <p
                    className="mt-3"
                    style={{ fontSize: "20px", color: "#C50017" }}
                  >
                    Result after Implementation
                  </p>
                  <div className="row mt-3">
                    {existingEquipmentReport?.IsPcrnRequired ? (
                      <div className="col">
                        <Form.Item
                          label={
                            <label className="text-muted mb-0">
                              PCRN Number
                            </label>
                          }
                          name="PCRNNumber"
                          rules={
                            existingEquipmentReport?.WorkflowLevel === 2
                              ? validationRules["PCRNNumber"]
                              : null
                          }
                        >
                          <Input
                            disabled={
                              isModeView ||
                              (!isAdmin &&
                                resultsubmitted &&
                                !resultUnderAmmendment)
                            }
                            className="w-100"
                            maxLength={100}
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">Target Date</label>
                        }
                        name="TargetDate"
                        rules={
                          existingEquipmentReport?.WorkflowLevel === 2
                            ? validationRules["TargetDate"]
                            : null
                        }
                      >
                        <DatePicker
                          format={DATE_FORMAT}
                          disabledDate={(current) => {
                            // future dates only
                            return current && current < dayjs().startOf("day");
                          }}
                          disabled={
                            isModeView ||
                            (!isAdmin &&
                              resultsubmitted &&
                              !resultUnderAmmendment)
                          }
                          onChange={handleTargetDateChange}
                          className="w-100"
                        />
                      </Form.Item>
                    </div>

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">Actual Date</label>
                        }
                        name="ActualDate"
                        rules={
                          existingEquipmentReport?.WorkflowLevel === 2
                            ? validationRules["ActualDate"]
                            : null
                        }
                      >
                        <DatePicker
                          format={DATE_FORMAT}
                          onChange={handleActualDateChange}
                          disabledDate={disableActualDates}
                          disabled={
                            isModeView ||
                            (!isAdmin &&
                              (!enableActualDate ||
                                (resultsubmitted && !resultUnderAmmendment)))
                          }
                          className="w-100"
                        />
                      </Form.Item>
                    </div>

                    <div className="col">
                      <Form.Item
                        label={
                          <span className="text-muted">Result Monitoring</span>
                        }
                        name="ResultMonitoringId"
                        initialValue={
                          resultMonitoringDetails[0]?.resultMonitorId
                        }
                        rules={
                          existingEquipmentReport?.WorkflowLevel === 2
                            ? validationRules["ResultMonitoring"]
                            : null
                        }
                      >
                        <Select
                          disabled={
                            isModeView ||
                            (!isAdmin &&
                              resultsubmitted &&
                              !resultUnderAmmendment)
                          }
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={resultMonitoringDetails?.map((item) => ({
                            label: item.resultMonitorName,
                            value: item.resultMonitorId,
                          }))}
                          onChange={handleResultMonitoringChange}
                          loading={areaIsLoading}
                          className="custom-disabled-select"
                        />
                      </Form.Item>
                    </div>

                    {showResultMonitoringDate && (
                      <div className="col">
                        <Form.Item
                          label={
                            <label className="text-muted mb-0">
                              Result Monitoring Till Date
                            </label>
                          }
                          name="ResultMonitoringDate"
                          rules={
                            existingEquipmentReport?.WorkflowLevel === 2
                              ? validationRules["ResultMonitoringDate"]
                              : null
                          }
                        >
                          <DatePicker
                            onChange={handleResultMonitoringDateChange}
                            format={DATE_FORMAT}
                            disabled={
                              isModeView ||
                              (resultsubmitted && !resultUnderAmmendment) || !enablRMDate
                            }
                            disabledDate={disablePastAndNext7Days}
                            className="w-100"
                          />
                        </Form.Item>
                      </div>
                    )}

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">
                            Result Status
                          </label>
                        }
                        name="ResultStatus"
                        rules={
                          existingEquipmentReport?.WorkflowLevel === 2
                            ? validationRules["ResultStatus"]
                            : null
                        }
                      >
                        <TextArea
                          disabled={
                            isModeView ||
                            (!isAdmin &&
                              (!enableResultStatus ||
                                (resultsubmitted && !resultUnderAmmendment)))
                          }
                          className="w-100"
                          rows={1}
                          maxLength={1000}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              )}
          </Form>
        </ConfigProvider>
      </div>
      <SubmitModal
        visible={showSubmitModal}
        setmodalVisible={setshowSubmitModal}
        onSubmit={handleModalSubmit} // Pass the callback function to modal
      />
      <Spin spinning={reportLoading || eqReportSave.isLoading} fullscreen />
    </div>
  );
};

export default EquipmentReportForm;
