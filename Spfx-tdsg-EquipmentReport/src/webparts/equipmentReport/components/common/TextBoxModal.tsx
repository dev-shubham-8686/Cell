import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import useAreaMaster from "../../apis/masters/useAreaMaster";
import useAdvisorDetails from "../../apis/masters/useAdvisor";
import useGetTargetDate from "../../apis/workflow/useGetTargetDate";
import { useParams } from "react-router-dom";
import { DATE_FORMAT } from "../../GLOBAL_CONSTANT";

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
  isTargetDateSet?:boolean;
  targetDate?:Date
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
  isTargetDateSet,
  targetDate,
  isRequiredField = false,
  onCancel,
  onSubmit,
}) => {
  const {id}=useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { data: advisors, isLoading: advisorIsLoading } = useAdvisorDetails();
  // const targetDate = useGetTargetDate();
useEffect(()=>{
  
  if (isTargetDateSet) {
    //  const targetData:any=targetDate.mutate({equipmentId:parseInt(id),toshibaDiscussion})
    // const parsedDate = dayjs(targetData?.TargetDate, DATE_FORMAT);
    // if (parsedDate.isValid()) {
      form.setFieldsValue({ TargetDate: dayjs(targetDate,DATE_FORMAT) });
    // } else {
    //   console.error("Invalid Target Date format:", targetData?.TargetDate);
    // }
  }
},[isVisible,isTargetDateSet])
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
                  return current && current < dayjs().endOf("day");
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
                options={advisors?.map((advisor) => ({
                  label: advisor.employeeName,
                  value: advisor.employeeId,
                }))}
                loading={advisorIsLoading}
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
