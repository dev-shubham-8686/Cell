import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import * as React from "react";
import * as dayjs from "dayjs";
import { disabledDate } from "../../../utils/helper";
// import { useLocation } from "react-router-dom";
import { MESSAGES } from "../../../GLOBAL_CONSTANT";
import ChangeRiskManagementForm from "./ChangeRiskManagementForm";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface AdjustmentRequestFormProps {
  onFinish: (values: any) => void;
}

const AdjustmentRequestForm = React.forwardRef(
  (props: AdjustmentRequestFormProps, ref) => {
    // const location = useLocation();

    // const { requestNo } = location.state;

    const { onFinish } = props;

    const [formSections, setFormSections] = React.useState<number[]>([0]); // Initially, one form section
    const [selectedValue, setSelectedValue] = React.useState<string | null>(
      null
    );

    const handleChange = (e: any) => {
      setSelectedValue(e.target.value);
    };

    // Function to add a new form section
    const addFormSection = () => {
      setFormSections((prevSections) => [...prevSections, prevSections.length]);
    };

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
      <div className="py-3 adj-form">
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dateTime: currentDateTime,
            reportNo: "",
          }}
        >
          <Row gutter={48}>
            <Col span={6}>
              {/* Report No */}
              <Form.Item label="Report No" name="reportNo">
                <Input placeholder="Enter Report No" />
              </Form.Item>
            </Col>

            <Col span={6}>
              {/* Requested By */}
              <Form.Item label="Requested By" name="requestedBy">
                <Input placeholder="Enter Your Name" />
              </Form.Item>
            </Col>

            <Col span={6}>
              {/* Checked By */}
              <Form.Item
                label="Checked By"
                name="checkedBy"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Checked By">
                  <Option value="checkedBy1">Checked By 1</Option>
                  <Option value="checkedBy2">Checked By 2</Option>
                  <Option value="checkedBy3">Checked By 3</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
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
          </Row>

          <Row gutter={48}>
            {/* Area */}
            <Col span={6}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Area"
                    name="area"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select Area">
                      <Option value="area1">Area 1</Option>
                      <Option value="area2">Area 2</Option>
                      <Option value="area3">Area 3</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {/* Observation */}
                  <Form.Item
                    label="Observation"
                    name="observation"
                    rules={[{ required: true }]}
                  >
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
                  {/* Photos */}
                  <Form.Item
                    label="Photos"
                    name="photos"
                    rules={[{ required: true }]}
                  >
                    <Upload
                      beforeUpload={() => false} // Prevent automatic upload
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Upload Photos</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Machine Name */}
            <Col span={6}>
              <Row gutter={16}>
                <Col span={24}>
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
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Root Cause"
                    name="rootCause"
                    rules={[{ required: true }]}
                  >
                    <TextArea
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe the root cause"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={6}>
              <Row gutter={16}>
                <Col span={24}>
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
                <Col span={24}>
                  {/* Adjustment Description */}
                  <Form.Item
                    label="Adjustment Description"
                    name="adjustmentDescription"
                    rules={[{ required: true }]}
                  >
                    <TextArea
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe the adjustment made"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={6}>
              <Row gutter={16}>
                <Col span={24}>
                  {/* Describe Problem */}
                  <Form.Item
                    label="Describe Problem"
                    name="describeProblem"
                    rules={[{ required: true }]}
                  >
                    <TextArea
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe the problem"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {/* Condition After Adjustment */}
                  <Form.Item
                    label="Condition After Adjustment"
                    name="conditionAfterAdjustment"
                  >
                    <TextArea
                      rows={5}
                      maxLength={2000}
                      placeholder="Describe the condition after adjustment"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 16 }}>
                Change Risk Management Required ?
              </span>
              <Radio.Group onChange={handleChange} value={selectedValue}>
                <Radio value="yes" style={{ marginRight: 16 }}>
                  Yes
                </Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>
          </div>
          {/* Render multiple form sections */}
          {selectedValue == "yes" &&
            formSections.map((sectionIndex) => (
              <ChangeRiskManagementForm
                key={sectionIndex}
                index={sectionIndex}
              />
            ))}
          {/* Button to add new form section */}
          {selectedValue == "yes" && (
            <div className="flex justify-end items-center my-3">
              <div className="flex items-center gap-x-4">
                <Button type="primary" onClick={addFormSection}>
                  Add Change Risk Management
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }
);

export default AdjustmentRequestForm;
