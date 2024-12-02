import { Button, Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
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
} from "../../../api/AddUpdateReport.api";
import { useUserContext } from "../../../context/UserContext";
import { useGetAdjustmentReportById } from "../../../hooks/useGetAdjustmentReportById";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FileUpload from "../fileUpload/FileUpload";
import { DocumentLibraries, OPERATION } from "../../../GLOBAL_CONSTANT";
import { useAddUpdateReport } from "../../../hooks/useAddUpdateReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IAdjustmentReportPhoto } from "../../../interface";
import { useGetAllSections } from "../../../hooks/useGetAllSections";

const { Option } = Select;
const { TextArea } = Input;

interface RequestFormProps {
  onFormSubmit: (values: any) => void;
}

const RequestForm = React.forwardRef((props: RequestFormProps, ref) => {
  const [form] = Form.useForm();
  const currentDateTime = dayjs();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  console.log({ isApproverRequest });

  const [beforeAdjustmentReportPhotos, setbeforeAdjustmentReportPhotos] =
    useState<IAdjustmentReportPhoto[]>([]);
  const [afterAdjustmentReportPhotos, setafterAdjustmentReportPhotos] =
    useState<IAdjustmentReportPhoto[]>([]);
  const [showOtherSubMachine, setShowOtherSubMachine] = useState(false);
  const [hideOptionsforSubMachine, setHideOptionsforSubMachine] =
    useState(false);
  const [showOtherMachine, setshowOtherMachine] = useState(false);
  const [hideOptions, setHideOptions] = useState(false);
  const [cRMRequired, setCRMRequired] = React.useState<boolean>(false);
  const [formSections, setFormSections] = React.useState<number[]>([0]); // Initially, one form section
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(
    null
  );
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
    id ? parseInt(id, 10) : 0
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

  const handleSubMachineChange = (selected: string[]) => {
    // Check if "Other" is selected
    if (selected.includes("other")) {
      setShowOtherSubMachine(true);
      setHideOptionsforSubMachine(true); // Hide all other options
      form.setFieldValue("subMachineName", ["other"]); // Keep only "Other" selected
    } else {
      setShowOtherSubMachine(false);
      setHideOptionsforSubMachine(false); // Show all options
    }

    // Handle "Select All" if "Other" is not selected
    const allSubMachineIds =
      filteredSubMachines?.map((subMachine) => subMachine.SubMachineId) || [];
    if (!selected.includes("other") && selected.includes("all")) {
      const newSelected =
        selected.length === allSubMachineIds.length + 2
          ? []
          : allSubMachineIds.concat("other");
      form.setFieldValue("subMachineName", newSelected);
    }
  };

  // Use effect to set report data when it becomes available
  const loadData = async () => {
    if (isEditMode || isViewMode) {
      // Populate initial form values
      setreportNo(reportData?.ReturnValue.ReportNo);
      setCRMRequired(reportData?.ReturnValue.ChangeRiskManagementRequired);
      setCRM(reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport);

      // if (reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport) {
      //   setFormSections(
      //     Array.from({ length: reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport.length }, (_: any, i: any) => i)
      //   );
      // }
      const crmSectionCount =
        reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport.length;
      const sections = [];
      for (let i = 0; i < crmSectionCount; i++) {
        sections.push(i);
      }
      setFormSections(sections);

      console.log({ cRM });
      console.log({ formSections });
      console.log(
        reportData?.ReturnValue.ChangeRiskManagement_AdjustmentReport
      );
      setSelectedMachineId(reportData?.ReturnValue.MachineName); // Set machine initially
      setbeforeAdjustmentReportPhotos(
        reportData?.ReturnValue?.Photos.BeforeImages
      );
      form.setFieldsValue({ beforeImages: beforeAdjustmentReportPhotos });
      setafterAdjustmentReportPhotos(
        reportData?.ReturnValue?.Photos.AfterImages
      );
      form.setFieldsValue({ afterImages: beforeAdjustmentReportPhotos });
      form.setFieldsValue({
        reportNo: reportData?.ReturnValue.ReportNo,
        area: reportData?.ReturnValue.Area,
        machineName: reportData?.ReturnValue.MachineName,
        subMachineName: reportData?.ReturnValue.SubMachineName,
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
  const handleMachineChange = (value: any) => {
    if (value === "other") {
      setshowOtherMachine(true);
      setHideOptions(true);
      form.setFieldValue("machineName", "other"); // Keep only "Other" selected
    } else {
      setshowOtherMachine(false);
      setHideOptions(false); // Show all options
      setSelectedMachineId(value); // Update selected machine ID
      setFilteredSubMachines([]); // Clear filtered options temporarily
      form.setFieldsValue({ subMachineName: [] }); // Reset sub-machine selection
    }
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

  const addFormSection = () => {
    setFormSections((prevSections) => [...prevSections, prevSections.length]);
    console.log({ formSections });
  };

  const deleteFormSection = (sectionIndex: number) => {
    debugger;
    setFormSections((prevSections) =>
      prevSections.filter((_, index) => index !== sectionIndex)
    );
    debugger;
    form.setFieldsValue({
      [`changes-${sectionIndex}`]: "",
      [`riskWithChanges-${sectionIndex}`]: "",
      [`factor-${sectionIndex}`]: "",
      [`counterMeasures-${sectionIndex}`]: "",
      [`function-${sectionIndex}`]: "",
      [`date-${sectionIndex}`]: "",
      [`personInCharge-${sectionIndex}`]: "",
      [`results-${sectionIndex}`]: "",
    });
    const values = form.getFieldsValue();
    debugger;
    console.log("CR after deleting ", formSections);
    console.log(`Deleted section at index: ${sectionIndex}`);
  };

  const CreatePayload = (values: any, operation?: any) => {
    console.log( "FormData",values );
    const beforeImages: IAdjustmentReportPhoto[] = values.beforeImages;
    const afterImages: IAdjustmentReportPhoto[] = values.afterImages;

    const payload: IAddUpdateReportPayload = {
      AdjustmentReportId: id ? parseInt(id, 10) : 0,
      EmployeeId: user?.EmployeeId,
      SectiionId:values.SectionId,
      ReportNo: values.reportNo, //done
      RequestBy: values.requestedBy, //done
      CheckedBy: values.checkedBy, //done
      When: values.dateTime, // need to confirm
      Area: values.area, //done
      MachineName: values.machineName,
      OtherMachineName:values.OtherMachineName,
      OtherSubMachineName:values.OtherSubMachineName, //done
      SubMachineName: values.subMachineName, //done
      DescribeProblem: values.describeProblem, //done
      Observation: values.observation, //done
      RootCause: values.rootCause, //done
      AdjustmentDescription: values.adjustmentDescription, //done
      ConditionAfterAdjustment: values.conditionAfterAdjustment, // done
      ChangeRiskManagementRequired: values.ChangeRiskManagementRequired, // done
      ChangeRiskManagement_AdjustmentReport: values.ChangeRiskManagementList, // Ensure this is an array of ChangeRiskManagement objects
      IsSubmit: operation == OPERATION.Submit, //done
      IsAmendReSubmitTask: operation == OPERATION.Resubmit,
      Photos: { BeforeImages: beforeImages, AfterImages: afterImages },
      CreatedBy: user?.EmployeeId, //need to change
      CreatedDate: dayjs(),
      ModifiedBy: user?.EmployeeId, // need to change conditionally
      ModifiedDate: dayjs(), // change conditionally , if modifying then pass only
    };
    return payload;
  };
  const onSaveFormHandler = (values: any, operation?: any) => {
    debugger;
    try {
      const payload = CreatePayload(values, operation);
      //const res =
      addUpdateReport(payload);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onFinish = (operation?: any) => {
    debugger;
    const values = form.getFieldsValue();
    values.ChangeRiskManagementRequired = cRMRequired;
    values.ChangeRiskManagementList = [];

    const numberOfSections = formSections.length;
    debugger;
    for (let i = 0; i < numberOfSections; i++) {
      // Create a ChangeRiskManagement object for each section
      const changeRiskManagement: ChangeRiskManagement = {
        Changes: values[`changes-${formSections[i]}`],
        RiskAssociated: values[`riskWithChanges-${formSections[i]}`],
        Factor: values[`factor-${formSections[i]}`],
        CounterMeasures: values[`counterMeasures-${formSections[i]}`],
        FunctionId: values[`function-${formSections[i]}`],
        DueDate: values[`date-${formSections[i]}`],
        PersonInCharge: values[`personInCharge-${formSections[i]}`],
        Results: values[`results-${formSections[i]}`],
      };
      debugger;
      values.ChangeRiskManagementList.push(changeRiskManagement);
    }
    debugger;

    onSaveFormHandler(values, operation);
  };

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
  //           CreatedBy: user?.EmployeeId,
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
  //         `${user?.EmployeeId}_${Date.now().toString().slice(-6)}`
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
      <div style={{ position: "relative", left: "1300px", bottom: "80px" }}>
        <>
          <div className="d-flex gap-3">
            {true && (
              <button
                className="btn btn-primary"
                onClick={() => onFinish(OPERATION.Save)}
              >
                <i className="fa-solid fa-floppy-disk" />
                Save
              </button>
            )}

            {true && (
              <button
                className="btn btn-darkgrey "
                onClick={() => onFinish(OPERATION.Submit)}
              >
                <i className="fa-solid fa-share-from-square" />
                Submit
              </button>
            )}

            {false && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={onFinish}
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
            <Form.Item label="Requested By" name="requestedBy">
              <Input placeholder="-" disabled />
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

          <Col span={6}>
            <Form.Item
              label="When"
              name="dateTime"
              rules={[{ required: true, message: "Please Select Date" }]}
            >
              <DatePicker
                disabled={isViewMode}
                disabledDate={disabledDate}
                showTime
                placeholder="Date & Time"
                format="YYYY-MM-DD HH:mm:ss"
                className="bg-antdDisabledBg border-antdDisabledBorder w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={48}>
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
              rules={[
                { required: true, message: "Please select a machine name" },
              ]}
            >
              <Select
                disabled={isViewMode}
                placeholder="Select Machine Name"
                onChange={handleMachineChange}
                value={hideOptions ? "other" : undefined}
                loading={machineloading}
              >
                {/* Dynamically loaded machine options */}
                {!hideOptions &&
                  machinesResult?.ReturnValue?.map((machine: any) => (
                    <Option key={machine.MachineId} value={machine.MachineId}>
                      {machine.MachineName}
                    </Option>
                  ))}

                {/* "Other" Option */}
                <Option key="other" value="other">
                  Other
                </Option>
              </Select>
            </Form.Item>

            {showOtherMachine && (
              <Form.Item label="Other Machine Name" name="OtherMachineName">
                <TextArea
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
                disabled={isViewMode}
                mode="multiple"
                placeholder="Select Sub-Machine Name"
                onChange={handleSubMachineChange}
                value={hideOptionsforSubMachine ? ["other"] : undefined}
                loading={submachineloading}
              >
                {/* "Select All" Option (hidden if "Other" is selected) */}
                {!hideOptionsforSubMachine && (
                  <Option key="all" value="all">
                    Select All
                  </Option>
                )}

                {/* Sub-Machine Options */}
                {!hideOptionsforSubMachine &&
                  filteredSubMachines?.map((subMachine) => (
                    <Option
                      key={subMachine.SubMachineId}
                      value={subMachine.SubMachineId}
                    >
                      {subMachine.SubMachineName}
                    </Option>
                  ))}

                {/* "Other" Option */}
                <Option key="other" value="other">
                  Other
                </Option>
              </Select>
            </Form.Item>

            {showOtherSubMachine && (
              <Form.Item
                label="Other SubMachine Name "
                name="OtherSubMachineName"
              >
                <TextArea
                  rows={1}
                  maxLength={500}
                  placeholder="Provide additional details (optional)"
                />
              </Form.Item>
            )}
          </Col>
          <Col span={6}>
            <Form.Item
              label="Describe Problem"
              name="describeProblem"
              rules={[{ required: true }]}
            >
              <TextArea
                disabled={isViewMode}
                rows={1}
                maxLength={2000}
                placeholder="Describe the problem"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={48}>
          <Col span={6}>
            {/* Observation */}
            <Form.Item
              label="Observation"
              name="observation"
              rules={[{ required: true }]}
            >
              <TextArea
                disabled={isViewMode}
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
                disabled={isViewMode}
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
                disabled={isViewMode}
                rows={4}
                maxLength={2000}
                placeholder="Describe the adjustment made"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
          <Form.Item
                  label={<span className="text-muted w-95">Section Name</span>}
                  name="SectionId"
                  rules={[{ required: true }]}
                >
                  <Select
                 
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
        </Row>
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item
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
                  false
                  // isModeView ||
                  // (submitted && !underAmmendment) ||
                  // ((pcrnSubmission && existingEquipmentReport?.Status!=REQUEST_STATUS.Draft) && !underAmmendment)
                }
                key={`file-upload-before-images`}
                folderName={
                  form.getFieldValue("reportNo") ?? user?.EmployeeId.toString()
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
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="After Images"
              name="afterImages"
              rules={[
                {
                  required: true,
                  message: "Please upload after images!",
                },
              ]}
            >
              <FileUpload
                disabled={
                  false
                  // isModeView ||
                  // (submitted && !underAmmendment) ||
                  // ((pcrnSubmission && existingEquipmentReport?.Status!=REQUEST_STATUS.Draft) && !underAmmendment)
                }
                key={`file-upload-after-images`}
                folderName={
                  form.getFieldValue("reportNo") ?? user?.EmployeeId.toString()
                }
                subFolderName={"AfterImages"}
                libraryName={DocumentLibraries.Adjustment_Attachments}
                files={afterAdjustmentReportPhotos?.map((a) => ({
                  ...a,
                  uid: a.AdjustmentReportPhotoId?.toString() ?? "",
                  name: a.DocumentName,
                  url: `${a.DocumentFilePath}`,
                }))}
                setIsLoading={(loading: boolean) => {
                  // setIsLoading(loading);
                }}
                isLoading={false}
                onAddFile={handleAddAfterImage}
                onRemoveFile={handleRemoveAfterImage}
                uploadType="after"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Condition After Adjustment"
              name="conditionAfterAdjustment"
            >
              <TextArea
                disabled={isViewMode}
                rows={4}
                maxLength={2000}
                placeholder="Describe the condition after adjustment"
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
              onChange={(e: any) => setCRMRequired(e.target.value)}
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
        {cRMRequired && (
          <div className="flex justify-end items-center my-3">
            <div className="flex items-center gap-x-4">
              <Button type="primary" onClick={addFormSection}>
                Add
              </Button>
            </div>
          </div>
        )}
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
        {cRMRequired &&
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
          ))}
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
