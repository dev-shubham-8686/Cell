import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import * as React from "react";
import { disabledDate } from "../../../utils/helper";
import * as dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import ChangeRiskManagementForm from "./ChangeRiskManagementForm";
import { useGetAllMachines } from "../../../hooks/useGetAllMachines";
import { useGetAllSubMachines } from "../../../hooks/useGetAllSubMachines";
import { ISubMachine } from "../../../api/GetAllSubMachines.api";
import { IArea } from "../../../api/GetAllAreas.api";
import { useEffect, useState } from "react";
import { useGetCheckedBy } from "../../../hooks/useGetCheckedBy";
import { useGetAllAreas } from "../../../hooks/useGetAllAreas";
import { ChangeRiskManagement } from "../../../api/AddUpdateReport.api";
// import { ChangeRiskManagement } from "../../../api/AddUpdateReport.api";
// import { useParams } from "react-router-dom";

// const { TextArea } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface RequestFormProps {
  onFormSubmit: (values: any) => void;
}

const RequestForm = React.forwardRef((props: RequestFormProps, ref) => {
  const [form] = Form.useForm();
  // const { mode } = useParams();
  const currentDateTime = dayjs();
  const [cRMRequired, setCRMRequired] = React.useState<boolean | null>(null);
  const [formSections, setFormSections] = React.useState<number[]>([0]); // Initially, one form section
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);
  const [filteredSubMachines, setFilteredSubMachines] = useState<ISubMachine[]>([]);

  const { data: machinesResult, isLoading: machineloading } = useGetAllMachines();

  const { data: subMachinesResult, isLoading: submachineloading } = useGetAllSubMachines();
  const { data: areasResult, isLoading: arealoading } = useGetAllAreas();
  const { data: checkedByResult, isLoading: checkedloading } = useGetCheckedBy();

  useEffect(() => {
    if (selectedMachineId && subMachinesResult?.ReturnValue) {
      const filtered = subMachinesResult.ReturnValue.filter(
        (subMachine: any) => subMachine.MachineId === selectedMachineId
      );
      setFilteredSubMachines(filtered);
    } else {
      setFilteredSubMachines([]);
    }

    form.setFieldsValue({ subMachineName: [] });
  }, [selectedMachineId, subMachinesResult, form]);

  const addFormSection = () => {
    setFormSections((prevSections) => [...prevSections, prevSections.length]);
  };

  const onFinish = (values: any) => {
    values.ChangeRiskManagementRequired = cRMRequired;
    values.ChangeRiskManagementList = []
    
    const numberOfSections = formSections.length;

    for (let i = 0; i < numberOfSections; i++) {
      // Create a ChangeRiskManagement object for each section
      const changeRiskManagement: ChangeRiskManagement = {
        Changes: values[`changes-${i}`],
        RiskWithChanges: values[`riskWithChanges-${i}`],
        Factors: values[`factor-${i}`],
        CounterMeasures: values[`counterMeasures-${i}`],
        Function: values[`function-${i}`],
        DueDate: values[`date-${i}`],
        PersonInChargeId: values[`personInCharge-${i}`],
        Results: values[`results-${i}`],
      };

      values.ChangeRiskManagementList.push(changeRiskManagement);
    }

    props.onFormSubmit(values);
  };

  // Function to handle the file validation
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      console.error("You can only upload JPG or PNG file!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      console.error("Image must smaller than 10MB!");
    }
    return isJpgOrPng && isLt10M;
  };

  // Forward form instance to parent component
  React.useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  return (
    <div className="py-3 adj-form">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          dateTime: currentDateTime,
          reportNo: "",
        }}
      >
        <Row gutter={48}>
          <Col span={6}>
            <Form.Item label="Report No" name="reportNo">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Requested By" name="requestedBy">
              <Input placeholder="Enter Your Name" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Checked By"
              name="checkedBy"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Checked By" loading={checkedloading}>
                {checkedByResult?.ReturnValue &&
                  checkedByResult.ReturnValue.map((checkedBy) => (
                    <Option key={checkedBy.employeeId} value={checkedBy.employeeId}>
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
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Area"
                  name="area"
                  rules={[{ required: true }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Area"
                    showSearch={false}
                    loading={arealoading}>
                    {areasResult?.ReturnValue &&
                      areasResult.ReturnValue.map((area: IArea) => (
                        <Option key={area.AreaId} value={area.AreaId}>
                          {area.AreaName}
                        </Option>
                      ))}
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
                  <Upload
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={beforeUpload}
                    maxCount={5} // Max attachments
                    showUploadList={{ showRemoveIcon: true }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload Before Images
                    </Button>
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
                  <Select
                    placeholder="Select Machine Name"
                    onChange={(value) => setSelectedMachineId(value)} // Update selected machine ID
                    loading={machineloading}
                  >
                    {machinesResult?.ReturnValue &&
                      machinesResult.ReturnValue.map((machine: any) => (
                        <Option key={machine.MachineId} value={machine.MachineId}>
                          {machine.MachineName}
                        </Option>
                      ))}
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
            <Row gutter={16}>
              <Col span={12}>
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
                  <Upload
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={beforeUpload}
                    maxCount={5} // Max attachments
                    showUploadList={{ showRemoveIcon: true }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload After Images
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={6}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Sub-Machine Name"
                  name="subMachineName"
                  rules={[{ required: true }]}
                >
                  <Select mode="multiple" placeholder="Select Sub-Machine Name"
                    loading={submachineloading}>
                    {filteredSubMachines.map((subMachine) => (
                      <Option
                        key={subMachine.SubMachineId}
                        value={subMachine.SubMachineId}
                      >
                        {subMachine.SubMachineName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
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
            <Radio.Group
              onChange={(e: any) => setCRMRequired(e.target.value)}
              value={cRMRequired}
            >
              <Radio value={true} style={{ marginRight: 16 }}>
                Yes
              </Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
        </div>

        {/* Render multiple form sections */}
        {cRMRequired &&
          formSections.map((sectionIndex) => (
            <ChangeRiskManagementForm
              key={sectionIndex}
              index={sectionIndex}
              form={form}
            />
          ))}
        {/* Button to add new form section */}
        {cRMRequired && (
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
});

export default RequestForm;
