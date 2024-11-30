import { Col, Collapse, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
import { DATE_FORMAT } from "../../../GLOBAL_CONSTANT";
import { disabledDate } from "../../../utils/helper";
import { useGetAllEmployees } from "../../../hooks/useGetAllEmployees";
import { ChangeRiskManagement } from "../../../api/AddUpdateReport.api";
import { useEffect } from "react";
import * as dayjs from "dayjs";

const { Panel } = Collapse;
const { Option } = Select;

interface ChangeRiskManagementFormProps {
  form: any;
  index: number;
  initialData: ChangeRiskManagement | undefined;
  isModeview:boolean;
}

const ChangeRiskManagementForm: React.FC<ChangeRiskManagementFormProps> = ({
  form,
  index,
  initialData,
  isModeview
}) => {
  const { data: employeesResult } = useGetAllEmployees();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        [`changes-${index}`]: initialData?.Changes,
        [`riskWithChanges-${index}`]: initialData?.RiskAssociated,
        [`factor-${index}`]: initialData?.Factor,
        [`counterMeasures-${index}`]: initialData?.CounterMeasures,
        [`function-${index}`]: initialData?.FunctionId,
        [`date-${index}`]: initialData.DueDate ? dayjs(initialData.DueDate, "DD-MM-YYYY") : null,
        [`personInCharge-${index}`]: initialData?.PersonInCharge,
        [`results-${index}`]: initialData?.Results,
      });
    }
  }, [initialData, form, index]);

  return (
    <div className="my-3">
      <Collapse defaultActiveKey={["1"]}>
        <Panel header={`Change Risk Management ${index + 1}`} key={index}>
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item
                label="Changes"
                name={`changes-${index}`}
                rules={[
                  { required: true, message: "Changes is required" },
                ]}
              >
                <TextArea 
                disabled={isModeview}
                rows={2} maxLength={100} placeholder="Changes" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Risk Associated With Changes"
                name={`riskWithChanges-${index}`}
                rules={[
                  { required: true, message: "Risk Associated With Changes is required" },
                ]}
              >
                <TextArea
                  disabled={isModeview}
                  rows={2}
                  maxLength={1000}
                  placeholder="Risk Associated With Changes"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Factor/Causes"
                name={`factor-${index}`}
                rules={[
                  { required: true, message: "Factor/Causes is required" },
                ]}
              >
                <TextArea
                  disabled={isModeview}
                rows={2} maxLength={1000} placeholder="Factor" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Counter Measures"
                name={`counterMeasures-${index}`}
                rules={[
                  { required: true, message: "Counter Measures is required" },
                ]}
              >
                <TextArea
                  disabled={isModeview}
                  rows={2}
                  maxLength={1000}
                  placeholder="Counter Measures"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={6}>
              <Form.Item
                label="Function"
                name={`function-${index}`}
                rules={[
                  { required: true, message: "Function is required" },
                ]}
              >
                <Input 
                 disabled={isModeview}
                placeholder="Enter Function" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Due Date"
                name={`date-${index}`}
                rules={[{ required: true, message: "Please Select Due Date" }]}
              >
                <DatePicker
                   disabled={isModeview}
                  disabledDate={disabledDate}
                  placeholder="Date"
                  format={DATE_FORMAT}
                  className="bg-antdDisabledBg border-antdDisabledBorder w-full"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Person In Charge"
                name={`personInCharge-${index}`}
                rules={[
                  { required: true, message: "Person In Charge is required" },
                ]}
              >
                <Select 
                 disabled={isModeview}
                placeholder="Select Person in Charge">
                  {employeesResult?.ReturnValue &&
                    employeesResult.ReturnValue.map((employee) => (
                      <Option key={employee.employeeId} value={employee.employeeId}>
                        {employee.employeeName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Results"
                name={`results-${index}`}
                rules={[
                  { required: true, message: "Results is required" },
                ]}
              >
                <TextArea 
                 disabled={isModeview}
                rows={2} maxLength={1000} placeholder="Results" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ChangeRiskManagementForm;
