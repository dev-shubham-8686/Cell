import { ConfigProvider, Empty, Modal, Select, Table, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { DatePicker, Input, Button, Upload, Form } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DocumentLibraries,
  WEB_URL,
} from "../../GLOBAL_CONSTANT";
import { ColumnsType } from "antd/es/table";
import {
  IChangeRiskData,
  ICurrentSituationAttachments,
  IEquipmentImprovementReport,
  IImprovementAttachments,
} from "../../interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCreateEditEQReport from "../../apis/equipmentReport/useCreateEditEQReport/useCreateEditEQReport";
import useDeviceMaster from "../../apis/masters/useMachineMaster";
import useSubDeviceMaster from "../../apis/masters/useSubMachineMaster";
import useSectionMaster from "../../apis/masters/useSectionMaster";
import useFunctionMaster from "../../apis/masters/useFunctionMaster";
import FileUpload from "../fileUpload/FileUpload";
import { renameFolder } from "../../utility/utility";
import { WebPartContext } from "../../context/webpartContext";
import OptionalReviewModal from "../common/OptionalReviewModal";
import useAreaMaster from "../../apis/masters/useAreaMaster";
import SubmitModal from "../common/SubmitModal";
import { UserContext } from "../../context/userContext";

const { TextArea } = Input;

interface ICreateEditEquipmentReportProps {
  existingEquipmentReport?: IEquipmentImprovementReport;
  mode?: string;
}

