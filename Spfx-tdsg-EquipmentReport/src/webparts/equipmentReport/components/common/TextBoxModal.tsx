import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import React from "react";
import useAreaMaster from "../../apis/masters/useAreaMaster";

export interface ITextBoxModal {
  label: string | JSX.Element;
  titleKey: string;
  initialValue: string;
  isVisible: boolean;
  toshibaApproval?: boolean;
  advisorRequired?: boolean;
  submitBtnText?: string;
  cancelBtnText?: string;
  onCancel: () => void;
  onSubmit: (value: any) => void;
  inputRules?: { [key: string]: string | boolean }[];
  isRequiredField?: boolean;
  modelTitle?: string;
}

const TextBoxModal: React.FC<ITextBoxModal> = ({
  modelTitle = "",
  label,
  titleKey,
  initialValue,
  isVisible,
  submitBtnText,
  cancelBtnText,
  toshibaApproval,
  advisorRequired,
  isRequiredField = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { data: areas, isLoading: areaIsLoading } = useAreaMaster();

  const handleChange = (): void => {
    const fieldErrors = form.getFieldError(titleKey);
    if (fieldErrors.length > 0) {
      form.setFields([
        {
          name: titleKey,
          errors: [],
        },
      ]);
    }
  };

  return (
    <>
      <Modal
        title={modelTitle}
        open={isVisible}
        maskClosable={false}
        closable={false}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => {
            if (isRequiredField && !values[titleKey]) {
              form.setFields([
                {
                  name: titleKey,
                  errors: ["This field is required"],
                },
              ]);
            } else {
              onSubmit(values);
              console.log("Values", values);
              form.resetFields();
            }
          }}
          layout="vertical"
        >
          {toshibaApproval ? (
            <Form.Item label="Please select Target Date " name="TargetDate">
              <DatePicker
                disabledDate={(current) => {
                  // future dates only
                  return current && current <= dayjs().endOf("day");
                }}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          { advisorRequired?(
            <Form.Item
              label={<span className="text-muted">Please select Advisor</span>}
              name="advisorId"
            >
              <Select
                showSearch
                options={areas?.map((area) => ({
                  label: area.AreaName,
                  value: area.AreaId,
                }))}
                loading={areaIsLoading}
                className="custom-disabled-select"
              />
            </Form.Item>
          ) : (
            <></>
          )}
          <Form.Item
            name={titleKey}
            label={label}
            initialValue={initialValue}
            // rules={inputRules}
          >
            <TextArea
              className="mt-2"
              rows={4}
              onChange={handleChange}
              maxLength={500}
            />
          </Form.Item>
          <div className="d-flex gap-3 justify-content-end ">
            <Button
              key="back"
              className="btn-outline-primary"
              onClick={() => {
                form.resetFields(); // Reset all fields --  for removing comments
                onCancel();
              }}
            >
              {cancelBtnText ? cancelBtnText : "Cancel"}
            </Button>
            <Button
              key="submit"
              type="primary"
              className="btn btn-primary"
              htmlType="submit"
            >
              {submitBtnText ?? "Proceed"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TextBoxModal;
