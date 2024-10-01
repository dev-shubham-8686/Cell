import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import * as React from "react";
import * as dayjs from "dayjs";
import { disabledDate } from "../../../utils/helper";
import { useLocation } from "react-router-dom";
import { MESSAGES } from "../../../GLOBAL_CONSTANT";
import ChangeRiskManagementForm from "./ChangeRiskManagementForm";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

// interface RiskManagementField {
//   changes: string;
//   function: string;
//   risks: string;
//   causes: string;
//   measures: string;
//   dueDate: dayjs.Dayjs | null; // or Date depending on how you're handling dates
//   personInCharge: string;
//   results: string;
// }

interface AdjustmentRequestFormProps {
  onFinish: (values: any) => void;
}

const AdjustmentRequestForm = React.forwardRef(
  (props: AdjustmentRequestFormProps, ref) => {
    const location = useLocation();

    const { requestNo } = location.state;

    const { onFinish } = props;
    // const [form] = Form.useForm();

    const onSaveFormHandler = (showPopUp: boolean) => {
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
          okButtonProps: { className: "modal-ok-button" },
          onOk: async () => {
            console.log("Saving Data");
            // await saveData();
          },
          onCancel() {
            console.log("Cancel submission");
          },
        });
      }
    };

    React.useImperativeHandle(ref, () => ({
      submitForm() {
        console.log("Submit form method called");
        onSaveFormHandler(true);
      },
    }));

    const currentDateTime = dayjs();

    return (
      <div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dateTime: currentDateTime,
            reportNo: requestNo || null,
          }}
        >
          <Row gutter={16}>
            {/* Area */}
            <Col span={8}>
              <Form.Item label="Area" name="area" rules={[{ required: true }]}>
                <Select placeholder="Select Area">
                  <Option value="area1">Area 1</Option>
                  <Option value="area2">Area 2</Option>
                  <Option value="area3">Area 3</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Machine Name */}
            <Col span={8}>
              <Form.Item
                label="Machine Name"
                name="machineName"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Machine Name">
                  <Option value="machine1">Machine 1</Option>
                  <Option value="machine2">Machine 2</Option>
                  <Option value="machine3">Machine 3</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              {/* Sub-Machine Name */}
              <Form.Item
                label="Sub-Machine Name"
                name="subMachineName"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Sub-Machine Name">
                  <Option value="subMachine1">Sub-Machine 1</Option>
                  <Option value="subMachine2">Sub-Machine 2</Option>
                  <Option value="subMachine3">Sub-Machine 3</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              {/* Report No */}
              <Form.Item label="Report No" name="reportNo">
                <Input placeholder="Enter Report No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* Requested By */}
              <Form.Item label="Requested By" name="requestedBy">
                <Input placeholder="Enter Your Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              {/* Checked By */}
              <Form.Item label="Checked By" name="checkedBy">
                <Select placeholder="Select Checked By">
                  <Option value="checkedBy1">Checked By 1</Option>
                  <Option value="checkedBy2">Checked By 2</Option>
                  <Option value="checkedBy3">Checked By 3</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              {/* Date & Time */}
              <Form.Item
                label="When"
                name="dateTime"
                rules={[{ required: true, message: "Please Select Date" }]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  showTime
                  placeholder="Date & Time"
                  format="YYYY-MM-DD HH:mm:ss"
                  className="bg-antdDisabledBg border-antdDisabledBorder w-full"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              {/* Checked By */}
              <Form.Item label="Person In Charge" name="personInCharge">
                <Select placeholder="Select Person in Charge">
                  <Option value="john">John</Option>
                  <Option value="mike">Mike</Option>
                  <Option value="matt">Matt</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {/* Describe Problem */}
              <Form.Item label="Describe Problem" name="describeProblem">
                <TextArea
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the problem"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* Observation */}
              <Form.Item label="Observation" name="observation">
                <TextArea
                  rows={4}
                  maxLength={2000}
                  placeholder="Enter your observation"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {/* Root Cause */}
              <Form.Item label="Root Cause" name="rootCause">
                <TextArea
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the root cause"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* Adjustment Description */}
              <Form.Item
                label="Adjustment Description"
                name="adjustmentDescription"
              >
                <TextArea
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the adjustment made"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {/* Photos */}
              <Form.Item label="Photos" name="photos">
                <Upload
                  beforeUpload={() => false} // Prevent automatic upload
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload Photos</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* Condition After Adjustment */}
              <Form.Item
                label="Condition After Adjustment"
                name="conditionAfterAdjustment"
              >
                <TextArea
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the condition after adjustment"
                />
              </Form.Item>
            </Col>
          </Row>

          <ChangeRiskManagementForm />
          <div className="flex justify-end items-center mb-3">
            <div className="flex items-center gap-x-4">
              <Button
                // onClick={() => {
                //   showModal();
                // }}
                type="primary"
              >
                Add Change Risk Management
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
);

export default AdjustmentRequestForm;