const EquipmentReportForm: React.FC<ICreateEditEquipmentReportProps> = ({
  existingEquipmentReport,
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
  const user = useContext(UserContext);
  const isModeView = mode === "view" ? true : false;
  const [ChangeRiskManagementDetails, setChangeRiskManagementDetails] =
    useState<IChangeRiskData[]>([]);
  const eqReportSave = useCreateEditEQReport();
  const { data: machines, isLoading: deviceIsLoading } = useDeviceMaster();
  const { data: areas, isLoading: areaIsLoading } = useAreaMaster();
  const { data: subDevices, isLoading: subDeviceIsLoading } =
    useSubDeviceMaster();
  const { data: sections, isLoading: sectionIsLoading } = useSectionMaster();
  const { data: functions, isLoading: functionIsLoading } = useFunctionMaster();
  const [improvementAttchments, setImprovementAttchments] = useState<
    IImprovementAttachments[] | []
  >([]);
  const [currSituationAttchments, setcurrSituationAttchments] = useState<
    ICurrentSituationAttachments[] | []
  >([]);
  const [selectedMachine, setselectedMachine] = useState<number | 0>(0);
  const [showSubmitModal, setshowSubmitModal] = useState<boolean>(false);

  // const { data: employees, isLoading: employeeisLoading } = useEmployeeMaster();

  const onSubmitFormHandler = async (): Promise<void> => {
      setshowSubmitModal(true)
  };

  const handleModalSubmit = (sectionHead: string) => {
    const values:IEquipmentImprovementReport = form.getFieldsValue();
    values.SectionHeadId = parseInt(sectionHead);
    values.IsSubmit=true; // Set the sectionHead value in the form values
    console.log("DropDownValues",sectionHead)
    console.log("Final form values with secHead:", values);
      values.EquipmentImprovementId = parseInt(id);
      values.CreatedBy=user.employeeId;

    // Call the submit API here
    eqReportSave.mutate({...values},{
      onSuccess: (Response: any) => {
        console.log("ONSUBMIT RES", Response);
        navigate(`/equipment-improvement-report`);
      },
      onError: (error) => {
        console.error("On submit error:", error);
      },
    });
  };

  const onSaveAsDraftHandler = async (): Promise<void> => {
    const values: IEquipmentImprovementReport = form.getFieldsValue();
    values.EquipmentImprovementAttachmentDetails = improvementAttchments;
    values.EquipmentCurrSituationAttachmentDetails = currSituationAttchments;
    values.IsSubmit=false;
    values.CreatedBy=user.employeeId;
    console.log("form saved as draft data", values);
    if (id) {
      values.EquipmentImprovementId = parseInt(id);
    }
    console.log("values", values);
    await form.validateFields();
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
              "EQReportDocs",
              Response.ReturnValue.EquipmentImprovementNo
            );
          }
          navigate(`/equipment-improvement-report`);
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
    SubMachine: [{ required: true, message: "Please select Sub Machine Name" }],
    ImpName: [{ required: true, message: "Please enter Improvement Name" }],
    ImpDesc: [
      { required: true, message: "Please enter Improvement Description" },
    ],
    Purpose: [{ required: true, message: "Please enter Purpose" }],
    CurrSituation: [
      { required: true, message: "Please enter Current Situation" },
    ],
    Changes: [{ required: true, message: "Please enter Changes" }],
    Function: [{ required: true, message: "Please select Function" }],
    Risks: [{ required: true, message: "Please enter Risk " }],
    Factor: [{ required: true, message: "Please enter Factor/causes" }],
    CounterMeasure: [
      { required: true, message: "Please enter Counter Measure" },
    ],
    DueDate: [{ required: true, message: "Please select Due Date" }],
    Person: [{ required: true, message: "Please select Person In Charge" }],
    Results: [{ required: true, message: "Please enter Results " }],

    attachment: [{ required: true, message: "Please upload attachment" }],
  };

 

  useEffect(() => {
    // form.setFieldsValue({
    //   ChangeRiskManagementDetails: existingEquipmentReport?.ChangeRiskManagementDetails??ChangeRiskManagementDetails,
    // });
    
    if (existingEquipmentReport) {
      
      const changeRiskData =
        existingEquipmentReport.ChangeRiskManagementDetails?.map(
          (obj, index) => {
            return {
              key: index,
              ...obj,
            };
          }
        );
      form.setFieldsValue(existingEquipmentReport);
      setImprovementAttchments(
        existingEquipmentReport?.EquipmentImprovementAttachmentDetails ?? []
      );
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
    }
    
    console.log(
      "CHangeRisk data ",
      existingEquipmentReport?.ChangeRiskManagementDetails
    );
  }, [existingEquipmentReport]);



  const handleAdd = (): void => {
    const newData: IChangeRiskData[] = [
      ...ChangeRiskManagementDetails,
      {
        key: ChangeRiskManagementDetails?.length,
        Changes: "",
        FunctionId: 0,
        RiskAssociated: "",
        Factor: "",
        CounterMeasures: "",
        DueDate: "",
        PersonInCharge: "",
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
  console.log("SubMachine", subDevices);
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
              disabled={isModeView}
              style={{ width: "100%" }}
              placeholder="Please enter Changes"
              onChange={(e) => {
                onChangeTableData(record.key, "changes", e.target.value);
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
            <Select
              disabled={isModeView}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: "100%" }}
              placeholder="Select function"
              onChange={(value) => {
                onChangeTableData(record.key, "FunctionId", value);
              }}
              options={functions?.map((fun) => ({
                label: fun.functionName,
                value: fun.functionId,
              }))}
              className="custom-disabled-select"
              loading={functionIsLoading}
            >
              {/* {employee?.map((employee) => (
                <Select.Option
                  key={employee.employeeId}
                  value={employee.employeeId}
                >
                  {employee.employeeName}
                </Select.Option>
              ))} */}
            </Select>
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
              disabled={isModeView}
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
      title: "factor/causes",
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
              disabled={isModeView}
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
              disabled={isModeView}
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
            initialValue={
              form.getFieldValue([
                "ChangeRiskManagementDetails",
                record.key,
                "DueDate",
              ]) ?? record.DueDate
            }
            rules={validationRules.DueDate}
          >
            <DatePicker
              value={
                existingEquipmentReport?.When
                  ? dayjs(
                      record.ChangeRiskManagementDetails?.DueDate,
                      DATE_TIME_FORMAT
                    ).format(DATE_FORMAT)
                  : "-"
              }
              disabled={isModeView}
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
                "personInCharge",
              ]) ?? record.employeeId
            }
            rules={validationRules.Person}
          >
            <Select
              disabled={isModeView}
              showSearch
              optionFilterProp="children"
              style={{ width: "100%" }}
              placeholder="Select Person in Charge "
              onChange={(value) => {
                onChangeTableData(record.key, "personInCharge", value);
              }}
              filterOption={(input, option) =>
                option?.label
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              // options={mac?.map((device) => ({
              //   label: device.deviceName,
              //   value: device.deviceId,
              // }))}
              className="custom-disabled-select"
            >
              {/* {employee?.map((employee) => (
                <Select.Option
                  key={employee.employeeId}
                  value={employee.employeeId}
                >
                  {employee.employeeName}
                </Select.Option>
              ))} */}
            </Select>
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
              disabled={isModeView}
              maxLength={1000}
              placeholder="Enter results"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "results", e.target.value);
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
      <div style={{ position: "absolute", right: "40px", top: "105px" }}>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={onSaveAsDraftHandler}>
            <i className="fa-solid fa-floppy-disk" />
            Save as Draft
          </button>
          <button className="btn btn-darkgrey" onClick={onSubmitFormHandler}>
            <i className="fa-solid fa-share-from-square" />
            Submit
          </button>
        </div>
      </div>
      <div className="bg-white p-4">
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
            <div className="row ">
              <div className="col">
                <Form.Item
                  label={
                    <label className="text-muted mb-0 w-95">
                      Application No.
                    </label>
                  }
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
                  // name="When"
                  rules={validationRules.When}
                >
                  <Input
                    className="w-100"
                    disabled
                    value={
                      existingEquipmentReport?.When
                        ? dayjs(
                            existingEquipmentReport.When,
                            DATE_TIME_FORMAT
                          ).format(DATE_FORMAT)
                        : "-"
                    }
                  />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Area</span>}
                  name="AreaId"
                  rules={validationRules.Area}
                >
                  <Select
                    disabled={isModeView}
                    showSearch
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
            <div className="row ">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Section Name</span>}
                  name="SectionId"
                  rules={validationRules.Section}
                >
                  <Select
                    disabled={isModeView}
                    showSearch
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
                  label={<span className="text-muted w-95">Machine Name</span>}
                  name="MachineName"
                  rules={validationRules.Machine}
                >
                  <Select
                    disabled={isModeView}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={machines?.map((machine) => ({
                      label: machine.MachineName,
                      value: machine.MachineId,
                    }))}
                    onChange={(value) => {
                      setselectedMachine(value);
                      form.setFieldsValue({
                        SubMachineName: [],
                      });
                    }}
                    loading={deviceIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>
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
                    disabled={isModeView}

                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    mode="multiple"
                    options={
                      subDevices
                        ?.filter(
                          (submachine) =>
                            submachine.MachineId === selectedMachine
                        )
                        ?.map((subdevice) => ({
                          label: subdevice.SubMachineName,
                          value: subdevice.SubMachineId,
                        })) || []
                    }
                    loading={subDeviceIsLoading}
                    className="custom-disabled-select"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Improvement Name</span>}
                  name="ImprovementName"
                  rules={validationRules.ImpName}
                >
                  <TextArea disabled={isModeView} maxLength={100} rows={3} />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Purpose</span>}
                  name="Purpose"
                  rules={validationRules.Purpose}
                >
                  <TextArea disabled={isModeView} maxLength={1000} rows={3} />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted">
                      Current Situation Attachments
                    </span>
                  }
                  name="EquipmentCurrSituationAttachmentDetails"
                  // rules={currSituationAttchments.length==0?validationRules.attachment:null}
                >
                  {/* all types except exe  ,  max size -30MB  , no-10*/}
                  <FileUpload
                  disabled={isModeView}
                    key={`file-upload-current-situation`}
                    folderName={
                      form.getFieldValue("EquipmentImprovementNo") ??
                      "EQReportDocs"
                    }
                    subFolderName={"Current Situation Attachments"}
                    libraryName={DocumentLibraries.EQ_Report}
                    files={currSituationAttchments?.map((a) => ({
                      ...a,
                      uid:
                        a.EquipmentCurrSituationAttachmentId?.toString() ?? "",
                      name: a.CurrSituationDocName,
                      url: `${a.CurrSituationDocFilePath}`,
                    }))}
                    setIsLoading={(loading: boolean) => {
                      // setIsLoading(loading);
                    }}
                    isLoading={false}
                    onAddFile={(name: string, url: string) => {
                      
                      const existingAttachments = currSituationAttchments ?? [];
                      console.log("FILES", existingAttachments);
                      const newAttachment: ICurrentSituationAttachments = {
                        EquipmentCurrSituationAttachmentId: 0,
                        EquipmentImprovementId: parseInt(id),
                        CurrSituationDocName: name,
                        CurrSituationDocFilePath: url,
                        CreatedBy: 76,
                        ModifiedBy: 76,
                      };
                      
                      const updatedAttachments: ICurrentSituationAttachments[] =
                        [...existingAttachments, newAttachment];
                      
                      setcurrSituationAttchments(updatedAttachments);
                      
                      console.log("File Added");
                    }}
                    onRemoveFile={(documentName: string) => {
                      
                      const existingAttachments = currSituationAttchments ?? [];
                      
                      const updatedAttachments = existingAttachments?.filter(
                        (doc) => doc.CurrSituationDocName !== documentName
                      );
                      setcurrSituationAttchments(updatedAttachments);
                      console.log("File Removed");
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Current Situation</span>}
                  name="CurrentSituation"
                  rules={validationRules.CurrSituation}
                >
                  <TextArea disabled={isModeView} maxLength={1000} rows={3} />
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
                  <TextArea disabled={isModeView} maxLength={1000} rows={3} />
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
                    <span className="text-muted">Improvement Attachments</span>
                  }
                  name="EquipmentImprovementAttachmentDetails"
                  // rules={improvementAttchments.length==0?validationRules.attachment:null}
                >
                  {/* all types except exe  ,  max size -30MB  , no-10*/}
                  <FileUpload
                    disabled={isModeView}
                    key={`file-upload-improvement`}
                    folderName={
                      form.getFieldValue("EquipmentImprovementNo") ??
                      "EQReportDocs"
                    }
                    subFolderName={"Improvement Attachments"}
                    libraryName={DocumentLibraries.EQ_Report}
                    files={improvementAttchments?.map((a) => ({
                      ...a,
                      uid: a.EquipmentImprovementAttachmentId?.toString() ?? "",
                      name: a.ImprovementDocName,
                      url: `${a.ImprovementDocFilePath}`,
                    }))}
                    setIsLoading={(loading: boolean) => {
                      // setIsLoading(loading);
                    }}
                    isLoading={false}
                    onAddFile={(name: string, url: string) => {
                      
                      const existingAttachments = improvementAttchments ?? [];
                      console.log("FILES", existingAttachments);
                      const newAttachment: IImprovementAttachments = {
                        EquipmentImprovementAttachmentId: 0,
                        EquipmentImprovementId: parseInt(id),
                        ImprovementDocName: name,
                        ImprovementDocFilePath: url,
                        CreatedBy: 76,
                        ModifiedBy: 76,
                      };
                      
                      const updatedAttachments: IImprovementAttachments[] = [
                        ...existingAttachments,
                        newAttachment,
                      ];
                      
                      setImprovementAttchments(updatedAttachments);
                      
                      console.log("File Added");
                    }}
                    onRemoveFile={(documentName: string) => {
                      
                      const existingAttachments = improvementAttchments ?? [];
                      
                      const updatedAttachments = existingAttachments?.filter(
                        (doc) => doc.ImprovementDocName !== documentName
                      );
                      setImprovementAttchments(updatedAttachments);
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
                {true && (
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
            {false && (
              <>
                <div className="row">
                  <div className="col mt-3">
                    <Form.Item
                      label={
                        <span className="text-muted">PCRN Attachments</span>
                      }
                      name="pcrnAttachment"
                      // rules={validationRules.attachment}
                    >
                      <FileUpload
                        key={`file-upload-pcrn`}
                        folderName={"foldername"}
                        libraryName={"lbname"}
                        files={form
                          .getFieldValue("pcrnAttachment")
                          ?.map((a) => ({
                            ...a,
                            uid: a.PCRNId?.toString() ?? "",
                            url: `${a.url}`,
                          }))}
                        setIsLoading={(loading: boolean) => {
                          // setIsLoading(loading);
                        }}
                        isLoading={false}
                        onAddFile={(name: string, url: string) => {
                          console.log("File Added");
                        }}
                        onRemoveFile={(documentName: string) => {
                          console.log("File Removed");
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <p
                    className="mt-3"
                    style={{ fontSize: "20px", color: "#C50017" }}
                  >
                    Result Section
                  </p>
                  <div className="row mt-3">
                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">Target Date</label>
                        }
                        name="TargetDate "
                        rules={validationRules["TargetDate"]}
                      >
                        <DatePicker disabled={isModeView} className="w-100" />
                      </Form.Item>
                    </div>

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">Actual Date</label>
                        }
                        name="ActualDate"
                        rules={validationRules["ActualDate"]}
                      >
                        <DatePicker disabled={isModeView} className="w-100" />
                      </Form.Item>
                    </div>

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">
                            Result Monitoring Till Date
                          </label>
                        }
                        // name="ResultDate "
                        rules={validationRules["TargetDate"]}
                      >
                        <DatePicker disabled={isModeView} className="w-100" />
                      </Form.Item>
                    </div>

                    <div className="col">
                      <Form.Item
                        label={
                          <label className="text-muted mb-0">
                            Result Status
                          </label>
                        }
                        name="resultStatus"
                        rules={validationRules["resultStatus"]}
                      >
                        <TextArea
                          disabled={isModeView}
                          className="w-100"
                          rows={1}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        </ConfigProvider>
      </div>
      <SubmitModal
  visible={showSubmitModal}
  setmodalVisible={setshowSubmitModal}
  onSubmit={handleModalSubmit} // Pass the callback function to modal
/>
    </div>
  );
};

export default EquipmentReportForm;
