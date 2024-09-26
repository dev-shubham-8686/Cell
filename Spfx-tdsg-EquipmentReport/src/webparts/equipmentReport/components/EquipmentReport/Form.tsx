import { ConfigProvider, Modal, message } from "antd";
import React, { useState } from "react";
import { DatePicker, Input, Button, Upload, Form } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../GLOBAL_CONSTANT";

const { TextArea } = Input;

interface IEquipmentImprovementReportDetails {
  when: string;
  deviceName: string;
  purpose: string;
  currentSituation: string;
  improvement: string;
  attachment: File;
}

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
      await message.success(`${info.file.name} file uploaded successfully.`);
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

interface ICreateEditMaterialConsumptionSlip {
  existingMaterialConsumptionSlip?: any;
  mode?: string;
}

const EquipmentReportForm :React.FC<
any
>= ({equipmentReport}) => {
  dayjs.extend(customParseFormat);

  const navigate = useNavigate();
  const { confirm } = Modal;

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<IEquipmentImprovementReportDetails>({
    when: dayjs().format(DATE_TIME_FORMAT), // date default today's
    deviceName: "", // textbox
    purpose: "", // textarea
    currentSituation: "", // textarea
    improvement: "", // textarea
    attachment: null, // document upload
  });

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
          <Form
            form={form}
            layout="vertical"
            className="fw-semibold fs-16px"
            onFinish={onSubmitFormHandler}
            onValuesChange={handleChange}
            initialValues={formValues}
          >
            <div className="row">
              <div className="col">
                <div>
                  <label>Application No.</label>
                  <div className="pt-2">
                    <Input
                      className="w-90"
                      disabled
                      value={equipmentReport?.applicationNo ?? "-"}
                    />
                  </div>
                </div>
              </div>
              <div className="col">
                <div>
                  <label>When Date</label>
                  <div className="pt-2">
                    <Input
                      className="w-90"
                      disabled
                      value={
                        equipmentReport ? equipmentReport.createdDate : "-"
                        // : format(new Date(), DATE_FORMAT)
                      }
                    />
                  </div>
                </div>
              </div>
              
            </div>
            <div>
              <div className="row align-items-center"></div>
              <div className="row">
                {/* First column */}
                <div className="col-sm">
                  <Form.Item
                    label={
                      <span style={{ color: "#898989" }}>Device Name</span>
                    }
                    name="deviceName"
                    rules={validationRules["deviceName"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={<span style={{ color: "#898989" }}>Purpose</span>}
                    name="purpose"
                    rules={validationRules["purpose"]}
                  >
                    <TextArea rows={9} />
                  </Form.Item>
                </div>
                {/* Second column */}
                <div className="col-sm">
                  <Form.Item
                    label={
                      <span style={{ color: "#898989" }}>
                        Current Situation
                      </span>
                    }
                    name="currentSituation"
                    rules={validationRules["currentSituation"]}
                  >
                    <TextArea rows={5} />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span style={{ color: "#898989" }}>Improvement</span>
                    }
                    name="improvement"
                    rules={validationRules["improvement"]}
                  >
                    <TextArea rows={5} />
                  </Form.Item>
                </div>
                {/* Third column */}
                <div className="col-sm">
                  {/* Dragger form item */}
                  <Form.Item
                    label={<span style={{ color: "#898989" }}>Attachment</span>}
                    name="attachment"
                    rules={validationRules["attachment"]}
                    className="w-40"
                  >
                    <Upload.Dragger {...DraggerProps}>
                      <p style={{ fontSize: "34px" }}>
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Drag & Drop your Files here
                      </p>
                      <p
                        style={{
                          marginTop: "10px",
                          color: "#ff4d4f",
                          fontSize: "14px",
                        }}
                      >
                        Maximum 10 files allowed.
                      </p>
                    </Upload.Dragger>
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
export { IEquipmentImprovementReportDetails };
