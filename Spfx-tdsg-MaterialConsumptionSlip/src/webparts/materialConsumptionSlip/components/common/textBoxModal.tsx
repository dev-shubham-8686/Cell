import { Button, Form, Input, Modal, Select } from "antd";
import React, { useContext } from "react";
import useEmployeeMaster from "../../apis/MasterAPIs/EmployeeMaster";
import { UserContext } from "../../context/userContext";

export interface ITextBoxModal {
  showDelegate?: boolean;
  label: string | JSX.Element;
  titleKey: string;
  initialValue: string;
  isVisible: boolean;
  submitBtnText?: string;
  cancelBtnText?: string;
  onCancel: () => void;
  onSubmit: (value: { [key: string]: string }) => void;
  inputRules?: { [key: string]: string | boolean }[];
  isRequiredField?: boolean;
  modelTitle?: string;
}

// const InitialTextBoxProps = {
//   label: "",
//   titleKey: "",
//   initialValue: "",
//   isVisible: false,
//   submitBtnText?: "",
//   cancelBtnText?: ""
//   onCancel: () => {

//   },
//   onSubmit: (value: { [key: string]: string }) => void,
// }

const TextBoxModal: React.FC<ITextBoxModal> = ({
  showDelegate,
  modelTitle = "",
  label,
  titleKey,
  initialValue,
  isVisible,
  submitBtnText,
  cancelBtnText,
  inputRules,
  isRequiredField = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { data: employees, isLoading: employeeIsLoading } = useEmployeeMaster();
  const user = useContext(UserContext);

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
              form.resetFields();
            }
          }}
          layout="vertical"
        >

          {showDelegate ? (
            <Form.Item
              name="DelegateUserId"
              label="Select a Delegate User"
              rules={[
                { required: true, message: "Please select a Delegate User." },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                // style={{ width: "100%" }}
                placeholder="Select a Delegate User "
                filterOption={(input, option) =>
                  option?.label
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={employees?.map((emp) => ({
                  label: emp.employeeName,
                  value: emp.employeeId,
                }))}
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
            <TextArea className="mt-2" rows={4} onChange={handleChange} maxLength={500} />
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
            <Button key="submit" type="primary" className="btn btn-primary" htmlType="submit">
              {submitBtnText ?? "Proceed"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default TextBoxModal;
