import * as React from "react";
import { Button, Form, Tabs, Modal, Select, Input, Upload } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as dayjs from "dayjs";
import { LeftCircleFilled, UploadOutlined } from "@ant-design/icons";
import {
  addOrUpdateTechnicalInstruction,
  getTechnicalInstructionById,
  getEquipmentMasterList,
  deleteTechnicalAttachment,
  createTechnicalAttachment,
  getCurrentApprover,
  updateApproveAskToAmend,
  pullBack,
  getApprorverFlowData,
  //getAllSections,
  closeTechnical,
  createTechnicalOutlineAttachment,
  deleteTechnicalOutlineAttachment,
  getAllSectionsv2,
  updateOutlineEditor,
  insertDelegate,
} from "../../../api/technicalInstructionApi";
import {
  uploadFile,
  checkAndCreateFolder,
  previewFile,
} from "../../../api/fileUploadApi";
import Loader from "../../../utils/Loader"; // Import the loader
const { TabPane } = Tabs;
import { WebPartContext } from "../../../context/WebPartContext";
import displayjsx from "../../../utils/displayjsx";
import { UserContext } from "../../../context/userContext";
import "../../../../../../src/styles/customStyles.css";
interface TechnicalInstructionFormProps {
  isViewMode: boolean;
}
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormTab from "./FormTab";
import HistoryTab from "./HistoryTab";
import WorkFlowButtons from "../../common/workFlowButtons";
import {
  REQUEST_STATUS,
  WEB_URL,
  DOCUMENT_LIBRARIES,
} from "../../../GLOBAL_CONSTANT";
import Workflow from "./WorkflowTab";
import {
  getBase64StringFromBlobUrl,
  renameFolder,
} from "../../../api/utility/utility";
import DeleteFileModal from "../../common/deleteFileModal";
import ClosureAttachment from "./ClosureAttachmentTab";
import { blobUrlToFile } from "../../editor/Options";

const { Option } = Select;

