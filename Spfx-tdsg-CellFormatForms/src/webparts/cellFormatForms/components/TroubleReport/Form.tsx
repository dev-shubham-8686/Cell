/* eslint-disable max-lines */
import {
  ConfigProvider,
  InputNumber,
  Modal,
  Select,
  Spin,
  Switch,
  Table,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import { DatePicker, Input, Checkbox, Upload, Form } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "antd/es/form/Form";
import {
  IReviewManagerPayload,
  InsertUpdateTroubleReportSection,
  NotifytoMembers,
  ReviewbyManagers,
  TroubleReportSubmitPayload,
  getCurrentAprrovalRole,
  getTroubleReport,
  onReview,
  sendToManager,
  submitTroubleReport,
} from "../utils/Handler/FormSubmission";
import { ColumnsType } from "antd/es/table";
import FormButtons from "../Common/FormButtons";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DocumentLibraries,
  Levels,
  MESSAGES,
  REQUEST_STATUS,
  RoleNames,
  ServiceUrl,
} from "../GLOBAL_CONSTANT";
import attachment, { handlePreviewFile } from "../utils/attachment";
import { ExclamationCircleOutlined, DownloadOutlined } from "@ant-design/icons";

import {
  deleteFolderFile,
  uploadAttachment,
} from "../utils/Handler/Attachment";
import { Attachment_toPayload } from "../utils/Handler/formatter";
import { AxiosInstance as axios } from "../utils/Handler";

const { TextArea } = Input;
export interface ITroubleReportDetails {
  CreatedBy: number;
  troubleRevisedId: number;
  sequenceNumber: number;
  troubleReportNo: string;
  approverTaskId: number;
  when: Date;
  breakDownMin: string;
  reportTitle: string;
  process: string;
  processingLot: string;
  NG: boolean;
  NGlotAndQuantity: string;
  PHlotAndQuantity: string;
  ProductHold: boolean;
  troubleType: number[];
  restarted: boolean;
  employeeId: number[];
  troubleBriefExplanation: string;
  immediateCorrectiveAction: string;
  pca: Date;
  status: string;
  closure: Date;
  rootCause: string;
  isAdjustMentReport: boolean;
  adjustmentReport: string;
  isSubmit: boolean;
  otherTroubleType: string;
  completionDate: Date;
  TroubleAttachmentDetails: any[];
  WorkDoneData: {
    key: any;
    employeeId: number; // Adjust based on actual type
    lead: boolean;
    comment: string;
  }[];
  isReOpen: boolean;
  remarks: string;
  reportLevel: number;
  permanantCorrectiveAction: string;
  departmentHeadId: number;
}

interface ISendToManagerPayload {
  userId: number;
  troubleReportId: number;
}

export interface getCurrentRoleResponse {
  displayName: string;
  processName: string;
  reviewerId: number;
  isSaved: boolean;
  isSubmit: boolean; // this is showing that form is review by the both managers and now you can show submit button
  isReviewed: boolean; // this is showing that form currently is in review
  reviewerTaskMasterId: number;
  status: string;
  troubleReportId: number;
}

export interface ICurrentReviewRole {
  isRaiser: boolean;
  isReviewRM: boolean;
  isRM: boolean;
  isWorkDoneMember: boolean;
  isWorkDoneLead: boolean;
  status: string;
}

