import { ConfigProvider, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { DatePicker, Input, Button, Upload, Form } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../GLOBAL_CONSTANT";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ColumnsType } from "antd/es/table";
import { IAttachments, IChangeRiskData, IEquipmentImprovementReport } from "../../interface";

const { TextArea } = Input;





interface ICreateEditEquipmentReportProps {
  existingEquipmentReport?: IEquipmentImprovementReport;
  mode?: string;
}

const EquipmentReportForm :React.FC<
ICreateEditEquipmentReportProps
>= ({existingEquipmentReport}) => {
  dayjs.extend(customParseFormat);

  const navigate = useNavigate();
  const { confirm } = Modal;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<IEquipmentImprovementReport| []>([]);
  const [changeRiskData, setchangeRiskData] = useState<IChangeRiskData[]>([]);


  const onSubmitFormHandler = async (): Promise<void> => {
    console.log("form submission", formValues);
  };

  const onSaveAsDraftHandler = async (): Promise<void> => {
    confirm({
      title: (
        <p className="text-black-50_e8274897">
          Only the completed sections will be saved as draft. Do you want to proceed?
        </p>
      ),
      icon: <i className="fa-solid fa-circle-exclamation" />,
      onOk() {
        console.log("form saved as draft");
        navigate("/");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
    currentSituation: [{ required: true, message: "Please enter current situation" }],
    improvement: [{ required: true, message: "Please enter improvement" }],
    attachment: [{ required: true, message: "Please upload attachment" }],
  };

  const onBackClick = (): void => {
    confirm({
      title: (
        <p className="text-black-50_e8274897">
          Only the completed sections will be saved as draft. Do you want to proceed?
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
    debugger
    form.setFieldsValue({
      changeRiskData: existingEquipmentReport?.ChangeRiskManagementDetails??changeRiskData,
    });
    form.setFieldsValue(existingEquipmentReport)

  }, [changeRiskData,existingEquipmentReport]);
  const handleAdd = (): void => {
    
    const newData: IChangeRiskData[] = [
      ...changeRiskData,
      {
        key: changeRiskData?.length,
        changes: "",
        functionId: 0,
        riskAssociated: "",
        factor:"",
        counterMeasures:"",
        dueDate:"",
        personInCharge:"",
        results:""
      },
    ];
    setchangeRiskData(newData);
    console.log("after adding change req data",changeRiskData, newData);
  };

  const handleDelete = (key: React.Key): void => {
 
    const newData = changeRiskData
      .filter((item) => item.key !== key)
      .map((item, index) => {
        return {
          ...item,
          key: index,
        };
      });
    console.log("after deleting", changeRiskData, newData);
    setchangeRiskData(newData);
    // form.resetFields();
    form.setFieldsValue({
      ["changeRiskData"]: newData,
    });
  };

  const onChangeTableData = (
    key: number,
    updateField: string,
    value: string | number | string[] | boolean
  ): void => {
    
    const newData = changeRiskData.map((item: IChangeRiskData) => {
      if (item.key == key) {
        item[updateField] = value;
      }
      return item;
    });
    setchangeRiskData(newData);
    console.log("Uppdated Change risk", changeRiskData,  newData);
  };

  console.log("Latest Change risk data",changeRiskData)
  const nestedTableColumns: ColumnsType<any> = [
    {
      title: "Changes",
      dataIndex: "changes",
      key: "changes",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "changes"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "changes"]) ??
              record.employeeId
            }
            rules={validationRules["changes"]}
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
      dataIndex: "functionId ",
      key: "functionId ", 
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "functionId "]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "functionId "]) ??
              record.employeeId
            }
            rules={validationRules["function"]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              style={{ width: "100%" }}
              placeholder="Select function"
              onChange={(value) => {
                onChangeTableData(record.key, "functionId", value);
              }}
              filterOption={(input, option) =>
                option?.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
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
      width: "30%",
      sorter: false,
    },
    {
      title: "Risk Associated with Changes",
      dataIndex: "riskAssociated ",
      key: "riskAssociated ",
      render: (_, record) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "riskAssociated"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "riskAssociated"]) ??
              record.comment
            }
            style={{ margin: 0 }}
          >
            <TextArea
              maxLength={500}
              placeholder="Enter risks"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "riskAssociated", e.target.value);
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
      dataIndex: "factor",
      key: "factor",
      render: (_, record) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "factor"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "factor"]) ??
              record.comment
            }
            style={{ margin: 0 }}
          >
            <TextArea
              maxLength={500}
              placeholder="Add Factor"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "factor", e.target.value);
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
      dataIndex: "counterMeasures",
      key: "counterMeasures",
      render: (_, record) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "counterMeasures"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "counterMeasures"]) ??
              record.comment
            }
            style={{ margin: 0 }}
          >
            <TextArea
              maxLength={500}
              placeholder="Add Counter Measures"
              rows={2}
              onChange={(e) => {
                onChangeTableData(record.key, "counterMeasures", e.target.value);
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
      dataIndex: "personInCharge",
      key: "personInCharge",
      render: (_, record, index) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "personInCharge"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "personInCharge"]) ??
              record.employeeId
            }
            rules={validationRules["personInCharge"]}
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
                option?.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
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
      dataIndex: "results",
      key: "results",
      render: (_, record) => {
        return (
          <Form.Item
            name={["changeRiskData", record.key, "results"]}
            initialValue={
              form.getFieldValue(["changeRiskData", record.key, "results"]) ??
              record.comment
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
              onClick={() => handleDelete(record.key)}
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
      <div className="bg-white p-5">
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
          {console.log("Form Data",existingEquipmentReport)}
          <Form layout="vertical" form={form} initialValues={existingEquipmentReport}>
            <div className="row ">
              <div className="col">
                <Form.Item
                  label={
                    <label className="text-muted mb-0 w-95">Application No.</label>
                  }
                  name="applicationNo"
                  rules={validationRules["applicationNo"]}
                >
                  <Input disabled maxLength={100} />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0 w-95">When Date</label>}
                  name="whenDate"
                  rules={validationRules["whenDate"]}
                >
                  <DatePicker className="w-100" disabled />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<span className="text-muted w-95">Device Name</span>}
                  name="deviceName"
                  rules={validationRules["deviceName"]}
                >
                  <Select>
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
                  label={<span className="text-muted w-95">Purpose</span>}
                  name="purpose"
                  rules={validationRules.attachment}
                >
                  <TextArea maxLength={500} rows={1} />
                </Form.Item>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Current Situation</span>}
                  name="currentSituation"
                  rules={validationRules.attachment}
                >
                  <TextArea className="w-95" maxLength={500} rows={3} />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<span className="text-muted">Improvement</span>}
                  name="improvement"
                  rules={validationRules.attachment}
                >
                  <TextArea  maxLength={500} rows={3} />
                </Form.Item>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted">
                      Current Situation Attachments
                    </span>
                  }
                  name="currentSituationAttachment"
                  rules={validationRules.attachment}
                >
                  <Upload>
                    {" "}
                    <Button icon={<UploadOutlined />}>Attach Document</Button>
                  </Upload>
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={
                    <span className="text-muted">Improvement Attachments</span>
                  }
                  name="improvementAttachment"
                  rules={validationRules.attachment}
                >
                  <Upload>
                    {" "}
                    <Button icon={<UploadOutlined />}>Attach Document</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between my-3">
                <p className="text-muted mb-0">Change Risk Management</p>
                {true && (
                  <button className="btn btn-primary" type="button"  onClick={handleAdd}>
                    <i className="fa-solid fa-circle-plus" /> Add
                  </button>
                )}
              </div>
              <Table
                className="hotel-details-table"
                dataSource={changeRiskData}
                columns={nestedTableColumns}
                scroll={{ x: "max-content" }}
              />
            </div>

            <div className="row mt-4">
              <div className="col">
                <Form.Item
                  label={<span className="text-muted">PCRN Attachments</span>}
                  name="pcrnAttachment"
                  rules={validationRules.attachment}
                >
                  <Upload className="w-100">
                    {" "}
                    <Button icon={<UploadOutlined />}>Attach Document</Button>
                  </Upload>
                </Form.Item>
              </div>
              
              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0">Target Date</label>}
                  name="targetDate "
                  rules={validationRules["targetDate"]}
                >
                  <DatePicker className="w-100" disabled />
                </Form.Item>
              </div>

              <div className="col">
                <Form.Item
                  label={<label className="text-muted mb-0">Actual Date</label>}
                  name="actualDate"
                  rules={validationRules["actualDate"]}
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
                  <TextArea className="w-100" />
                </Form.Item>
              </div>
            </div>

          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default EquipmentReportForm;
