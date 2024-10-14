import { ConfigProvider, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
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
import useDeviceMaster from "../../apis/masters/useDeviceMaster";
import useSubDeviceMaster from "../../apis/masters/useSubDeviceMaster";
import useSectionMaster from "../../apis/masters/useSectionMaster";
import useFunctionMaster from "../../apis/masters/useFunctionMaster";
import FileUpload from "../fileUpload/FileUpload";
import { renameFolder } from "../../utility/utility";
import { WebPartContext } from "../../context/webpartContext";

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
  const [ChangeRiskManagementDetails, setChangeRiskManagementDetails] =
    useState<IChangeRiskData[]>([]);
  const eqReportSave = useCreateEditEQReport();
  const { data: devices, isLoading: deviceIsLoading } = useDeviceMaster();
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
  // const { data: employees, isLoading: employeeisLoading } = useEmployeeMaster();

  const onSubmitFormHandler = async (): Promise<void> => {
    console.log("form submission", formValues);
    const values = form.getFieldsValue();
    values.When = dayjs().format("YYYY-MM-DD");
    eqReportSave.mutate(values);
  };

  const onSaveAsDraftHandler = async (): Promise<void> => {
    const values: IEquipmentImprovementReport = form.getFieldsValue();
    values.EquipmentImprovementAttachmentDetails = improvementAttchments;
    values.EquipmentCurrSituationAttachmentDetails = currSituationAttchments;
    console.log("form saved as draft data", values);
    if (id) {
      values.EquipmentImprovementId = parseInt(id);
    }
    console.log("values", values);
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

  const handleChange = (changedValues: { [key: string]: any }) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...changedValues,
    }));
  };

  const validationRules = {
    when: [{ required: true, message: "Please enter when" }],
    deviceName: [{ required: true, message: "Please enter device name" }],
    purpose: [{ required: true, message: "Please enter purpose" }],
    currentSituation: [
      { required: true, message: "Please enter current situation" },
    ],
    improvement: [{ required: true, message: "Please enter improvement" }],
    attachment: [{ required: true, message: "Please upload attachment" }],
  };

  const onBackClick = (): void => {
    confirm({
      title: (
        <p className="text-black-50_e8274897">
          Only the completed sections will be saved as draft. Do you want to
          proceed?
        </p>
      ),
      icon: <i className="fa-solid fa-circle-exclamation" />,
      onOk() {
        console.log("back button clicked");
        navigate("/");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    // form.setFieldsValue({
    //   ChangeRiskManagementDetails: existingEquipmentReport?.ChangeRiskManagementDetails??ChangeRiskManagementDetails,
    // });
    debugger;
    if (existingEquipmentReport) {
      debugger;
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
      debugger;
        setselectedMachine(parseInt(existingEquipmentReport?.MachineName??"0"))
      setChangeRiskManagementDetails(changeRiskData);
      console.log(
        "CHangeRisk data ",
        existingEquipmentReport?.ChangeRiskManagementDetails,
        changeRiskData
      );
    }
    debugger;
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
    debugger;
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
            rules={validationRules["Changes"]}
          >
            <Input
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
            rules={validationRules["FunctionId"]}
          >
            <Select
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
          >
            <TextArea
              maxLength={500}
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
          >
            <TextArea
              maxLength={500}
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
          >
            <TextArea
              maxLength={500}
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
            rules={[
              {
                required: true,
                message: "Please select a valid due date",
              },
            ]}
          >
            <DatePicker
             
              onChange={(date, dateString)=> {
                onChangeTableData(
                  record.key,
                  "DueDate",
                  dateString
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
            rules={validationRules["PersonInCharge"]}
          >
            <Select
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
              options={devices?.map((device) => ({
                label: device.deviceName,
                value: device.deviceId,
              }))}
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
          >
            <TextArea
              maxLength={500}
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
                debugger;
                handleDelete(record.key);
                debugger;
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
      <div className="bg-white">
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
              debugger;
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
                  rules={validationRules["When"]}
                >
                  <Input
                    className="w-100"
                    disabled
                    value={
                      existingEquipmentReport?.When 
                      ? dayjs(existingEquipmentReport.When)
                      .format(DATE_FORMAT)
                      : dayjs().format(DATE_FORMAT)
                    }
                  />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Area</span>}
                  // name="Area"
                  rules={validationRules.attachment}
                >
                  <TextArea maxLength={500} rows={1} />
                </Form.Item>
              </div>
              </div>
              <div className="row ">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Section Name</span>}
                  name="SectionId"
                  rules={validationRules["SectionId"]}
                >
                  <Select
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
                  rules={validationRules["MachineName"]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={devices?.map((device) => ({
                      label: device.deviceName,
                      value: device.deviceId,
                    }))}
                    onChange={(value) => {
                      setselectedMachine(value);
                      form.setFieldsValue({
                        SubMachineName: [],
                      });
                    }}
                    loading={deviceIsLoading}
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
              {console.log("selectedmachine", selectedMachine)}{" "}
              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted w-95">Sub Machine Name</span>
                  }
                  name="SubMachineName"
                  rules={validationRules["SubMachineName"]}
                >
                  <Select
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
                            submachine.deviceId === selectedMachine
                        )
                        ?.map((subdevice) => ({
                          label: subdevice.subDeviceName,
                          value: subdevice.subDeviceId,
                        })) || []
                    }
                    loading={subDeviceIsLoading}
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
            
            </div>

            <div className="row mb-3">
            <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Purpose</span>}
                  name="Purpose"
                  rules={validationRules.attachment}
                >
                  <TextArea maxLength={500} rows={3} />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Current Situation</span>}
                  name="CurrentSituation"
                  rules={validationRules.attachment}
                >
                  <TextArea  maxLength={500} rows={3} />
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
                  rules={validationRules.attachment}
                >
                  {/* <Upload>
                    {" "}
                    <Button icon={<UploadOutlined />}>Attach Document</Button>
                  </Upload> */}
                  <FileUpload
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
                      debugger;
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
                      debugger;
                      const updatedAttachments: ICurrentSituationAttachments[] =
                        [...existingAttachments, newAttachment];
                      debugger;
                      setcurrSituationAttchments(updatedAttachments);
                      debugger;
                      console.log("File Added");
                    }}
                    onRemoveFile={(documentName: string) => {
                      debugger;
                      const existingAttachments = currSituationAttchments ?? [];
                      debugger;
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
                  label={<span className="text-muted">Improvement Name</span>}
                  name="ImprovementName"
                  rules={validationRules.attachment}
                >
                  <TextArea maxLength={500} rows={3} />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Improvement Description</span>}
                  name="Improvement"
                  rules={validationRules.attachment}
                >
                  <TextArea maxLength={500} rows={3} />
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
                  rules={validationRules.attachment}
                >
                  <FileUpload
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
                      debugger;
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
                      debugger;
                      const updatedAttachments: IImprovementAttachments[] = [
                        ...existingAttachments,
                        newAttachment,
                      ];
                      debugger;
                      setImprovementAttchments(updatedAttachments);
                      debugger;
                      console.log("File Added");
                    }}
                    onRemoveFile={(documentName: string) => {
                      debugger;
                      const existingAttachments = improvementAttchments ?? [];
                      debugger;
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

            <hr style={{ border: "1px solid black" }} />
            <div>
              <div className="d-flex justify-content-between my-3">
                <p className=" mb-0" style={{fontSize:"20px",color:"#C50017"}}>Change Risk Management</p>
                {true && (
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
                className="change-risk-table"
                dataSource={ChangeRiskManagementDetails}
                columns={nestedTableColumns}
                scroll={{ x: "max-content" }}
              />
            </div>

            <div className="row">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">PCRN Attachments</span>}
                  name="pcrnAttachment"
                  rules={validationRules.attachment}
                >
                  <FileUpload
                    key={`file-upload-pcrn`}
                    folderName={"foldername"}
                    libraryName={"lbname"}
                    files={form.getFieldValue("pcrnAttachment")?.map((a) => ({
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
              <hr style={{ border: "1px solid black" }} />
              <div>
              <p className=" mb-0" style={{fontSize:"20px",color:"#C50017"}}>Result Section</p>
              <div className="row mt-3">
              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0">Target Date</label>}
                  name="TargetDate "
                  rules={validationRules["TargetDate"]}
                >
                  <DatePicker className="w-100" disabled />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0">Actual Date</label>}
                  name="ActualDate"
                  rules={validationRules["ActualDate"]}
                >
                  <DatePicker className="w-100" disabled />
                </Form.Item>
              </div>
               
              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0">Result Date</label>}
                  // name="ResultDate "
                  rules={validationRules["TargetDate"]}
                >
                  <DatePicker className="w-100" disabled />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={
                    <label className="text-muted mb-0">Result Status</label>
                  }
                  name="resultStatus"
                  rules={validationRules["resultStatus"]}
                >
                  <TextArea className="w-100" cols={1}/>
                </Form.Item>
              </div>
              </div>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default EquipmentReportForm;