interface IWorkDoneBy {
  key: number;
  employeeId: number;
  comment: string;
  lead: boolean;
  [key: string]: any;
}
interface TroubleItem {
  troubleId: number;
  name: string;
}
interface IProps {
  context: any;
}
const ReportForm: React.FC<IProps> = ({ context }) => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const { confirm, info } = Modal;
  const [form] = useForm();
  const [workDone, setWorkDone] = useState<IWorkDoneBy[]>([]);
  const [restarted, setRestarted] = useState<boolean>(false);
  const [ng, setng] = useState<boolean>(false);
  const [producthold, setproducthold] = useState<boolean>(false);
  const [isModeView, setisModeView] = useState<boolean>(false);
  const [isLead, setisLead] = useState<boolean>(false);
  const [isInReview, setisInReview] = useState<boolean>(false);
  const [showSubmit, setshowSubmit] = useState<boolean>(false);
  const [isReOpen, setisReOpen] = useState<boolean>(false);
  const [approverTaskId, setapproverTaskId] = useState<number>(0);
  const [departmentHeadId, setdepartmentHeadId] = useState<number>(0);
  const [troubleRevisedId, settroubleRevisedId] = useState<number>(0);
  const [seqNumber, setseqNumber] = useState<number>(0);
  const [currentLevel, setcurrentLevel] = useState<number>(0);
  const [status, setStatus] = useState<string>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showOtherTrouble, setshowOtherTrouble] = useState<boolean>(false);
  const [showSave, setshowSave] = useState<boolean>(true);
  const [pcaDate, setpcaDate] = useState<dayjs.Dayjs>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [troubleAttachments, settroubleAttachments] = useState<any[]>([]);
  const [isFormModified, setIsFormModified] = useState(false);

  const [isAdjustmentReportVisible, setIsAdjustmentReportVisible] =
    useState<boolean>(false);
  const [troubles, setTroubles] = useState<
    {
      troubleId: number;
      name: string;
    }[]
  >([]);
  const [employee, setemployees] = useState([]);
  const { mode, id } = useParams();

  const [role, setRole] = useState<ICurrentReviewRole>({
    isRaiser: false,
    isReviewRM: false,
    isRM: false,
    isWorkDoneMember: false,
    isWorkDoneLead: false,
    status: "",
  });

  useEffect(() => {
    if (mode === "view") {
      setisModeView(true);
    }
  }, [mode]);

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const isAdmin = useSelector<IAppState, boolean>(
    (state) => state.Common.userRole.isAdmin
  );

  const handleRestartedChange = (checked: boolean) => {
    setRestarted(checked);
    if (!checked) {
      form.setFieldValue("employeeId", []);
    }
  };

  const handleTroubleTypeChange = (values: any) => {
    if (values.includes(-1)) {
      setshowOtherTrouble(true);
    } else {
      setshowOtherTrouble(false);
    }
  };
  const handleNGChange = (checked: boolean) => {
    setng(checked);
    if (!checked) {
      form.setFieldValue("NGlotAndQuantity", "");
    }
  };
  const handleProductholdChange = (checked: boolean) => {
    setproducthold(checked);
    if (!checked) {
      form.setFieldValue("PHlotAndQuantity", "");
    }
  };

  const handleAdjustmentReportToggle = (checked: boolean) => {
    setIsAdjustmentReportVisible(checked);
    if (!checked) {
      form.setFieldValue("adjustmentReport", "");
    }
  };
  const handlepcaChange = (value: dayjs.Dayjs) => {
    setpcaDate(value);
  };

  const fetchTroubles = async () => {
    try {
      const response = await axios.get(`/GetAllTroubles`);
      console.log("fetchTroubles res", response.data);

      if (response.data.ReturnValue) {
        const trbl = response.data.ReturnValue.map((item: TroubleItem) => {
          if (item.name.toLowerCase() === "other") {
            return {
              label: item.name,
              value: -1,
            };
          }

          return {
            label: item.name,
            value: item.troubleId,
          };
        });

        setTroubles(trbl);
      }
    } catch (error) {
      console.error("Error fetching troubles:", error);
    }
  };

  useEffect(() => {
    //fetch troubles
    fetchTroubles().catch((error) => {
      console.error("Unhandled promise rejection:", error);
    });
  }, []);

  useEffect(() => {
    //fetch employees
    const fetchemployess = async () => {
      try {
        const response = await axios.get(`/GetAllEmployees`);
        console.log("fetchemployess res:", response.data);

        if (response.data && response.data.ReturnValue) {
          setemployees(response.data.ReturnValue);
        }
      } catch (error) {
        console.error("Error fetching employess:", error);
      }
    };

    fetchemployess().catch((error) => {
      console.error("Unhandled promise rejection:", error);
    });
  }, []);

  const getCurrentRole = async (report: ITroubleReportDetails) => {
    try {
      if (id) {
        const payload: ISendToManagerPayload = {
          userId: EMPLOYEE_ID,
          troubleReportId: parseInt(id),
        };

        const response: getCurrentRoleResponse = await getCurrentAprrovalRole(
          payload
        );
        console.log("GetCurrenRoleResponse", response);
        const currentrole: ICurrentReviewRole = { ...role };
        console.log("FORMDATA", form.getFieldsValue());
        if (response) {
          if (response.displayName === RoleNames.ReportingManager) {
            currentrole.isRM = true;
            currentrole.status = response.status;
          } else if (form.getFieldValue("CreatedBy") === EMPLOYEE_ID) {
            currentrole.isRaiser = true;
            currentrole.status = response.status;
          } else if (
            response.displayName === RoleNames.ReviewReportingManager ||
            response.displayName === RoleNames.WorkDoneManager
          ) {
            currentrole.isReviewRM = true;
            currentrole.status = response.status;
          } else if (response.displayName === RoleNames.WorkDoneLead) {
            currentrole.isWorkDoneLead = true;
            currentrole.status = response.status;
          }

          setRole(currentrole);

          console.log("CurrentRole", currentrole);
          if (response.isReviewed) {
            setisInReview(true);
          }
          if (response.isSubmit) {
            setshowSubmit(true);
          }
          if (id) {
            if (isInReview) {
              setDisabled(true);
              setshowSave(false);
            }
          }

          if (currentrole.isRaiser && id && report.status != "Draft") {
            setshowSave(false);
          }
        }
      } else {
        console.log("IN ELSE");
        setDisabled(false);
      }
    } catch (error) {
      console.error(error);
      setShowLoader(false);
    }
  };

  const fetchInitialValues = async (id: string) => {
    if (id) {
      setShowLoader(true);

      const report = await getTroubleReport(Number(id));

      console.log("GetTroubleById res", report);
      if (report) {
        await fetchTroubles();
        form.setFieldsValue({
          when: report?.when ? dayjs(report.when, "DD/MM/YYYY HH:mm:ss") : null,
          breakDownMin: report.breakDownMin,
          reportTitle: report.reportTitle,
          process: report.process,
          processingLot: report.processingLot,
          NG: report.NG,
          NGlotAndQuantity: report.NGlotAndQuantity,
          PHlotAndQuantity: report.PHlotAndQuantity,
          productHold: report.ProductHold,
          troubleType: report.troubleType,
          restarted: report.restarted,
          employeeId: report.employeeId,
          troubleBriefExplanation: report.troubleBriefExplanation,
          immediateCorrectiveAction: report.immediateCorrectiveAction,
          closure: report.closure
            ? dayjs(report.closure, "DD/MM/YYYY HH:mm:ss")
            : null,
          rootCause: report.rootCause,
          isAdjustMentReport: report.isAdjustMentReport,
          adjustmentReport: report.adjustmentReport,
          completionDate: report.completionDate
            ? dayjs(report.completionDate, "DD/MM/YYYY HH:mm:ss")
            : null,
          pca: report.pca ? dayjs(report.pca, "DD/MM/YYYY") : null,
          CreatedBy: report.CreatedBy,
          troubleReportNo: report.troubleReportNo,
          otherTroubleType: report.otherTroubleType,
          remarks: report.remarks,
          permanantCorrectiveAction: report.permanantCorrectiveAction,
        });
        handleProductholdChange(report.ProductHold);
        handleNGChange(report.NG);
        handleTroubleTypeChange(report.troubleType);
        handleRestartedChange(report.restarted);
        handleAdjustmentReportToggle(report.isAdjustMentReport);
        report.WorkDoneData = report.WorkDoneData?.map((obj, index) => {
          return {
            key: index,
            ...obj,
          };
        });
        setWorkDone(report.WorkDoneData);
        if (report.TroubleAttachmentDetails) {
          settroubleAttachments(report.TroubleAttachmentDetails);
        }

        setpcaDate(report.pca ? dayjs(report.pca, "DD/MM/YYYY") : null);

        report.WorkDoneData.map((item) => {
          if (item.employeeId == EMPLOYEE_ID && !item.lead) {
            role.isWorkDoneMember = true;
          }
          if (item.lead == true) {
            setisLead(true);
          }
        });
        if (report.reportLevel) {
          setcurrentLevel(report.reportLevel);
        }
        if (report.status) {
          setStatus(report.status);
        }
        if (report.isReOpen) {
          setisReOpen(true);
        }
        if (report.status == REQUEST_STATUS.UnderReview) {
          setisInReview(true);
        }
        if (report.isSubmit) {
          setSubmitted(true);
        }
        if (report.troubleRevisedId) {
          settroubleRevisedId(report.troubleRevisedId);
        }
        if (report.approverTaskId) {
          setapproverTaskId(report.approverTaskId);
        }
        if (report.sequenceNumber) {
          setseqNumber(report.sequenceNumber);
        }
        if (report.departmentHeadId) {
          setdepartmentHeadId(report.departmentHeadId);
        }
        await getCurrentRole(report);
      }
      setShowLoader(false);
    }
  };

  useEffect(() => {
    //get by id
    if (id) {
      fetchInitialValues(id).catch((error) => {
        console.error("Unhandled promise rejectino:", error);
      });
    } else {
      const currentrole: ICurrentReviewRole = { ...role };
      currentrole.isRaiser = true;
      role.isRaiser = true;
      setRole({ ...role, isRaiser: true });
    }
  }, [form, id, EMPLOYEE_ID]);

  const saveData = async (showMessage: boolean = true): Promise<void> => {
    setShowLoader(true);
    try {
      const values = await form.getFieldsValue();
      console.log("Submitted form values", values);
      values.TroubleReportId = parseInt(id);
      values.when = form.getFieldValue("when")?.toString() ?? "";
      if (role.isWorkDoneLead) {
        values.pca = form.getFieldValue("pca")?.toString() ?? "";
        values.closure = form.getFieldValue("closure")?.toString() ?? "";
        values.completionDate =
          form.getFieldValue("completionDate")?.toString() ?? "";
      }
      if (form.getFieldValue("troubleType") == -1) {
        values.otherTroubleType = form.getFieldValue("otherTroubleType");
      }
      values.breakDownMin =
        form.getFieldValue("breakDownMin")?.toString() ?? "";
      values.WorkDoneData = workDone;
      values.workDone = false;
      values.CreatedBy = EMPLOYEE_ID;
      values.ModifiedBy = EMPLOYEE_ID;
      const foldername = form.getFieldValue("troubleReportNo");
      console.log("workdonedataonSave", values.WorkDoneData);
      console.log("AttachmentDataonSave", troubleAttachments);
      values.TroubleAttachmentDetail = Attachment_toPayload(
        troubleAttachments ?? [],
        foldername,
        "troubleReport"
      );

      values.isSubmit = false;

      const response = await InsertUpdateTroubleReportSection(
        values,
        showMessage
      );

      console.log("ONSAVE RESPONSE", response);
      navigate(`/form/edit/${response.ReturnValue}`);
    } catch (error) {
      console.error("Validation failed or API call failed.", error);
    } finally {
      setShowLoader(false);
    }
  };

  const onSaveFormHandler = async (showPopUp: boolean) => {
    if (role.isRaiser) {
      await form.validateFields(["reportTitle"]);
    }
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
        cancelButtonProps: { className: "btn btn-outline-primary" },
        okButtonProps: { className: "btn btn-primary" },
        onOk: async () => {
          await saveData();
          // setShowLoader(true);
          // try {
          //   const values = await form.getFieldsValue();
          //   console.log("Submitted form values", values);
          //   values.TroubleReportId = parseInt(id);
          //   values.when = form.getFieldValue("when")?.toString() ?? "";
          //   if (role.isWorkDoneLead) {
          //     values.pca = form.getFieldValue("pca")?.toString() ?? "";
          //     values.closure = form.getFieldValue("closure")?.toString() ?? "";
          //     values.completionDate =
          //       form.getFieldValue("completionDate")?.toString() ?? "";
          //   }
          //   if (form.getFieldValue("troubleType") == -1) {
          //     values.otherTroubleType = form.getFieldValue("otherTroubleType");
          //   }
          //   values.breakDownMin =
          //     form.getFieldValue("breakDownMin")?.toString() ?? "";
          //   values.WorkDoneData = workDone;
          //   values.workDone = false;
          //   values.CreatedBy = EMPLOYEE_ID;
          //   values.ModifiedBy = EMPLOYEE_ID;
          //   const foldername = form.getFieldValue("troubleReportNo");
          //   console.log("workdonedataonSave", values.WorkDoneData);
          //   console.log("AttachmentDataonSave", troubleAttachments);
          //   values.TroubleAttachmentDetail = Attachment_toPayload(
          //     troubleAttachments ?? [],
          //     foldername,
          //     "troubleReport"
          //   );
          //   // Example of accessing specific fields
          //   const closureValue = values["closure"];
          //   values.isSubmit = false;
          //   const response = await InsertUpdateTroubleReportSection(values);
          //   console.log("ONSAVE RESPONSE", response);
          //   //   if(response){
          //   //     fetchInitialValues(response.ReturnValue).catch((error) => {
          //   //       console.error("Unhandled promise rejectino:", error);
          //   //   })
          //   // }
          //   navigate(`/form/edit/${response.ReturnValue}`);
          //   //navigate(-1);
          // } catch (error) {
          //   console.error("Validation failed or API call failed.", error);
          // } finally {
          //   setShowLoader(false);
          // }
        },
        onCancel() {
          console.log("Cancel submission");
        },
      });
    } else {
      await saveData();
    }
  };

  const onSubmitHandler = async () => {
    const submitValue: TroubleReportSubmitPayload = {
      troubleReportId: parseInt(id),
      isSubmit: true,
      isAmendReSubmitTask: false,
      modifiedBy: EMPLOYEE_ID,
    };
    console.log("Submitted values payload", submitValue);
    onSaveFormHandler(false).catch((error) => {
      console.error("Unhandled promise rejection:", error);
    });

    if (status != REQUEST_STATUS.Reviewed || isFormModified) {
      info({
        title: MESSAGES.reviewBeforeSubmit,
        icon: (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "10px", marginTop: "7px" }}
          />
        ),
        okText: "OK",
        okButtonProps: { className: "btn btn-primary" },
        okType: "primary",
        onOk() {
          console.log("OK clicked");
        },
      });
    } else {
      confirm({
        title: MESSAGES.onSubmit,
        icon: (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "10px", marginTop: "7px" }}
          />
        ),
        okText: "Yes",
        okType: "primary",
        cancelButtonProps: { className: "btn btn-outline-primary" },
        okButtonProps: { className: "btn btn-primary" },
        cancelText: "No",
        onOk: async () => {
          setShowLoader(true);
          try {
            const submitResponse = await submitTroubleReport(submitValue);

            if (submitResponse) {
              navigate("/", {
                state: {
                  currentTabState: "myreview-tab",
                },
              });
            }
          } catch (error) {
            await message.error(
              "Failed to submit trouble report: " + error.message
            );
          } finally {
            setShowLoader(false);
          }
        },
        onCancel() {
          console.log("Cancel submission");
        },
      });
    }
  };

  const onUploadChange = async (event: any): Promise<boolean> => {
    try {
      setShowLoader(true);
      const folderName = form.getFieldValue("troubleReportNo");
      if (
        (event.file.status !== "uploading" || mode === "edit") &&
        event.file.status !== "removed"
      ) {
        const file = event.file as File;
        console.log("PageContext", context.pageContext);

        const res = await uploadAttachment(
          DocumentLibraries.Trouble_Attachments,
          context.pageContext.web.absoluteUrl,
          context.spHttpClient,
          file,
          file.name,
          folderName
        );

        return res;
      }
    } catch (error) {
      console.error("Error while uploading the file: ", error);
    } finally {
      setShowLoader(false);
    }
  };

  const handleRemove = async (file: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: (
          <p className="text-black-50_e8274897">{MESSAGES.onDeleteFile}</p>
        ),
        icon: (
          <ExclamationCircleOutlined
            style={{ fontSize: "24px", color: "#faad14" }}
          />
        ),
        okText: "Yes",
        cancelText: "No",
        cancelButtonProps: { className: "btn btn-outline-primary" },
        okButtonProps: { className: "btn btn-primary" },
        onOk: async () => {
          try {
            setLoading(true);
            setShowLoader(true);

            const fileName = file.name;
            const folderName =
              form.getFieldValue("troubleReportNo") ?? "troubleReport";

            await deleteFolderFile(
              DocumentLibraries.Trouble_Attachments,
              context.pageContext.web.absoluteUrl,
              context.spHttpClient,
              folderName,
              fileName
            );

            resolve(true); // Proceed with removal
          } catch (error) {
            console.error(error);
            resolve(false); // Prevent removal
          } finally {
            setLoading(false);
            setShowLoader(false);
          }
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  const onAllowbyManager = async (comment: string) => {
    try {
      setShowLoader(true);
      const payload: IReviewManagerPayload = {
        userId: EMPLOYEE_ID,
        troubleReportId: parseInt(id),
        status: "Allow",
        comment: comment,
      };

      const response = await onReview(payload);
      navigate(`/`, {
        state: { currentTabState: "myreview-tab" },
      });
      console.log(response);
    } catch (error) {
      console.error("Validation failed or API call failed.", error);
    } finally {
      setShowLoader(false);
    }
  };

  const onDisAllowbyManager = async (comment: string) => {
    try {
      setShowLoader(true);
      const payload: IReviewManagerPayload = {
        userId: EMPLOYEE_ID,
        troubleReportId: parseInt(id),
        status: "ReviewDeclined",
        comment: comment,
      };

      const response = await onReview(payload);
      navigate(`/`, {
        state: { currentTabState: "myreview-tab" },
      });
      console.log("Declined res", response);
    } catch (error) {
      console.error("Validation failed or API call failed.", error);
    } finally {
      setShowLoader(false);
    }
  };

  const onSendToManagerHandler = async () => {
    if (showOtherTrouble) {
      await form.validateFields(["otherTroubleType"]);
    }
    await form.validateFields([
      "reportTitle",
      "when",
      "breakDownMin",
      "process",
      "processingLot",
      "troubleType",
    ]);

    confirm({
      title: MESSAGES.notifyManager,
      icon: (
        <i
          className="fa-solid fa-circle-exclamation"
          style={{ marginRight: "10px", marginTop: "7px" }}
        />
      ),
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      onOk: async () => {
        try {
          await saveData(false);

          setShowLoader(true);
          const payload: ISendToManagerPayload = {
            userId: EMPLOYEE_ID,
            troubleReportId: parseInt(id),
          };

          const response = await sendToManager(payload);

          console.log("onSendToManagerHandler res", response);
          navigate(`/`, {
            state: { currentTabState: "myrequest-tab" },
          });
        } catch (error) {
          console.error("Validation failed or API call failed.", error);
        } finally {
          setShowLoader(false);
        }
      },
      onCancel() {
        console.log("Cancel submission");
      },
    });
  };

  const onNotifyMembers = async () => {
    if (form.getFieldValue("NG")) {
      await form.validateFields(["NGlotAndQuantity"]);
    }
    if (form.getFieldValue("productHold")) {
      await form.validateFields(["PHlotAndQuantity"]);
    }
    if (form.getFieldValue("restarted")) {
      await form.validateFields(["employeeId"]);
    }
    await form.validateFields(["reportTitle", "troubleBriefExplanation"]);

    if (isLead) {
      confirm({
        title: MESSAGES.notifyMembers,
        icon: (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "10px", marginTop: "7px" }}
          />
        ),
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        cancelButtonProps: { className: "btn btn-outline-primary" },
        okButtonProps: { className: "btn btn-primary" },
        onOk: async () => {
          try {
            await saveData(false);

            setShowLoader(true);
            const payload: ISendToManagerPayload = {
              userId: EMPLOYEE_ID,
              troubleReportId: parseInt(id),
            };

            const response = await NotifytoMembers(payload);

            console.log("onNotifyMembers res", response);
            navigate(`/`, {
              state: { currentTabState: "myreview-tab" },
            });
          } catch (error) {
            console.error("Validation failed or API call failed.", error);
          } finally {
            setShowLoader(false);
          }
        },
        onCancel() {
          console.log("Cancel submission");
        },
      });
    } else {
      info({
        title: "Please select a Lead",
        icon: (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ marginRight: "10px", marginTop: "7px" }}
          />
        ),
        okText: "OK",
        okType: "primary",
        okButtonProps: { className: "btn btn-primary" },
        onOk() {
          console.log("OK clicked");
        },
      });
    }
  };
  const isRemarksVisible = () => {
    const date = form.getFieldValue("pca") || pcaDate;
    if (date) {
      const currentDate = dayjs();
      if (currentDate.isAfter(dayjs(date))) {
        return true;
      }
    }
    return false;
  };

  const onReviewByManagers = async () => {
    if (currentLevel === Levels.Level1) {
      await form.validateFields(["immediateCorrectiveAction"]);
    } else if (currentLevel === 2) {
      await form.validateFields(["pca", "rootCause"]);
    } else if (currentLevel === Levels.Level3) {
      if (form.getFieldValue("isAdjustMentReport")) {
        await form.validateFields(["adjustmentReport"]);
      } else if (isRemarksVisible()) {
        await form.validateFields(["remarks"]);
      }
      await form.validateFields(["permanantCorrectiveAction", "closure"]);
    }
    confirm({
      title: MESSAGES.onReviewByManager,
      icon: (
        <i
          className="fa-solid fa-circle-exclamation"
          style={{ marginRight: "10px", marginTop: "7px" }}
        />
      ),
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      cancelButtonProps: { className: "btn btn-outline-primary" },
      okButtonProps: { className: "btn btn-primary" },
      onOk: async () => {
        try {
          setShowLoader(true);

          await saveData(false);

          const payload: ISendToManagerPayload = {
            userId: EMPLOYEE_ID,
            troubleReportId: parseInt(id),
          };

          const response = await ReviewbyManagers(payload);

          console.log("onReviewByManagers res", response);
          navigate(`/`, {
            state: { currentTabState: "myreview-tab" },
          });
        } catch (error) {
          console.error("Validation failed or API call failed.", error);
        } finally {
          setShowLoader(false);
        }
      },
      onCancel() {
        console.log("Cancel submission");
      },
    });
  };

  const validationRules = {
    when: [
      { required: true, message: "Please enter When" },
      {
        validator: (_: any, value: dayjs.Dayjs) => {
          if (!value || value.isBefore(dayjs().endOf("day"))) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error("The selected date cannot be in the future.")
          );
        },
      },
    ],
    breakDownMin: [
      { required: true, message: "Please enter Breakdown Minutes" },
    ],
    reportTitle: [{ required: true, message: "Please enter Report Title" }],
    process: [{ required: true, message: "Please enter Process" }],
    processingLot: [{ required: true, message: "Please enter Processing Lot" }],
    ng: [{ required: true, message: "Please select NG" }],
    NGlotAndQuantity: [
      { required: ng, message: "Please enter Lot and Quantity" },
    ],
    PHlotAndQuantity: [
      { required: producthold, message: "Please enter Lot and Quantity" },
    ],
    productHold: [{ required: true, message: "Please select Product Hold" }],
    troubleType: [{ required: true, message: "Please enter Trouble Type" }],
    otherTroubleType: [
      { required: true, message: "Please enter Other Trouble Type" },
    ],
    restarted: [{ required: true, message: "Please select Restarted" }],
    employeeName: [{ required: true, message: "Please Select Employee Name" }],
    troubleBriefExplanation: [
      { required: true, message: "Please enter Trouble Brief Explanation" },
    ],
    immediateCorrectiveAction: [
      { required: true, message: "Please enter Immediate Corrective Action" },
    ],
    closure: [{ required: true, message: "Please enter Closure Date" }],
    rootCause: [{ required: true, message: "Please enter Root Cause" }],
    adjustmentReport: [
      {
        required: isAdjustmentReportVisible,
        message: "Please enter Adjustment Report",
      },
    ],
    completionDate: [
      { required: true, message: "Please select Completion Date" },
    ],
    pca: [
      {
        required: true,
        message: "Please Select date for Permanent corrective action Date",
      },
    ],
    permanentcorrectiveaction: [
      {
        required: true,
        message: "Please Select date for Permanent corrective action",
      },
    ],
    attachment: [{ required: true, message: "Please upload Attachment" }],
    workDoneBy: [
      {
        employeeWorkName: [
          { required: true, message: "Please select Employee Name" },
        ],
        comment: [{ required: true, message: "Please enter Comment" }],
      },
    ],
    remarks: [{ required: true, message: "Please add Remarks" }],
  };

  const DraggerProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    maxCount: 10, // Maximum number of files allowed
    onChange: async (info: any) => {
      const { status, fileList } = info;
      if (status !== "uploading") {
        console.log(info.file, fileList);
      }
      if (status === "done") {
        await message.success(
          `${info.file.name} fsrc/webparts/cellFormatForms/components/TroubleReport/Form.tsxile uploaded successfully.`
        );
      } else if (status === "error") {
        await message.error(`${info.file.name} file upload failed.`);
      }

      if (fileList.length > 10) {
        await message.warning("You can only upload up to 10 files.");
      }
    },
    onDrop: async (e: any) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const deleteHandler = (key: React.Key): void => {
    const lead = workDone.find((item) => item.key === key && item.lead);
    if (lead) {
      setisLead(false);
    }
    const newData = workDone
      .filter((item) => item.key !== key)
      .map((item, index) => {
        return {
          ...item,
          key: index,
        };
      });
    console.log("newWorkDoneData", workDone, newData);
    setWorkDone(newData);
    form.setFieldsValue({
      ["WorkDoneData"]: newData,
    });
  };

  const handleAdd = (): void => {
    const newData: IWorkDoneBy[] = [
      ...workDone,
      {
        key: workDone?.length,
        employeeId: null,
        comment: null,
        lead: false,
      },
    ];
    setWorkDone(newData);
    console.log("NEWWorkDoneDATA", newData);
  };

  const saveTableInputHandler = (
    key: number,
    updateField: string,
    value: string | number | string[] | boolean
  ): void => {
    const newData = workDone.map((item: IWorkDoneBy) => {
      if (item.key == key) {
        item[updateField] = value;
      }

      return item;
    });
    setWorkDone(newData);
    console.log("UppdatedWorkDoneData", newData);
  };

  const handleLeadChange = (key: number, checked: boolean) => {
    const updatedData = workDone.map((item) => {
      if (item.key === key) {
        item.lead = checked;
      }
      return item;
    });

    setWorkDone(updatedData);
    setisLead(checked); // Set isLead if checked, otherwise false
  };

  const columns: ColumnsType<IWorkDoneBy> = [
    {
      title: "Employee Name",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["WorkDoneData", record.key, "employeeId"]}
            initialValue={
              form.getFieldValue(["WorkDoneData", record.key, "employeeId"]) ??
              record.employeeId
            }
            rules={validationRules["employeeName"]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: "100%" }}
              placeholder="Select Employee Name"
              onChange={(value) => {
                saveTableInputHandler(record.key, "employeeId", value);
              }}
              filterOption={(input, option) =>
                option?.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              className="custom-disabled-select"
              disabled={
                isModeView ||
                (isAdmin
                  ? status == REQUEST_STATUS.Completed
                  : !role.isRM || submitted)
              }
            >
              {employee?.map((employee) => (
                <Select.Option
                  key={employee.employeeId}
                  value={employee.employeeId}
                >
                  {employee.employeeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      },
      width: "30%",
      sorter: false,
    },
    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
      render: (_, record) => {
        return (
          <Form.Item
            name={["WorkDoneData", record.key, "comment"]}
            initialValue={
              form.getFieldValue(["WorkDoneData", record.key, "comment"]) ??
              record.comment
            }
            style={{ margin: 0 }}
          >
            <TextArea
              maxLength={500}
              placeholder="Add Comments"
              rows={2}
              // disabled={isViewMode || !isFormEditable}
              onChange={(e) => {
                saveTableInputHandler(record.key, "comment", e.target.value);
              }}
              disabled={
                isModeView ||
                (isAdmin
                  ? status == REQUEST_STATUS.Completed
                  : (role.isRM ? false : !role.isWorkDoneLead) ||
                    isInReview ||
                    submitted)
              }
            />
          </Form.Item>
        );
      },
      width: "40%",
      sorter: false,
    },
    {
      title: "Lead",
      dataIndex: "lead",
      key: "lead",
      render: (_, record) => {
        return (
          <Form.Item
            name={["WorkDoneData", record.key, "lead"]}
            initialValue={
              form.getFieldValue(["WorkDoneData", record.key, "lead"]) ??
              record.lead
            }
            valuePropName="checked"
            style={{ margin: 0 }}
          >
            <Checkbox
              onChange={(e) => {
                handleLeadChange(record.key, e.target.checked);
              }}
              disabled={
                isModeView ||
                (isAdmin
                  ? status == REQUEST_STATUS.Completed
                  : (isLead && !record.lead) || !role.isRM)
              }
            />
          </Form.Item>
        );
      },
      width: "15%",
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
              onClick={() => deleteHandler(record.key)}
              disabled={
                isModeView ||
                (isAdmin ? status == REQUEST_STATUS.Completed : !role.isRM)
              }
            >
              <span>
                <i title="Delete" className="fas fa-trash text-danger" />
              </span>
            </button>
          </div>
        );
      },

      sorter: false,
    },
  ];

  const onValuesChange = (_: any, allValues: any) => {
    setIsFormModified(true); // To track when the form is modified
  };

  return (
    <>
      <div className="d-flex flex-column gap-3 w-100 h-100">
        <div
          className="position-absolute"
          style={{ right: "40px", top: "105px" }}
        >
          <div className="d-flex gap-3">
            <FormButtons
              departmentHeadId={departmentHeadId}
              currentlevel={currentLevel}
              isReOpen={isReOpen}
              isModeView={isModeView}
              seqNumber={seqNumber}
              submitted={submitted}
              approverTaskId={approverTaskId}
              isInReview={isInReview}
              status={status}
              isLead={isLead}
              showSubmit={showSubmit}
              onSubmit={onSubmitHandler}
              showSave={showSave}
              onAllow={onAllowbyManager}
              onDecline={onDisAllowbyManager}
              onReviewbyRM={onReviewByManagers}
              onsendtoManager={onSendToManagerHandler}
              onSaveFormHandler={onSaveFormHandler}
              onNotify={onNotifyMembers}
              roles={role}
              shownotify={isLead}
              activeSection={1}
              isAdmin={true}
              requestType={1}
              userId={1}
              currentApproverTaskId={1}
              employeeOptions={employee}
            />
          </div>
        </div>

        <div className="bg-white p-4">
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 4,
                fontFamily: "Segoe UI",
                // colorPrimary: "#c50017",
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
            <Form
              layout="vertical"
              className="fw-semibold fs-16px"
              onFinish={onSaveFormHandler}
              onValuesChange={onValuesChange}
              initialValues={{}}
              form={form}
            >
              <div>
                <div className="row mb-3">
                  <div className="col-8">
                    <Form.Item
                      label={
                        <span className="text-muted mb-0">Report Title</span>
                      }
                      name="reportTitle"
                      rules={validationRules["reportTitle"]}
                    >
                      <Input
                        maxLength={100}
                        disabled={
                          isModeView ||
                          (isAdmin
                            ? false
                            : !(
                                (role.isRaiser || role.isRM) &&
                                currentLevel < Levels.Level1
                              ) ||
                              isInReview ||
                              troubleRevisedId != 0 ||
                              submitted)
                        }
                      />
                    </Form.Item>

                    <div className="row">
                      <div className="col-sm">
                        <Form.Item
                          name="when"
                          label="When:"
                          rules={validationRules.when}
                        >
                          <DatePicker
                            disabledDate={(current) => {
                              return (
                                current && current.isAfter(dayjs().endOf("day"))
                              );
                            }}
                            format={DATE_TIME_FORMAT}
                            showTime
                            placeholder="Select Date time"
                            className="text-muted w-100"
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : submitted ||
                                  isInReview ||
                                  !(
                                    role.isRaiser &&
                                    (!status || status == REQUEST_STATUS.Draft)
                                  ) ||
                                  currentLevel >= Levels.Level1)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          name="breakDownMin"
                          rules={[
                            ...validationRules.breakDownMin,
                            {
                              pattern: /^[0-9]*$/,
                              message: "Please enter a valid positive number",
                            },
                          ]}
                          label="Breakdown Minutes:"
                          className="custom-disabled-input"
                        >
                          <InputNumber
                            changeOnWheel={false}
                            controls={false}
                            min={0}
                            maxLength={100}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : submitted ||
                                  isInReview ||
                                  !(
                                    role.isRaiser &&
                                    (!status || status == REQUEST_STATUS.Draft)
                                  ) ||
                                  currentLevel >= Levels.Level1)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          rules={validationRules.process}
                          label={<span className="text-muted">Process</span>}
                          name="process"
                        >
                          <Input
                            maxLength={50}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : submitted ||
                                  isInReview ||
                                  !(
                                    role.isRaiser &&
                                    (!status || status == REQUEST_STATUS.Draft)
                                  ) ||
                                  currentLevel >= Levels.Level1)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          rules={validationRules.processingLot}
                          label={
                            <span className="text-muted">Processing Lot</span>
                          }
                          name="processingLot"
                        >
                          <Input
                            maxLength={50}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : submitted ||
                                  isInReview ||
                                  !(
                                    role.isRaiser &&
                                    (!status || status == REQUEST_STATUS.Draft)
                                  ) ||
                                  currentLevel >= Levels.Level1)
                            }
                          />
                        </Form.Item>

                        <div className="row mb-4">
                          <Form.Item
                            label={<span className="text-muted">NG</span>}
                            name="NG"
                            valuePropName="checked"
                            className="col-5"
                            initialValue={ng}
                          >
                            <Switch
                              onChange={handleNGChange}
                              disabled={
                                isModeView ||
                                (isAdmin
                                  ? false
                                  : !(
                                      (role.isRaiser || role.isRM) &&
                                      currentLevel < Levels.Level1
                                    ) ||
                                    isInReview ||
                                    submitted)
                              }
                            />
                          </Form.Item>

                          <Form.Item
                            label={
                              <span className="text-muted">
                                Lot and Quantity
                              </span>
                            }
                            rules={ng ? validationRules.NGlotAndQuantity : null}
                            name="NGlotAndQuantity"
                            className="col-7"
                          >
                            <Input
                              disabled={
                                isModeView ||
                                (isAdmin
                                  ? false
                                  : !ng ||
                                    !(
                                      (role.isRaiser || role.isRM) &&
                                      currentLevel < Levels.Level1
                                    ) ||
                                    isInReview ||
                                    submitted)
                              }
                              maxLength={50}
                            />
                          </Form.Item>
                        </div>

                        <div className="row mb-4">
                          <Form.Item
                            label={
                              <span className="text-muted">Product Hold</span>
                            }
                            name="productHold"
                            valuePropName="checked"
                            className="col-5"
                            initialValue={producthold}
                          >
                            <Switch
                              onChange={handleProductholdChange}
                              disabled={
                                isModeView ||
                                (isAdmin
                                  ? false
                                  : !(
                                      (role.isRaiser || role.isRM) &&
                                      currentLevel < Levels.Level1
                                    ) ||
                                    isInReview ||
                                    submitted)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            label={
                              <span className="text-muted">
                                Lot and Quantity
                              </span>
                            }
                            rules={
                              producthold
                                ? validationRules.PHlotAndQuantity
                                : null
                            }
                            name="PHlotAndQuantity"
                            className="col-7"
                          >
                            <Input
                              disabled={
                                isModeView ||
                                (isAdmin
                                  ? false
                                  : !producthold ||
                                    !(
                                      (role.isRaiser || role.isRM) &&
                                      currentLevel < Levels.Level1
                                    ) ||
                                    isInReview ||
                                    submitted)
                              }
                              maxLength={50}
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          label={
                            <span className="text-muted">Trouble Type</span>
                          }
                          name="troubleType"
                          rules={validationRules["troubleType"]}
                        >
                          <Select
                            showSearch
                            onChange={handleTroubleTypeChange}
                            optionFilterProp="label"
                            mode="multiple"
                            className="w-100 custom-disabled-select"
                            options={troubles}
                            placeholder="Select trouble types"
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : submitted ||
                                  isInReview ||
                                  !(
                                    role.isRaiser &&
                                    (!status || status == REQUEST_STATUS.Draft)
                                  ) ||
                                  currentLevel >= Levels.Level1)
                            }
                          >
                            {troubles?.map((trouble) => (
                              <Select.Option
                                key={trouble.troubleId}
                                value={trouble.troubleId}
                              >
                                {trouble.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {showOtherTrouble && (
                          <div>
                            <Form.Item
                              label="Other Trouble Type"
                              name="otherTroubleType"
                              initialValue={""}
                              rules={
                                showOtherTrouble
                                  ? validationRules.otherTroubleType
                                  : null
                              }
                            >
                              <Input
                                className="w-100"
                                disabled={
                                  isModeView ||
                                  (isAdmin
                                    ? false
                                    : submitted ||
                                      !(
                                        role.isRaiser &&
                                        (status
                                          ? status === REQUEST_STATUS.Draft
                                          : true)
                                      ))
                                }
                                allowClear
                              />
                            </Form.Item>
                          </div>
                        )}
                        <div className="d-flex gap-3 w-100 mt-3">
                          <div className="flex-grow-0 flex-shrink-0 w-20 mt-30">
                            <Form.Item
                              rules={validationRules.restarted}
                              label={
                                <span className="text-muted">Restarted</span>
                              }
                              name="restarted"
                              valuePropName="checked"
                              initialValue={restarted}
                            >
                              <Switch
                                onChange={handleRestartedChange}
                                disabled={
                                  isModeView ||
                                  (isAdmin
                                    ? false
                                    : !(
                                        (role.isRaiser || role.isRM) &&
                                        currentLevel < Levels.Level2
                                      ) ||
                                      isInReview ||
                                      submitted)
                                }
                              />
                            </Form.Item>
                          </div>

                          <div className="flex-grow-1 w-80">
                            <Form.Item
                              label={
                                <span className="text-muted">
                                  Employee Name
                                </span>
                              }
                              name="employeeId"
                              className=" w-80"
                              rules={
                                restarted ? validationRules.employeeName : null
                              }
                            >
                              <Select
                                mode="multiple"
                                placeholder="Select Employee Name"
                                showSearch
                                optionFilterProp="children"
                                disabled={
                                  isModeView ||
                                  !restarted ||
                                  (isAdmin
                                    ? false
                                    : !(
                                        (role.isRaiser || role.isRM) &&
                                        currentLevel < Levels.Level2
                                      ) ||
                                      isInReview ||
                                      submitted)
                                }
                              >
                                {employee?.map((employee) => (
                                  <Select.Option
                                    key={employee.employeeId}
                                    value={employee.employeeId}
                                  >
                                    {employee.employeeName}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm">
                        <Form.Item
                          label={
                            <span className="text-muted">
                              Trouble Brief Explanation
                            </span>
                          }
                          name="troubleBriefExplanation"
                          rules={validationRules.troubleBriefExplanation}
                        >
                          <TextArea
                            maxLength={500}
                            rows={3}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : !(
                                    (role.isRaiser || role.isRM) &&
                                    currentLevel < Levels.Level1
                                  ) ||
                                  isInReview ||
                                  submitted)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <span className="text-muted">
                              Immediate Corrective Action
                            </span>
                          }
                          name="immediateCorrectiveAction"
                          rules={validationRules.immediateCorrectiveAction}
                        >
                          <TextArea
                            maxLength={500}
                            rows={5}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : !(
                                    role.isWorkDoneLead &&
                                    currentLevel < Levels.Level2
                                  ) ||
                                  isInReview ||
                                  submitted)
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-muted">
                              Root Cause Analysis
                            </span>
                          }
                          name="rootCause"
                          rules={validationRules.rootCause}
                        >
                          <TextArea
                            maxLength={500}
                            rows={5}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : !(
                                    role.isWorkDoneLead &&
                                    (currentLevel == Levels.Level2 ||
                                      approverTaskId)
                                  ) ||
                                  isInReview ||
                                  (submitted && !approverTaskId))
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-muted">
                              Permanent Corrective Action Date
                            </span>
                          }
                          name="pca"
                          rules={validationRules.pca}
                        >
                          <DatePicker
                            placeholder={!isModeView ? "Select Date" : ""}
                            onChange={handlepcaChange}
                            format={DATE_FORMAT}
                            className="w-100"
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : !(
                                    role.isWorkDoneLead &&
                                    (currentLevel === Levels.Level2 ||
                                      approverTaskId)
                                  ) ||
                                  isInReview ||
                                  (submitted && !approverTaskId))
                            }
                            disabledDate={(currentDate) => {
                              const whenDate = form.getFieldValue("when");
                              return whenDate
                                ? currentDate && currentDate.isBefore(whenDate)
                                : false;
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <span className="text-muted">
                              Permanent Corrective Action
                            </span>
                          }
                          name="permanantCorrectiveAction"
                          rules={validationRules.permanentcorrectiveaction}
                        >
                          <TextArea
                            maxLength={500}
                            rows={5}
                            disabled={
                              isModeView ||
                              (isAdmin
                                ? false
                                : !(
                                    role.isWorkDoneLead &&
                                    currentLevel >= Levels.Level3
                                  ) ||
                                  isInReview ||
                                  (submitted && !approverTaskId))
                            }
                          />
                        </Form.Item>
                        <div className="d-flex align-items-center mb-4">
                          <Form.Item
                            label={
                              <span className="text-muted">
                                Adjustment Report
                              </span>
                            }
                            name="isAdjustMentReport"
                            valuePropName="checked"
                            initialValue={false}
                            className="mb-0 flex-shrink-0"
                          >
                            <Switch
                              onChange={handleAdjustmentReportToggle}
                              disabled={
                                isModeView ||
                                (isAdmin
                                  ? false
                                  : !(
                                      role.isWorkDoneLead &&
                                      currentLevel >= Levels.Level2
                                    ) ||
                                    isInReview ||
                                    (submitted && !approverTaskId))
                              }
                            />
                          </Form.Item>

                          {isAdjustmentReportVisible && (
                            <Form.Item
                              name="adjustmentReport"
                              className="flex-grow-1 ms-3"
                            >
                              <TextArea
                                disabled={
                                  isModeView ||
                                  (isAdmin
                                    ? false
                                    : !(
                                        role.isWorkDoneLead &&
                                        currentLevel >= Levels.Level2
                                      ) ||
                                      isInReview ||
                                      (submitted && !approverTaskId))
                                }
                                maxLength={500}
                                rows={3}
                                placeholder="Enter Adjustment Report Number"
                              />
                            </Form.Item>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <Form.Item
                      label={<span className="text-muted">Attachment</span>}
                      rules={validationRules["attachment"]}
                      className="w-40"
                    >
                      <Upload.Dragger
                        {...DraggerProps}
                        disabled={
                          isModeView ||
                          (isAdmin
                            ? false
                            : !(
                                role.isWorkDoneLead &&
                                currentLevel >= Levels.Level1
                              ) ||
                              isInReview ||
                              (submitted && !approverTaskId))
                        }
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        multiple={true}
                        fileList={troubleAttachments ?? []}
                        onPreview={async (file) => {
                          const folderName = file.originFileObj
                            ? form.getFieldValue("troubleReportNo")
                            : "TroubleReports";
                          await handlePreviewFile(file, "trouble", folderName);
                        }}
                        onDownload={attachment.handleDownloadFile}
                        showUploadList={{
                          showRemoveIcon: true,
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          downloadIcon: (
                            <DownloadOutlined
                              onClick={(e) => e.stopPropagation()}
                            />
                          ),
                        }}
                        onChange={async (event) => {
                          if (event.fileList.length > 0)
                            await onUploadChange(event);
                          settroubleAttachments(event.fileList);
                        }}
                        beforeUpload={attachment.handleBeforeUpload}
                        onRemove={handleRemove}
                      >
                        <p className="display-4">
                          <CloudUploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Drag & Drop your Files here
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                    <Form.Item
                      label={<span className="text-muted">Closure Date</span>}
                      name="closure"
                      rules={validationRules.closure}
                    >
                      <DatePicker
                        placeholder={!isModeView ? "Select Date" : ""}
                        format={DATE_FORMAT}
                        className="w-100"
                        disabled={
                          isModeView ||
                          (isAdmin
                            ? false
                            : !(
                                role.isWorkDoneLead &&
                                currentLevel >= Levels.Level3
                              ) ||
                              isInReview ||
                              (submitted && !approverTaskId))
                        }
                        disabledDate={(currentDate) => {
                          const whenDate = form.getFieldValue("when");
                          return whenDate
                            ? currentDate && currentDate.isBefore(whenDate)
                            : false;
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="text-muted">Completion Date</span>
                      }
                      name="completionDate"
                    >
                      <DatePicker
                        placeholder={"--/--/----"}
                        format={DATE_FORMAT}
                        className="w-100"
                        disabled={isModeView || (isAdmin ? false : true)}
                        disabledDate={(currentDate) => {
                          const whenDate = form.getFieldValue("when");
                          return whenDate
                            ? currentDate && currentDate <= whenDate
                            : false;
                        }}
                      />
                    </Form.Item>
                    {isRemarksVisible() && (
                      <Form.Item
                        label={<span className="text-muted">Remarks</span>}
                        name="remarks"
                        rules={validationRules.remarks}
                      >
                        <TextArea
                          maxLength={500}
                          rows={5}
                          disabled={
                            isModeView ||
                            (isAdmin
                              ? false
                              : !(
                                  role.isWorkDoneLead &&
                                  (currentLevel >= Levels.Level2 ||
                                    approverTaskId)
                                ) ||
                                isInReview ||
                                (submitted && !approverTaskId))
                          }
                        />
                      </Form.Item>
                    )}
                  </div>
                </div>
              </div>

              {(form.getFieldValue("CreatedBy") !== EMPLOYEE_ID ||
                isAdmin ||
                workDone.length !== 0) &&
                id && (
                  <div>
                    <div className="d-flex justify-content-between my-3">
                      <p className="text-muted mb-0">Work Done By</p>
                      {role.isRM &&
                        // role.status == REQUEST_STATUS.InProcess &&
                        !isModeView && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleAdd}
                          >
                            <i className="fa-solid fa-circle-plus" /> Add
                          </button>
                        )}
                    </div>
                    <Table
                      className="hotel-details-table"
                      dataSource={workDone}
                      columns={columns}
                      scroll={{ x: "max-content" }}
                    />
                  </div>
                )}
            </Form>
          </ConfigProvider>
        </div>
      </div>
      <Spin spinning={showLoader || loading} fullscreen />
    </>
  );
};
export default ReportForm;