const TechnicalInstructionForm: React.FC<TechnicalInstructionFormProps> = ({
  isViewMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isApproverRequest, isFromAllRequest } = location.state || {};
  const user = React.useContext(UserContext);
  const { id } = useParams<{ id: string }>(); // For update/view mode
  const isEditMode = Boolean(id); // Check if we're in edit mode
  const [activeKey, setActiveKey] = React.useState("1");
  const [form] = Form.useForm();
  const [equipments, setEquipments] = React.useState<
    { EquipmentId: number; EquipmentName: string }[]
  >([]);
  const [fileList, setFileList] = React.useState<any>([]);
  const [technicalOutlineFileList, setTechnicalOutlineFileList] =
    React.useState<any>([]);
  const [technicalClosureFileList, setTechnicalClosureFileList] =
    React.useState<any>([]);
  const [intialFolderName, setIntialFolderName] = React.useState<string>(
    `${user?.employeeId}_${Date.now().toString().slice(-6)}`
  );
  const [loading, setLoading] = React.useState(false);
  const [ctiNumber, setCtiNumber] = React.useState<string>("");
  const [loadedTabs, setLoadedTabs] = React.useState<string[]>(["1"]); // Track loaded tabs
  const [submitted, setsubmitted] = React.useState(false);
  const [underAmmendment, setunderAmmendment] = React.useState(false);
  const [currentApproverTask, setcurrentApproverTask] =
    React.useState<any>(null);
  const [approveerFlowData, setapproveerFlowData] = React.useState<any>([]);
  const [
    existingTechniaclInstructionSlip,
    setexistingTechniaclInstructionSlip,
  ] = React.useState<any>(null);

  const [sectionData, setSectionData] = React.useState<any[]>([]);
  const [selectedSection, setSelectedSection] = React.useState<number | null>(
    null
  ); // State to track selected section
  const [isSecondModalVisible, setIsSecondModalVisible] = React.useState(false);
  const [isReCommentModalVisible, setIsReCommentModalVisible] =
    React.useState(false);
  const [reSubmitComment, setReSubmitComment] = React.useState<string>("");
  const [isClosureModalVisible, setIsClosureModalVisible] =
    React.useState(false);

  const [editorModel, setEditorModel] = React.useState<string>("");
  const [outlineImageFiles, setoutlineImageFiles] = React.useState<any>([]);

  const [formType, setFormType] = React.useState("draft");

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    if (loadedTabs.indexOf(key) === -1) {
      // Use indexOf instead of includes
      setLoadedTabs([...loadedTabs, key]); // Mark tab as loaded on click
    }
  };

  const [submitFormState, setSubmitFormState] = React.useState<any>({
    isSubmit: false,
    isAmendReSubmitTask: false,
    seqNumber: 0,
    sectionId: 0,
  });

  const webPartContext = React.useContext(WebPartContext);
  // Sample initial data for editing/viewing
  const initialData = {
    issueDate: null, //dayjs().add(1, "day"), // Future date for demo
    issuedBy: user?.employeeName,
    title: null,
    ctiNumber: null, //`CTI-${uniqueId}`,
    revisionNo: null,
    purpose: null,
    productType: "6Ah",
    quantity: null,
    outline: null,
    tisApplicabilityDate: null,
    targetClosureDate: null,
    //lotNo: null,
    relatedDocument: [],
    applicationStartDate: null, //dayjs(),
    applicationLotNo: null,
    applicationEquipment: null,
    equipmentIds: [],
  };

  const mapTechnicalAttachments = (attachments: any[]) => {
    return attachments.map((fileObj) => {
      return {
        uid: fileObj.TechnicalAttachmentId, // Unique ID of the file
        name: fileObj.DocumentName, // File name
        status: "done", // Status of the upload (done, uploading, etc.)
        url: null, // You can set this if you have a URL for the file
      };
    });
  };

  const mapTechnicalOutlineAttachments = (attachments: any[]) => {
    return attachments.map((fileObj) => {
      return {
        uid: fileObj.TechnicalOutlineAttachmentId, // Unique ID of the file
        name: fileObj.DocumentName, // File name
        status: "done", // Status of the upload (done, uploading, etc.)
        url: null, // You can set this if you have a URL for the file
      };
    });
  };

  const [showOtherField, setShowOtherField] = React.useState(false);
  const [otherEquipment, setOtherEquipment] = React.useState("");
  const handleChangeEquipment = (value: any) => {
    // Check if "Other" is selected
    //debugger;
    if (value.includes("other")) {
      setShowOtherField(true);
      form.setFieldsValue({
        equipmentIds: ["other"],
        otherEquipment: "",
      }); // Reset the "Other" input field
    } else {
      setShowOtherField(false);
      form.setFieldsValue({
        equipmentIds: value,
        otherEquipment: null, // Clear "Other" input field in form when not needed
      });
    }
    setOtherEquipment("");
  };

  // Load data function in TechnicalInstructionForm component
  const loadData = (): void => {
    if (isEditMode || isViewMode) {
      setLoading(true);
      getTechnicalInstructionById(id!)
        .then((data) => {
          setLoading(false);
          const returnValue = data.ReturnValue;
          setexistingTechniaclInstructionSlip(returnValue);
          setCtiNumber(returnValue.ctiNumber);
          //console.log(ctiNumber);

          form.setFieldsValue({
            ...returnValue,
            revisionNo:
              returnValue.revisionNo == 0 ? null : returnValue.revisionNo,
            issueDate: returnValue.issueDate
              ? dayjs(returnValue.issueDate, "DD-MM-YYYY HH:mm:ss")
              : null,
            tisApplicabilityDate: returnValue.tisApplicabilityDate
              ? dayjs(returnValue.tisApplicabilityDate, "DD-MM-YYYY HH:mm:ss")
              : null,
            targetClosureDate: returnValue.targetClosureDate
              ? dayjs(returnValue.targetClosureDate, "DD-MM-YYYY HH:mm:ss")
              : null,
            applicationStartDate: returnValue.applicationStartDate
              ? dayjs(returnValue.applicationStartDate, "DD-MM-YYYY HH:mm:ss")
              : null,
            technicalAttachmentAdds: returnValue.technicalAttachmentAdds
              ? setFileList(
                mapTechnicalAttachments(returnValue.technicalAttachmentAdds)
              )
              : null,
            technicalOutlineAttachmentAdds:
              returnValue.technicalOutlineAttachmentAdds
                ? setTechnicalOutlineFileList(
                  mapTechnicalOutlineAttachments(
                    returnValue.technicalOutlineAttachmentAdds
                  )
                )
                : null,
          });

          if (returnValue.otherEquipment != null) {
            form.setFieldsValue({
              equipmentIds: ["other"],
            });
            setShowOtherField(true);
            setOtherEquipment(returnValue.otherEquipment);
          }

          setEditorModel(returnValue.outline);

          if (returnValue.isSubmit) {
            setsubmitted(true);
          }
          //debugger;

          if (
            returnValue?.status == REQUEST_STATUS.UnderAmendment &&
            returnValue.userId == user?.employeeId
          ) {
            setunderAmmendment(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          //console.error("Error loading data: ", error);
        });

      setLoading(true);
      getCurrentApprover(id!, user?.employeeId.toString() ?? "")
        .then((data) => {
          setLoading(false);
          //debugger;
          const returnValue = data.ReturnValue;
          setcurrentApproverTask(returnValue);
          // setShowWorkflowBtns(
          //   currentApproverTask?.approverTaskId &&
          //     currentApproverTask?.approverTaskId !== 0
          // );
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    getEquipmentMasterList()
      .then((response) => {
        setLoading(false);
        setEquipments(response.ReturnValue);
      })
      .catch((error) => {
        setLoading(false);
        //message.error(error)
      });

    getApprorverFlowData(id?.toString() ?? "")
      .then((data) => {
        setapproveerFlowData(data.ReturnValue);
      })
      .catch((err) => {
        setapproveerFlowData([]);
      });

    //setFileList([{uid:1, name:"file1", status:"done", url: null},{uid:2, name:"file2", status:"done", url: null}]);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [isEditMode, isViewMode]);

  const mapFiles = (fileList: any) => {
    if (isEditMode) {
      // In edit mode, filter files where status is not 'done' (i.e., new files)
      return fileList
        .filter((fileObj: any) => fileObj.status == null) // Only new files are processed
        .map((fileObj: any) => ({
          DocumentName: fileObj.name,
          DocumentFilePath: fileObj.name, // You can adjust this if the actual file path differs
        }));
    } else {
      // In non-edit mode, map all files (create mode)
      return fileList.map((fileObj: any) => ({
        DocumentName: fileObj.name,
        DocumentFilePath: fileObj.name, // Map existing/new files for create mode
      }));
    }
  };

  const mapOutlineFiles = (fileList: any) => {
    if (isEditMode) {
      // In edit mode, filter files where status is not 'done' (i.e., new files)
      return fileList
        .filter((fileObj: any) => fileObj.status == null) // Only new files are processed
        .map((fileObj: any) => ({
          DocumentName: fileObj.name,
          DocumentFilePath: fileObj.name, // You can adjust this if the actual file path differs
        }));
    } else {
      // In non-edit mode, map all files (create mode)
      return fileList.map((fileObj: any) => ({
        DocumentName: fileObj.name,
        DocumentFilePath: fileObj.name, // Map existing/new files for create mode
      }));
    }
  };

  const mapClosureFiles = (fileList: any) => {
    if (isViewMode) {
      // In edit mode, filter files where status is not 'done' (i.e., new files)
      return fileList
        .filter((fileObj: any) => fileObj.status == null) // Only new files are processed
        .map((fileObj: any) => ({
          DocumentName: fileObj.name,
          DocumentFilePath: fileObj.name, // You can adjust this if the actual file path differs
        }));
    } else {
      // In non-edit mode, map all files (create mode)
      return fileList.map((fileObj: any) => ({
        DocumentName: fileObj.name,
        DocumentFilePath: fileObj.name, // Map existing/new files for create mode
      }));
    }
  };

  const isOnlySpacesInPTag = (str: any) => {
    return /^<p>(\s|&nbsp;)*<\/p>$/.test(str);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    //console.log("Form values: ", values);

    if (
      editorModel === null ||
      editorModel === "" ||
      editorModel.trim() === "" ||
      editorModel === undefined ||
      isOnlySpacesInPTag(editorModel)
    ) {
      setLoading(false);

      void displayjsx.showErrorMsg("Please enter Outline");
      return false;
    }
    //debugger;
    const technicalInstructionData = {
      TechnicalId: id ? parseInt(id, 10) : 0, // For update
      issueDate: values.issueDate
        ? dayjs(values.issueDate).format("YYYY-MM-DD")
        : null,
      issuedBy: values.issuedBy,
      title: values.title,
      ctiNumber: values.ctiNumber,
      // revisionNo: isNaN(parseInt(values.revisionNo))
      //   ? null
      //   : parseInt(values.revisionNo),
      purpose: values.purpose,
      productType: values.productType,
      quantity: isNaN(parseInt(values.quantity)) ? null : values.quantity,
      //outline: values.outline,
      outline: editorModel,
      tisApplicabilityDate: values.tisApplicabilityDate
        ? dayjs(values.tisApplicabilityDate).format("YYYY-MM-DD")
        : null,
      targetClosureDate: values.targetClosureDate
        ? dayjs(values.targetClosureDate).format("YYYY-MM-DD")
        : null,
      //lotNo: values.lotNo,
      //attachment: "files",
      applicationStartDate: values.applicationStartDate
        ? dayjs(values.applicationStartDate).format("YYYY-MM-DD")
        : null,
      applicationLotNo: values.applicationLotNo,
      //applicationEquipment: "test",
      // equipmentIds: values.equipmentIds
      //   ? values.equipmentIds.filter(
      //       (value: any, index: any, self: string | any[]) =>
      //         self.indexOf(value) === index
      //     )
      //   : null,
      equipmentIds: values.equipmentIds
        ? values.equipmentIds[0] === "other"
          ? [-1]
          : values.equipmentIds
        : [],
      technicalAttachmentAdds: fileList ? mapFiles(fileList) : null,
      technicalOutlineAttachmentAdds: technicalOutlineFileList
        ? mapOutlineFiles(technicalOutlineFileList)
        : null,
      userId: user?.employeeId,
      isSubmit: values.isSubmit,
      isAmendReSubmitTask: values.isAmendReSubmitTask,
      sectionId: values.sectionId,
      ...submitFormState,
      comment: reSubmitComment,
      otherEquipment: values.otherEquipment ?? null,
    };

    //console.log(technicalInstructionData);

    // Call the API to add or update the technical instruction
    addOrUpdateTechnicalInstruction(technicalInstructionData)
      .then(async (response) => {
        setLoading(false);
        //console.log("Response from API: ", response);
        //debugger;

        const getResObj = response.ReturnValue;

        const GetTechnicalId = getResObj.TechnicalId;

        if (getResObj && getResObj.TechnicalId) {
          const folderName = getResObj.ctiNumber;

          if (isEditMode != true) {
            // Check and create folder if necessary
            // const isValidFolder = await checkAndCreateFolder(
            //   webPartContext,
            //   "TechnicalSheetDocs",
            //   intialFolderName
            // );

            // console.log(isValidFolder);

            // Ensure fileList is defined and is an array
            if (fileList && Array.isArray(fileList)) {
              // Loop through each file in fileList
              // await Promise.all(
              //   fileList.map(async (file: any) => {
              //     // Call the uploadFile function for each file
              //     await uploadFile(
              //       webPartContext,
              //       "TechnicalSheetDocs",
              //       folderName,
              //       file,
              //       file.name
              //     );
              //   })
              // );
              //console.log(intialFolderName);
              void (await renameFolder(
                DOCUMENT_LIBRARIES.Technical_Attachment,
                WEB_URL,
                webPartContext?.spHttpClient ?? null,
                intialFolderName,
                folderName
              ));
            } else {
              //console.error("fileList is undefined or not an array:", fileList);
            }

            if (
              technicalOutlineFileList &&
              Array.isArray(technicalOutlineFileList)
            ) {
              void (await renameFolder(
                DOCUMENT_LIBRARIES.Technical_Attachment,
                WEB_URL,
                webPartContext?.spHttpClient ?? null,
                intialFolderName,
                folderName
              ));
            }
          }

          {
            if (outlineImageFiles && Array.isArray(outlineImageFiles)) {
              // Check and create folder if necessary
              //debugger;

              const isValidFolderOutline = await checkAndCreateFolder(
                webPartContext,
                DOCUMENT_LIBRARIES.Technical_Attachment,
                folderName,
                DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
              );

              console.log(isValidFolderOutline);

              const uploadedUrls = await Promise.all(
                outlineImageFiles.map(async (file, index) => {
                  // Generate unique filename for each image
                  //debugger;
                  const uniqueFileName = `image-${Date.now()}-${index}.jpg`; // or extract from metadata if available

                  // Convert the Blob URL to a File object
                  const updInSharePointfile = await blobUrlToFile(
                    file,
                    uniqueFileName
                  );

                  // Call the uploadFile function for each file
                  const uploaded = await uploadFile(
                    webPartContext,
                    DOCUMENT_LIBRARIES.Technical_Attachment,
                    folderName,
                    updInSharePointfile,
                    uniqueFileName,
                    DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
                  );

                  // If the upload is successful, return the file URL (SharePoint URL or the response URL)
                  return uploaded ? uniqueFileName : null; // Return null if upload fails
                })
              );

              // Filter out null values (failed uploads)
              // const successfulUploads = uploadedUrls.filter(Boolean);

              //debugger;

              console.log(uploadedUrls);

              // Step 2: Replace base64 URLs with uploaded file URLs in the editor content
              // let updatedContent = editorModel;
              let __updatedContent = editorModel;
              // successfulUploads.forEach((url: any, index) => {
              //   updatedContent = updatedContent.replace(
              //     outlineImageFiles[index],
              //     `${WEB_URL}/${DOCUMENT_LIBRARIES.Technical_Attachment}/${folderName}/${DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment}/${url}`
              //   ); // Replace base64 with SharePoint URL
              // });

              //debugger;

              for (const url of outlineImageFiles) {
                const base64String = await getBase64StringFromBlobUrl(url);
                __updatedContent = __updatedContent.replace(
                  `<img src="${url}"`,
                  `<img src="${base64String}"`
                );
              }

              //console.log(__updatedContent);

              setLoading(true);
              await updateOutlineEditor({
                TechnicalId: GetTechnicalId,
                outline: __updatedContent,
                outlineImageBytes: __updatedContent,
              })
                .then((c) => {
                  //debugger;
                  setLoading(false);
                  //navigate("/");
                  // navigate("/", {
                  //   state: {
                  //     currentTabState: "myapproval-tab",
                  //   },
                  // });
                  //const data = c.ReturnValue;
                })
                .catch((c) => {
                  setLoading(false);
                });
            }
          }

          {
            /* // In edit section now off part
          else if (isEditMode == true) {
            let uploadFileList = fileList.filter(
              (fileObj: any) => fileObj.status == null
            ); // Only new files are processed

            // Check and create folder if necessary
            let isValidFolder = await checkAndCreateFolder(
              webPartContext,
              "TechnicalSheetDocs",
              folderName
            );

            console.log(isValidFolder);

            // Ensure fileList is defined and is an array
            if (uploadFileList && Array.isArray(uploadFileList)) {
              // Loop through each file in fileList
              await Promise.all(
                fileList.map(async (file: any) => {
                  // Call the uploadFile function for each file
                  await uploadFile(
                    webPartContext,
                    "TechnicalSheetDocs",
                    folderName,
                    file,
                    file.name
                  );
                })
              );
            } else {
              //console.error("fileList is undefined or not an array:", fileList);
            }
          }*/
          }
        }

        if (formType === "draft") {
          void displayjsx.showSuccess(
            "Technical Instruction form saved successfully."
          );
        } else if (formType === "submit") {
          void displayjsx.showSuccess(
            "Technical Instruction form submitted successfully."
          );
        } else {
          void displayjsx.showSuccess(
            "Technical Instruction form saved successfully."
          );
        }

        // Navigate back to the list after successful submission
        if (isFromAllRequest) {
          navigate("/", {
            state: {
              currentTabState: "allrequest-tab",
            },
          });
        } else if (isApproverRequest) {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        } else {
          navigate("/");
        }
        //navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        void displayjsx.showErrorMsg("Error submitting form.");
        //console.error("Error submitting form: ", error);
        // Optionally show an error message to the user
      });
  };

  const handleFetchSections = () => {
    setLoading(true);
    //getAllSections(user?.departmentId.toString() ?? "")
    getAllSectionsv2()
      .then((data) => {
        setLoading(false);
        let returnData = data.ReturnValue;
        setSectionData(returnData); // Set fetched section data
        setSelectedSection(null);
        setIsSecondModalVisible(true); // Open the second modal with sections
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // Handle final form submission after selecting a section
  const handleFinalSubmit = async () => {
    if (selectedSection) {
      setLoading(true);
      try {
        // Using a local variable to capture the selected section
        const updatedSectionId = selectedSection;

        // Update submit form state and submit the form programmatically after state updates
        setSubmitFormState((prevState: any) => ({
          ...prevState,
          sectionId: updatedSectionId,
        }));

        setFormType("submit");

        // Check if the updated section ID is set and then submit the form
        if (updatedSectionId > 0) {
          form.submit(); // Programmatically submit the form
        }

        setIsSecondModalVisible(false); // Close the second modal
      } catch (error) {
        console.error("Error submitting the form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handelRemoveFileAction1 = (file: any): void => {
  //   setLoading(true);
  //   deleteTechnicalAttachment(file.uid)
  //     .then(() => {
  //       setLoading(false);
  //       const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
  //       void displayjsx.showSuccess(`${file.name} removed successfully.`);
  //       //message.success(`${file.name} removed successfully.`);
  //       setFileList(newFileList);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       void displayjsx.showErrorMsg(`Failed to remove ${file.name}.`);
  //       //message.error(`Failed to remove ${file.name}.`);
  //     });
  // };

  // const handelRemoveFileAction2 = (file: any): void => {
  //   const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
  //   void displayjsx.showSuccess(`${file.name} removed successfully.`);
  //   //message.success(`${file.name} removed successfully.`);
  //   setFileList(newFileList);
  // };

  // Handle file removal With Modal
  // const handleRemove = (file: any): void => {
  //   if (isEditMode && file.status == "done") {
  //     Modal.confirm({
  //       title: "Delete Confirmation",
  //       icon: (
  //         <FontAwesomeIcon
  //           icon={faCircleExclamation}
  //           style={{ marginRight: "10px", marginTop: "5px", color: "#faad14" }}
  //         />
  //       ),
  //       content: (
  //         <p>
  //           Do you want to permanently delete the file{" "}
  //           <strong>{file.name}</strong>?
  //         </p>
  //       ),
  //       okText: "Yes",
  //       cancelText: "No",
  //       okType: "primary",
  //       okButtonProps: { className: "btn btn-primary save-btn" },
  //       cancelButtonProps: { className: "btn-outline-primary no-btn" },
  //       onOk: () => {
  //         handelRemoveFileAction1(file);
  //       },
  //     });
  //   } else {
  //     Modal.confirm({
  //       title: "Delete Confirmation",
  //       icon: (
  //         <FontAwesomeIcon
  //           icon={faCircleExclamation}
  //           style={{ marginRight: "10px", marginTop: "5px", color: "#faad14" }}
  //         />
  //       ),
  //       content: (
  //         <p>
  //           Do you want to permanently delete the file{" "}
  //           <strong>{file.name}</strong>?
  //         </p>
  //       ),
  //       okText: "Yes",
  //       cancelText: "No",
  //       okType: "primary",
  //       okButtonProps: { className: "btn btn-primary save-btn" },
  //       cancelButtonProps: { className: "btn-outline-primary no-btn" },
  //       onOk: () => {
  //         handelRemoveFileAction2(file);
  //       },
  //     });
  //   }
  // };

  // Handle file removal
  const handleRemove = async (file: any) => {
    const confirm = await DeleteFileModal(file.name);
    if (confirm) {
      if (isEditMode && file.status == "done") {
        setLoading(true);
        deleteTechnicalAttachment(file.uid)
          .then(() => {
            setLoading(false);
            const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
            void displayjsx.showSuccess(`${file.name} removed successfully.`);
            //message.success(`${file.name} removed successfully.`);
            setFileList(newFileList);
          })
          .catch((error) => {
            setLoading(false);
            void displayjsx.showErrorMsg(`Failed to remove ${file.name}.`);
            //message.error(`Failed to remove ${file.name}.`);
          });
      } else {
        const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
        void displayjsx.showSuccess(`${file.name} removed successfully.`);
        //message.success(`${file.name} removed successfully.`);
        setFileList(newFileList);
      }
    }
  };

  const handleOutlineRemove = async (file: any) => {
    const confirm = await DeleteFileModal(file.name);
    if (confirm) {
      if (isEditMode && file.status == "done") {
        setLoading(true);
        deleteTechnicalOutlineAttachment(file.uid)
          .then(() => {
            setLoading(false);
            const newFileList = technicalOutlineFileList.filter(
              (f: any) => f.uid !== file.uid
            );
            void displayjsx.showSuccess(`${file.name} removed successfully.`);
            //message.success(`${file.name} removed successfully.`);
            setTechnicalOutlineFileList(newFileList);
          })
          .catch((error) => {
            setLoading(false);
            void displayjsx.showErrorMsg(`Failed to remove ${file.name}.`);
            //message.error(`Failed to remove ${file.name}.`);
          });
      } else {
        const newFileList = technicalOutlineFileList.filter(
          (f: any) => f.uid !== file.uid
        );
        void displayjsx.showSuccess(`${file.name} removed successfully.`);
        //message.success(`${file.name} removed successfully.`);
        setTechnicalOutlineFileList(newFileList);
      }
    }
  };

  const handleClosureRemove = async (file: any) => {
    const confirm = await DeleteFileModal(file.name);
    if (confirm) {
      if (isViewMode && file.status == "done") {
        // setLoading(true);
        // deleteTechnicalOutlineAttachment(file.uid)
        //   .then(() => {
        //     setLoading(false);
        //     const newFileList = technicalOutlineFileList.filter(
        //       (f: any) => f.uid !== file.uid
        //     );
        //     void displayjsx.showSuccess(`${file.name} removed successfully.`);
        //     //message.success(`${file.name} removed successfully.`);
        //     setTechnicalOutlineFileList(newFileList);
        //   })
        //   .catch((error) => {
        //     setLoading(false);
        //     void displayjsx.showErrorMsg(`Failed to remove ${file.name}.`);
        //     //message.error(`Failed to remove ${file.name}.`);
        //   });
      } else {
        const newFileList = technicalClosureFileList.filter(
          (f: any) => f.uid !== file.uid
        );
        void displayjsx.showSuccess(`${file.name} removed successfully.`);
        //message.success(`${file.name} removed successfully.`);
        setTechnicalClosureFileList(newFileList);
      }
    }
  };

  const handleSave = () => {
    // Trigger form validation before showing the modal
    form
      .validateFields()
      .then(() => {
        if (
          editorModel === null ||
          editorModel === "" ||
          editorModel.trim() === "" ||
          editorModel === undefined ||
          isOnlySpacesInPTag(editorModel)
        ) {
          setLoading(false);

          void displayjsx.showErrorMsg("Please enter Outline");
          return false;
        }

        // If validation passes, show the confirmation modal
        Modal.confirm({
          title: "Are you sure you want to save the form?",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ marginRight: "10px", marginTop: "5px" }}
            />
          ),
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { className: "btn btn-primary save-btn" },
          cancelButtonProps: { className: "btn-outline-primary no-btn" },
          onOk: () => {
            setSubmitFormState({
              ...submitFormState,
              isSubmit: false,
              isAmendReSubmitTask: false,
            });
            form.submit(); // Trigger form submit programmatically if "Yes" is clicked
          },
        });
      })
      .catch((error) => {
        // If validation fails, handle the error (e.g., show error messages)
        //console.log("Form validation failed", error);
      });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        if (
          editorModel === null ||
          editorModel === "" ||
          editorModel.trim() === "" ||
          editorModel === undefined ||
          isOnlySpacesInPTag(editorModel)
        ) {
          setLoading(false);

          void displayjsx.showErrorMsg("Please enter Outline");
          return false;
        }

        Modal.confirm({
          title: "Are you sure you want to submit the form?",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ marginRight: "10px", marginTop: "5px" }}
            />
          ),
          //content: "Please confirm if you want to proceed.",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { className: "btn btn-primary save-btn" },
          cancelButtonProps: { className: "btn-outline-primary no-btn" },
          onOk: () => {
            setSubmitFormState({
              ...submitFormState,
              isSubmit: true,
              isAmendReSubmitTask: false,
              //sectionId: 2,
            });
            //form.submit(); // Trigger form submit programmatically if "Yes" is clicked
            handleFetchSections();
          },
        });
      })
      .catch((error) => {
        // If validation fails, handle the error (e.g., show error messages)
        //console.log("Form validation failed", error);
      });
  };

  const handleReSubmit = () => {
    // Trigger form validation before showing the modal
    form
      .validateFields()
      .then(() => {
        if (
          editorModel === null ||
          editorModel === "" ||
          editorModel.trim() === "" ||
          editorModel === undefined ||
          isOnlySpacesInPTag(editorModel)
        ) {
          setLoading(false);

          void displayjsx.showErrorMsg("Please enter Outline");
          return false;
        }

        Modal.confirm({
          title: "Are you sure you want to  resubmit the form?",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ marginRight: "10px", marginTop: "5px" }}
            />
          ),
          //content: "Please confirm if you want to proceed.",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { className: "btn btn-primary save-btn" },
          cancelButtonProps: { className: "btn-outline-primary no-btn" },
          onOk: () => {
            setSubmitFormState({
              ...submitFormState,
              isSubmit: true,
              isAmendReSubmitTask: true,
            });
            //form.submit(); // Trigger form submit programmatically if "Yes" is clicked
            handleFetchSections();

            //--> When flow start from where trigger ask to amend
            //setReSubmitComment("");
            //return setIsReCommentModalVisible(true);
          },
        });
      })
      .catch((error) => {
        // If validation fails, handle the error (e.g., show error messages)
        //console.log("Form validation failed", error);
      });
  };

  //When flow want to start as before under-amen dment
  // const handleReSubmit = () => {
  //   Modal.confirm({
  //     title: "Are you sure you want to  resubmit the form?",
  //     icon: (
  //       <FontAwesomeIcon
  //         icon={faCircleExclamation}
  //         style={{ marginRight: "10px", marginTop: "5px" }}
  //       />
  //     ),
  //     //content: "Please confirm if you want to proceed.",
  //     okText: "Yes",
  //     cancelText: "No",
  //     okType: "primary",
  //     okButtonProps: { className: "btn btn-primary save-btn" },
  //     cancelButtonProps: { className: "btn-outline-primary no-btn" },
  //     onOk: () => {
  //       setSubmitFormState({
  //         ...submitFormState,
  //         isSubmit: true,
  //         isAmendReSubmitTask: true,
  //       });
  //       form.submit(); // Trigger form submit programmatically if "Yes" is clicked
  //       //handleFetchSections();
  //     },
  //   });
  // };

  const handleApprove = async (comment: string): Promise<void> => {
    //console.log("Approved with comment:", comment);
    const data = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.employeeId,
      type: 1, //Approved
      comment: comment,
      technicalId: existingTechniaclInstructionSlip.TechnicalId,
    };
    setLoading(true);
    updateApproveAskToAmend(data)
      .then((c) => {
        setLoading(false);
        //navigate("/");
        void displayjsx.showSuccess(
          "Technical Instruction form has been approved."
        );
        if (isFromAllRequest) {
          navigate("/", {
            state: {
              currentTabState: "allrequest-tab",
            },
          });
        } else if (isApproverRequest) {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        } else {
          navigate("/");
        }
        // navigate("/", {
        //   state: {
        //     currentTabState: "myapproval-tab",
        //   },
        // });
      })
      .catch((c) => {
        setLoading(false);
      });

    // Simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleAskToAmend = async (comment: string): Promise<void> => {
    const data = {
      ApproverTaskId: currentApproverTask.approverTaskId,
      CurrentUserId: user?.employeeId,
      type: 3, //AskToAmend
      comment: comment,
      technicalId: existingTechniaclInstructionSlip.TechnicalId,
    };
    setLoading(true);
    updateApproveAskToAmend(data)
      .then((c) => {
        setLoading(false);
        //navigate("/");
        void displayjsx.showSuccess(
          "Technical Instruction form has been requested to amend."
        );
        if (isFromAllRequest) {
          navigate("/", {
            state: {
              currentTabState: "allrequest-tab",
            },
          });
        } else if (isApproverRequest) {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        } else {
          navigate("/");
        }
        // navigate("/", {
        //   state: {
        //     currentTabState: "myapproval-tab",
        //   },
        // });
      })
      .catch((c) => {
        setLoading(false);
      });

    // Simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handlePullBack = async (comment: string): Promise<void> => {
    const data = {
      technicalId: existingTechniaclInstructionSlip.TechnicalId,
      userId: user?.employeeId,
      comment: comment,
    };
    setLoading(true);
    pullBack(data)
      .then((c) => {
        setLoading(false);
        void displayjsx.showSuccess(
          "Technical Instruction form has been pulled back."
        );
        if (isFromAllRequest) {
          navigate("/", {
            state: {
              currentTabState: "allrequest-tab",
            },
          });
        } else if (isApproverRequest) {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        } else {
          navigate("/");
        }
      })
      .catch((c) => {
        setLoading(false);
      });

    // Simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDelegate = async (
    userId: string,
    comment: string
  ): Promise<void> => {
    const data = {
      FormId: existingTechniaclInstructionSlip.TechnicalId,
      UserId: user?.employeeId,
      activeUserId: existingTechniaclInstructionSlip?.activeUserId,
      DelegateUserId: userId,
      Comments: comment,
    };
    setLoading(true);
    insertDelegate(data)
      .then((c) => {
        setLoading(false);
        void displayjsx.showSuccess(
          "Technical Instruction form has been delegate."
        );
        if (isFromAllRequest) {
          navigate("/", {
            state: {
              currentTabState: "allrequest-tab",
            },
          });
        } else if (isApproverRequest) {
          navigate("/", {
            state: {
              currentTabState: "myapproval-tab",
            },
          });
        } else {
          navigate("/");
        }
      })
      .catch((c) => {
        setLoading(false);
      });
  };

  //Handle file upload
  const handleUpload = async (file: any) => {
    const MAX_FILES = 5;
    const MAX_FILE_SIZE_MB = 10;
    const ALLOWED_FILE_TYPES = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg", // Added for JPG and JPEG
      "image/png", // Added for PNG
    ];

    // Check if the file with the same name already exists in the fileList
    const isDuplicate = fileList.some(
      (existingFile: any) => existingFile.name === file.name
    );

    if (isDuplicate) {
      // Display a message indicating that the file already exists
      void displayjsx.showErrorMsg(
        `File with the name "${file.name}" already exists.`
      );
      return false; // Prevent the file from being added to the list
    }

    // Validate the maximum file count
    if (fileList.length >= MAX_FILES) {
      void displayjsx.showErrorMsg(
        `Cannot upload more than ${MAX_FILES} files.`
      );
      return false;
    }

    // Validate file size (convert size from bytes to MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      void displayjsx.showErrorMsg(
        `File "${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
      );
      return false;
    } else if (/[*'",%&#^@]/.test(file.name)) {
      void displayjsx.showErrorMsg(
        "File name must not contain Invalid Characters(*'\"%,&#^@) !"
      );
    }

    // Validate file type using `some` instead of `includes`
    const isAllowedFileType = ALLOWED_FILE_TYPES.some(
      (type) => type === file.type
    );

    if (!isAllowedFileType) {
      void displayjsx.showErrorMsg(
        `File type not supported. Allowed types are: Word, Excel, PDF, PPT, JPG, PNG, JPEG.`
      );
      return false;
    }

    if (isEditMode) {
      const folderName = ctiNumber;
      const uploadFileItem = file; // Process only the new file

      if (uploadFileItem && folderName) {
        try {
          setLoading(true);

          // Check and create folder if necessary
          const isValidFolder = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
          );

          console.log(isValidFolder);
          // Upload the file
          const fileResponse = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            uploadFileItem,
            uploadFileItem.name,
            DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
          );

          if (fileResponse) {
            // Add a record in the technical attachments
            await createTechnicalAttachment({
              TechnicalId: id,
              DocumentName: uploadFileItem.name,
              CreatedBy: user?.employeeId,
            });

            // Refresh the technical instruction to get the updated file list
            const data = await getTechnicalInstructionById(id!);
            const returnValue = data.ReturnValue;
            setFileList(
              mapTechnicalAttachments(returnValue.technicalAttachmentAdds)
            );
            void displayjsx.showSuccess(
              `${uploadFileItem.name} saved successfully.`
            );
          } else {
            void displayjsx.showErrorMsg(
              `Failed to saved ${uploadFileItem.name}. Please try again.`
            );
          }
        } catch (error) {
          setLoading(false);
          void displayjsx.showErrorMsg(
            `Failed to saved ${uploadFileItem.name}.`
          );
          //console.error("Error uploading files:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (intialFolderName == "") {
        setIntialFolderName(
          `${user?.employeeId}_${Date.now().toString().slice(-6)}`
        );
      } else {
      }

      const folderName = intialFolderName;

      const uploadFileItem = file; // Process only the new file
      if (uploadFileItem) {
        try {
          setLoading(true);
          // Check and create folder if necessary
          const isValidFolder = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
          );

          console.log(isValidFolder);
          // Upload the file
          const fileRes = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            uploadFileItem,
            uploadFileItem.name,
            DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
          );

          // If no duplicate, add the file to the fileList directly
          if (fileRes) setFileList([...fileList, file]);
          else {
            void displayjsx.showErrorMsg(
              `Failed to saved ${uploadFileItem.name}. Please try again.`
            );
          }
        } catch (error) {
          setLoading(false);
          void displayjsx.showErrorMsg(
            `Failed to saved ${uploadFileItem.name}.`
          );
        } finally {
          setLoading(false);
        }
      }
    }

    // Return false to prevent the default upload behavior
    return false;
  };

  const handleOutlineUpload = async (file: any) => {
    const MAX_FILES = 5;
    const MAX_FILE_SIZE_MB = 10;
    const ALLOWED_FILE_TYPES = [
      "image/jpeg", // Added for JPG and JPEG
      "image/png", // Added for PNG
    ];

    // Check if the file with the same name already exists in the fileList
    const isDuplicate = technicalOutlineFileList.some(
      (existingFile: any) => existingFile.name === file.name
    );

    if (isDuplicate) {
      // Display a message indicating that the file already exists
      void displayjsx.showErrorMsg(
        `File with the name "${file.name}" already exists.`
      );
      return false; // Prevent the file from being added to the list
    }

    // Validate the maximum file count
    if (technicalOutlineFileList.length >= MAX_FILES) {
      void displayjsx.showErrorMsg(
        `Cannot upload more than ${MAX_FILES} files.`
      );
      return false;
    }

    // Validate file size (convert size from bytes to MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      void displayjsx.showErrorMsg(
        `File "${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
      );
      return false;
    } else if (/[*'",%&#^@]/.test(file.name)) {
      void displayjsx.showErrorMsg(
        "File name must not contain Invalid Characters(*'\"%,&#^@) !"
      );
    }

    // Validate file type using `some` instead of `includes`
    const isAllowedFileType = ALLOWED_FILE_TYPES.some(
      (type) => type === file.type
    );

    if (!isAllowedFileType) {
      void displayjsx.showErrorMsg(
        `File type not supported. Allowed types are: Jpg, PNG, Jpeg.`
      );
      return false;
    }

    if (isEditMode) {
      const folderName = ctiNumber;
      const uploadFileItem = file; // Process only the new file

      if (uploadFileItem && folderName) {
        try {
          setLoading(true);

          // Check and create folder if necessary
          const isValidFolder = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
          );

          console.log(isValidFolder);
          // Upload the file
          const fileRes = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            uploadFileItem,
            uploadFileItem.name,
            DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
          );

          if (fileRes) {
            // Add a record in the technical attachments
            await createTechnicalOutlineAttachment({
              TechnicalId: id,
              DocumentName: uploadFileItem.name,
              CreatedBy: user?.employeeId,
            });

            // Refresh the technical instruction to get the updated file list
            const data = await getTechnicalInstructionById(id!);
            const returnValue = data.ReturnValue;
            setTechnicalOutlineFileList(
              mapTechnicalOutlineAttachments(
                returnValue.technicalOutlineAttachmentAdds
              )
            );
            void displayjsx.showSuccess(
              `${uploadFileItem.name} saved successfully.`
            );
          } else {
            void displayjsx.showErrorMsg(
              `Failed to saved ${uploadFileItem.name}. Please try again.`
            );
          }
        } catch (error) {
          setLoading(false);
          void displayjsx.showErrorMsg(
            `Failed to saved ${uploadFileItem.name}.`
          );
          //console.error("Error uploading files:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (intialFolderName == "") {
        setIntialFolderName(
          `${user?.employeeId}_${Date.now().toString().slice(-6)}`
        );
      } else {
      }

      const folderName = intialFolderName;

      const uploadFileItem = file; // Process only the new file
      if (uploadFileItem) {
        try {
          setLoading(true);
          // Check and create folder if necessary
          const isValidFolder = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
          );

          console.log(isValidFolder);
          // Upload the file
          const fileRes = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            uploadFileItem,
            uploadFileItem.name,
            DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
          );

          // If no duplicate, add the file to the fileList directly
          if (fileRes) setTechnicalOutlineFileList([...technicalOutlineFileList, file]);
          else {
            void displayjsx.showErrorMsg(
              `Failed to saved ${uploadFileItem.name}. Please try again.`
            );
          }
        } catch (error) {
          setLoading(false);
          void displayjsx.showErrorMsg(
            `Failed to saved ${uploadFileItem.name}.`
          );
        } finally {
          setLoading(false);
        }
      }
    }

    // Return false to prevent the default upload behavior
    return false;
  };

  const handleClosureUpload = async (file: any) => {
    // const MAX_FILES = 3;
    // const MAX_FILE_SIZE_MB = 10;
    // const ALLOWED_FILE_TYPES = [
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //   "application/vnd.ms-excel",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/pdf",
    //   "application/vnd.ms-powerpoint",
    //   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    //   "image/jpeg", // Added for JPG and JPEG
    //   "image/png", // Added for PNG
    // ];

    // // Check if the file with the same name already exists in the fileList
    // const isDuplicate = technicalClosureFileList.some(
    //   (existingFile: any) => existingFile.name === file.name
    // );

    // if (isDuplicate) {
    //   // Display a message indicating that the file already exists
    //   void displayjsx.showErrorMsg(
    //     `File with the name "${file.name}" already exists.`
    //   );
    //   return false; // Prevent the file from being added to the list
    // }

    // // Validate the maximum file count
    // if (technicalClosureFileList.length >= MAX_FILES) {
    //   void displayjsx.showErrorMsg(
    //     `Cannot upload more than ${MAX_FILES} files.`
    //   );
    //   return false;
    // }

    // // Validate file size (convert size from bytes to MB)
    // const fileSizeInMB = file.size / (1024 * 1024);
    // if (fileSizeInMB > MAX_FILE_SIZE_MB) {
    //   void displayjsx.showErrorMsg(
    //     `File "${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
    //   );
    //   return false;
    // }

    // // Validate file type using `some` instead of `includes`
    // const isAllowedFileType = ALLOWED_FILE_TYPES.some(
    //   (type) => type === file.type
    // );

    // if (!isAllowedFileType) {
    //   void displayjsx.showErrorMsg(
    //     `File type not supported. Allowed types are: Word, Excel, PDF, PPT, JPG, PNG, JPEG.`
    //   );
    //   return false;
    // }

    const MAX_FILES = 3;
    const MAX_FILE_SIZE_MB = 10;
    const DISALLOWED_FILE_TYPE = "application/x-msdownload"; // MIME type for .exe

    // Check if the file with the same name already exists in the fileList
    const isDuplicate = technicalClosureFileList.some(
      (existingFile: any) => existingFile.name === file.name
    );

    if (isDuplicate) {
      void displayjsx.showErrorMsg(
        `File with the name "${file.name}" already exists.`
      );
      return false;
    }

    // Validate the maximum file count
    if (technicalClosureFileList.length >= MAX_FILES) {
      void displayjsx.showErrorMsg(
        `Cannot upload more than ${MAX_FILES} files.`
      );
      return false;
    }

    // Validate file size (convert size from bytes to MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      void displayjsx.showErrorMsg(
        `File "${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
      );
      return false;
    } else if (/[*'",%&#^@]/.test(file.name)) {
      void displayjsx.showErrorMsg(
        "File name must not contain Invalid Characters(*'\"%,&#^@) !"
      );
    }

    // Validate file type (disallow .exe files)
    if (file.type === DISALLOWED_FILE_TYPE || file.name.endsWith(".exe")) {
      void displayjsx.showErrorMsg(
        `File type not allowed. Executable files (.exe) are not supported.`
      );
      return false;
    }
    if (isViewMode) {
      const folderName = ctiNumber;
      const uploadFileItem = file; // Process only the new file

      if (uploadFileItem && folderName) {
        try {
          setLoading(true);

          // Check and create folder if necessary
          const isValidFolder = await checkAndCreateFolder(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
          );

          console.log(isValidFolder);
          // Upload the file
          const fileUploadResult = await uploadFile(
            webPartContext,
            DOCUMENT_LIBRARIES.Technical_Attachment,
            folderName,
            uploadFileItem,
            uploadFileItem.name,
            DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
          );
          // Add a record in the technical attachments
          // await createTechnicalOutlineAttachment({
          //   TechnicalId: id,
          //   DocumentName: uploadFileItem.name,
          //   CreatedBy: user?.employeeId,
          // });

          // Refresh the technical instruction to get the updated file list
          // const data = await getTechnicalInstructionById(id!);
          // const returnValue = data.ReturnValue;
          // setTechnicalOutlineFileList(
          //   mapClosureFiles(
          //     returnValue.technicalClosureAttachmentAdds
          //   )
          // );

          // If no duplicate, add the file to the fileList directly
          if (fileUploadResult) {
            setTechnicalClosureFileList((prev: any) => [...prev, file]);
            void displayjsx.showSuccess(
              `${uploadFileItem.name} saved successfully.`
            );
          } else {
            void displayjsx.showErrorMsg(
              `Failed to saved ${uploadFileItem.name}. Please try again.`
            );
          }

        } catch (error) {
          setLoading(false);
          void displayjsx.showErrorMsg(
            `Failed to saved ${uploadFileItem.name}.`
          );
          console.error("Error uploading files:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      // if (intialFolderName == "") {
      //   setIntialFolderName(
      //     `${user?.employeeId}_${Date.now().toString().slice(-6)}`
      //   );
      // } else {
      // }
      // const folderName = intialFolderName;
      // const uploadFileItem = file; // Process only the new file
      // if (uploadFileItem) {
      //   try {
      //     setLoading(true);
      //     // Check and create folder if necessary
      //     const isValidFolder = await checkAndCreateFolder(
      //       webPartContext,
      //       DOCUMENT_LIBRARIES.Technical_Attachment,
      //       folderName,
      //       DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
      //     );
      //     console.log(isValidFolder);
      //     // Upload the file
      //     await uploadFile(
      //       webPartContext,
      //       DOCUMENT_LIBRARIES.Technical_Attachment,
      //       folderName,
      //       uploadFileItem,
      //       uploadFileItem.name,
      //       DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
      //     );
      //     // If no duplicate, add the file to the fileList directly
      //     setTechnicalOutlineFileList([...technicalOutlineFileList, file]);
      //   } catch (error) {
      //     setLoading(false);
      //     void displayjsx.showErrorMsg(
      //       `Failed to saved ${uploadFileItem.name}.`
      //     );
      //   } finally {
      //     setLoading(false);
      //   }
      // }
    }

    // Return false to prevent the default upload behavior
    return false;
  };

  const handelClose = () => {
    setTechnicalClosureFileList([]);
    setIsClosureModalVisible(true);
    // Modal.confirm({
    //   title: "Are you sure you want to close the form?",
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faCircleExclamation}
    //       style={{ marginRight: "10px", marginTop: "5px" }}
    //     />
    //   ),
    //   content: (
    //     <Form layout="vertical">
    //       <Form.Item label="Closure Document" name="closurAttachmentAdds"
    //       rules={[
    //         {
    //           required: true,
    //         },
    //       ]}
    //       >
    //         <Upload
    //           className={isViewMode ? "upload-read-only" : ""}
    //           style={{ width: "95%" }}
    //           multiple
    //           onRemove={handleClosureRemove}
    //           beforeUpload={handleClosureUpload}
    //           maxCount={5}
    //           //disabled={isViewMode}
    //           onPreview={(file) => {
    //             if (file.status == "done") {
    //               previewFile(
    //                 file,
    //                 DOCUMENT_LIBRARIES.Technical_Attachment,
    //                 `${ctiNumber}`,
    //                 DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
    //               );
    //             } else if (ctiNumber != "") {
    //               previewFile(
    //                 file,
    //                 DOCUMENT_LIBRARIES.Technical_Attachment,
    //                 `${ctiNumber}`,
    //                 DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
    //               );
    //             }
    //           }}
    //           fileList={technicalClosureFileList}
    //         >
    //           <Button icon={<UploadOutlined />}>Upload Document</Button>
    //         </Upload>
    //       </Form.Item>
    //     </Form>
    //   ),
    //   okText: "Yes",
    //   cancelText: "No",
    //   okType: "primary",
    //   okButtonProps: { className: "btn btn-primary save-btn" },
    //   cancelButtonProps: { className: "btn-outline-primary no-btn" },
    //   onOk: () => {

    //   },
    // });
  };

  const handleClosureOk = () => {
    if (
      technicalClosureFileList !== null &&
      technicalClosureFileList.length > 0
    ) {
      const data = {
        TechnicalId: existingTechniaclInstructionSlip.TechnicalId,
        userId: user?.employeeId,
        technicalClosureAttachmentAdds: technicalClosureFileList
          ? mapClosureFiles(technicalClosureFileList)
          : null,
      };
      setLoading(true);
      closeTechnical(data)
        .then((c) => {
          setLoading(false);
          if (isApproverRequest) {
            navigate("/", {
              state: {
                currentTabState: "myapproval-tab",
              },
            });
          } else {
            navigate("/");
          }
        })
        .catch((c) => {
          setLoading(false);
        });
    }
  };

  const operations = (
    <div>
      {((!isViewMode && activeKey === "1" && !submitted)
        || (!isViewMode && activeKey === "1" && user?.isAdmin))
        && ( //||
          //(currentApproverTask?.userId == user?.employeeId //&& currentApproverTask?.seqNumber != 3)
          <Form.Item
            style={{
              display: "inline-block", // Ensure inline layout
              marginRight: "10px", // Add some space between the buttons
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              //loading={loading}
              onClick={handleSave}
            >
              Save
            </Button>
          </Form.Item>
        )}

      {/* {!isViewMode && activeKey === "1" && !submitted && (
        <Form.Item
          style={{
            display: "inline-block", // Inline display for second button as well
            marginRight: "10px",
          }}
        >
          <Button
            color="default"
            variant="solid"
            //loading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      )} */}

      {((!isViewMode && activeKey === "1" && !submitted)
        || (!isViewMode && activeKey === "1" && !submitted && user?.isAdmin))
        && (
          <Form.Item
            style={{
              display: "inline-block", // Inline display for second button as well
              marginRight: "10px",
            }}
          >
            <Button
              color="default"
              variant="solid"
              //loading={loading}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form.Item>
        )}

      {!isViewMode && activeKey === "1" && underAmmendment && (
        <Form.Item
          style={{
            display: "inline-block", // Inline display for second button as well
            marginRight: "10px",
          }}
        >
          <Button
            color="primary"
            variant="solid"
            //loading={loading}
            onClick={handleReSubmit}
          >
            Resubmit
          </Button>
        </Form.Item>
      )}
      {activeKey === "1" &&
        existingTechniaclInstructionSlip?.status === REQUEST_STATUS.Completed &&
        (existingTechniaclInstructionSlip?.userId == user?.employeeId ||
          existingTechniaclInstructionSlip.sectionHead == user?.employeeId ||
          user?.isAdmin) && (
          <Form.Item
            style={{
              display: "inline-block", // Inline display for second button as well
              marginRight: "10px",
            }}
          >
            <Button
              color="primary"
              variant="solid"
              //loading={loading}
              onClick={handelClose}
            >
              Close Request
            </Button>
          </Form.Item>
        )}
      {true && (
        <WorkFlowButtons
          onApprove={handleApprove}
          onAskToAmend={handleAskToAmend}
          onPullBack={handlePullBack}
          onDelegate={handleDelegate}
          currentApproverTask={currentApproverTask}
          existingTechniaclInstructionSlip={existingTechniaclInstructionSlip}
          //isFormModified={isEditMode && isViewMode == false ? true : false}
          isFormModified={isEditMode ? true : false}
          isFromAllRequest={isFromAllRequest}
        />
      )}
    </div>
  );
  // console.log(
  //   "user:" + `${currentApproverTask?.userId} // ${user?.employeeId} // ${underAmmendment}`
  // );
  //console.log(`${isEditMode} || ${isViewMode}`);

  const handleCommentReSubmit = () => {
    if (reSubmitComment.trim()) {
      setLoading(true);
      try {
        setSubmitFormState({
          ...submitFormState,
          isSubmit: true,
          isAmendReSubmitTask: true,
        });

        form.submit();
      } catch (error) {
        console.error("Error submitting the form:", error);
      } finally {
        setLoading(false);
        setIsReCommentModalVisible(false);
      }
    }
  };

  //console.log("dscds:" + editorModel);
  return (
    <div
      style={{
        padding: "2rem",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Loader loading={loading} /> {/* Show loader */}
      <h2 className="title">TECHNICAL INSTRUCTIONS FORM</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          icon={<LeftCircleFilled />}
          className="back-button"
          type="text"
          onClick={() => {
            if (isFromAllRequest) {
              navigate("/", {
                state: {
                  currentTabState: "allrequest-tab",
                },
              });
            } else if (isApproverRequest) {
              navigate("/", {
                state: {
                  currentTabState: "myapproval-tab",
                },
              });
            } else {
              navigate("/");
            }
          }}
          style={{
            color: "#1E293B",
            fontSize: "18px",
            textDecoration: "none solid rgb(30, 41, 59)",
          }}
        >
          Back
        </Button>
      </div>
      <div className="tabs-wrapper">
        <Tabs
          activeKey={activeKey}
          onTabClick={handleTabClick} // Trigger tab load on click
          tabBarExtraContent={operations}
          tabBarGutter={50}
          className="custom-tabs"
          destroyInactiveTabPane={true}
        >
          <TabPane
            tab={
              <span
                className="my-tab-button"
                style={{
                  color: activeKey === "1" ? "#c50017" : "#8C8C8C",
                  padding: "24px 20px",
                }}
              >
                Form
              </span>
            }
            key="1"
            style={{ padding: "8px" }}
          >
            {/* Form tab content */}
            {loadedTabs.indexOf("1") !== -1 && (
              <FormTab
                form={form}
                onFinish={onFinish}
                initialData={initialData}
                isViewMode={isViewMode}
                equipments={equipments}
                handleUpload={handleUpload}
                handleRemove={handleRemove}
                ctiNumber={ctiNumber}
                fileList={fileList}
                intialFolderName={intialFolderName}
                handleOutlineUpload={handleOutlineUpload}
                technicalOutlineFileList={technicalOutlineFileList}
                handleOutlineRemove={handleOutlineRemove}
                setEditorModel={setEditorModel}
                editorModel={editorModel}
                outlineImageFiles={outlineImageFiles}
                setoutlineImageFiles={setoutlineImageFiles}
                showOtherField={showOtherField}
                setShowOtherField={setShowOtherField}
                otherEquipment={otherEquipment}
                setOtherEquipment={setOtherEquipment}
                handleChangeEquipment={handleChangeEquipment}
              />
            )}
          </TabPane>
          <TabPane
            tab={
              <span
                className="my-tab-button"
                style={{
                  color: activeKey === "2" ? "#c50017" : "#8C8C8C",
                  padding: "24px 20px",
                }}
              >
                History
              </span>
            }
            key="2"
          >
            {/* History tab content */}
            {loadedTabs.indexOf("2") !== -1 && (
              <HistoryTab technicalId={id ? id.toString() : ""} />
            )}
          </TabPane>
          <TabPane
            tab={
              <span
                className="my-tab-button"
                style={{
                  color: activeKey === "3" ? "#c50017" : "#8C8C8C",
                  padding: "24px 20px",
                }}
              >
                Workflow
              </span>
            }
            key="3"
          >
            {/* Workflow tab content */}
            {loadedTabs.indexOf("3") !== -1 && (
              <Workflow approverTasks={approveerFlowData ?? []} />
            )}
          </TabPane>

          {existingTechniaclInstructionSlip !== null &&
            existingTechniaclInstructionSlip.isClosed === true && (
              <TabPane
                tab={
                  <span
                    className="my-tab-button"
                    style={{
                      color: activeKey === "4" ? "#c50017" : "#8C8C8C",
                      padding: "24px 20px",
                    }}
                  >
                    Closure Attachments
                  </span>
                }
                key="4"
              >
                {/* Workflow tab content */}
                {loadedTabs.indexOf("4") !== -1 && (
                  //<Workflow approverTasks={approveerFlowData ?? []} />
                  <ClosureAttachment
                    isViewMode={isViewMode}
                    ctiNumber={ctiNumber}
                    existingTechniaclInstructionSlip={
                      existingTechniaclInstructionSlip
                    }
                  />
                )}
              </TabPane>
            )}
        </Tabs>
      </div>
      <>
        {/* Second Modal for selecting sections */}
        <Modal
          //title="Select Section and Section Head"
          open={isSecondModalVisible}
          onCancel={() => setIsSecondModalVisible(false)}
          width={600} //
          style={{ height: "600px", overflowY: "auto" }}
          footer={[
            <Button key="cancel" onClick={() => setIsSecondModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleFinalSubmit}
              loading={loading}
              disabled={!selectedSection} // Disable submit if no section is selected
            >
              Submit
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Select Section Head">
              <Select
                placeholder="Please select a section Head"
                value={selectedSection}
                onChange={(value: number) => setSelectedSection(value)} // Set the selected section
              >
                {sectionData.map((section) => (
                  <Option
                    key={section.sectionHeadId}
                    value={section.sectionHeadId}
                  >
                    {/* {`${section.sectionName} (Head: ${section.headName})`} */}
                    {`${section.headName} ( ${section.sectionName} )`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
      <>
        {/* Comment Modal */}
        <Modal
          //title={`Add Comment for ${actionType}`}
          open={isReCommentModalVisible}
          onCancel={() => setIsReCommentModalVisible(false)}
          onOk={handleCommentReSubmit}
          confirmLoading={loading}
          okText={"Submit"} // Dynamic okText based on action type
          cancelText={"Cancel"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Comments"
              name="reSubmitComment"
              rules={[{ required: true }]} // Validation rule
            >
              <Input.TextArea
                rows={4}
                value={reSubmitComment}
                onChange={(e) => setReSubmitComment(e.target.value)}
                placeholder="Please provide your comment"
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
      {/* Closure Modal */}
      <>
        <Modal
          title={
            <span>
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ marginRight: "10px", marginTop: "5px" }}
              />
              Are you sure you want to close the form?
            </span>
          }
          open={isClosureModalVisible}
          onOk={handleClosureOk}
          onCancel={() => setIsClosureModalVisible(false)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ className: "btn btn-primary save-btn" }}
          cancelButtonProps={{ className: "btn-outline-primary no-btn" }}
        >
          <Form layout="vertical">
            <Form.Item
              label="Closure Document"
              name="closurAttachmentAdds"
              rules={[{ required: true }]}
            >
              <Upload
                className={isViewMode ? "upload-read-only" : ""}
                multiple
                fileList={technicalClosureFileList}
                onRemove={handleClosureRemove}
                beforeUpload={handleClosureUpload}
                maxCount={5}
                onPreview={(file) => {
                  const folderName =
                    file.status === "done" ? ctiNumber : ctiNumber;
                  if (folderName) {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      folderName,
                      DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Document</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </div>
  );
};

export default TechnicalInstructionForm;
