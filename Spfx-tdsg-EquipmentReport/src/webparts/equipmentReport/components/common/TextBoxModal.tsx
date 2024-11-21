import { Button, DatePicker, Form, Input, Modal, Radio, Select } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import useAreaMaster from "../../apis/masters/useAreaMaster";
import useAdvisorDetails from "../../apis/masters/useAdvisor";
import useGetTargetDate from "../../apis/workflow/useGetTargetDate";
import { useParams } from "react-router-dom";
import { DATE_FORMAT, DocumentLibraries } from "../../GLOBAL_CONSTANT";
import FileUpload from "../fileUpload/FileUpload";
import { UserContext } from "../../context/userContext";

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
  isTargetDateSet?: boolean;
  toshibadiscussiontargetDate?: Date;
  toshibaApprovaltargetDate?: Date;
  modelTitle?: string;
  isQCHead?: boolean;
  approvedByToshiba?: boolean;
  EQReportNo?: string;
  IsPCRNRequired?:boolean;
}
export interface IEmailAttachments {
  EquipmentId: number;
  EmailAttachmentId: number;
  EmailDocName: string;
  EmailDocFilePath: string;
  CreatedBy: number;
  ModifiedBy: number;
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
  isQCHead,
  toshibaApprovaltargetDate,
  toshibadiscussiontargetDate,
  isRequiredField = false,
  onCancel,
  onSubmit,
  approvedByToshiba,
  EQReportNo,
  IsPCRNRequired
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { data: advisors, isLoading: advisorIsLoading } = useAdvisorDetails();
  const [emailAttachments, setEmailAttachments] = useState<
    IEmailAttachments[] 
  >([]);
  const user = useContext(UserContext);
  // const targetDate = useGetTargetDate();
  useEffect(() => {
    debugger
      if (isQCHead || user?.isAdmin) {
        if(toshibaApprovaltargetDate){
        form.setFieldsValue({
          TargetDate: dayjs(toshibaApprovaltargetDate, DATE_FORMAT),
        });
        if(IsPCRNRequired!=null){
          debugger
          form.setFieldsValue({
            pcrnAttachmentsRequired: IsPCRNRequired
          });
        }
      }
      else if (toshibadiscussiontargetDate) {
        form.setFieldsValue({
          TargetDate: dayjs(toshibadiscussiontargetDate, DATE_FORMAT),
        });
      }
      } else if (toshibadiscussiontargetDate) {
        form.setFieldsValue({
          TargetDate: dayjs(toshibadiscussiontargetDate, DATE_FORMAT),
        });
      }
    
  }, [isVisible, isTargetDateSet]);
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
              void form.validateFields();
              onSubmit({ ...values, emailAttachments: emailAttachments });
              console.log("Values", values);
              form.resetFields();
            }
          }}
          layout="vertical"
        >
          {toshibaApproval ? (
            <>
              <Form.Item
                label="Please select Target Date "
                name="TargetDate"
                rules={[
                  { required: true, message: "Please enter Target Date" },
                ]}
              >
                <DatePicker
                  disabledDate={(current) => {
                    // future dates only
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {isQCHead && toshibaApproval  ? (
            <>
              <Form.Item
                label="PCRN  Required"
                name="pcrnAttachmentsRequired"
                rules={[{ required: true, message: "Please select" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {advisorRequired ? (
            <Form.Item
              label={<span className="text-muted">Please select Advisor</span>}
              name="advisorId"
              rules={[{ required: true, message: "Please select Advisor" }]}
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

          {approvedByToshiba ? (
            <Form.Item
              label={<span className="text-muted">Email Attachments</span>}
              name="emailAttachments"
               rules={(emailAttachments.length==0)?[{ required: true, message: "Please Upload Attachments" }]:[]}
            >
              <FileUpload
                isEmailAttachments={true}
                key={`email-Attachments`}
                folderName={EQReportNo ?? user?.employeeId}
                subFolderName={"Email Attachments"}
                libraryName={DocumentLibraries.EQ_Report}
                files={emailAttachments?.map((a) => ({
                  ...a,
                  uid: a.EmailAttachmentId?.toString() ?? "",
                  name: a.EmailDocName,
                  url: `${a.EmailDocFilePath}`,
                }))}
                setIsLoading={(loading: boolean) => {
                  // setIsLoading(loading);
                }}
                isLoading={false}
                onAddFile={(name: string, url: string) => {
                  const existingAttachments = emailAttachments ?? [];
                  console.log("FILES", existingAttachments);
                  const newAttachment: IEmailAttachments = {
                    EquipmentId: 0,
                    EmailAttachmentId: parseInt(id),
                    EmailDocName: name,
                    EmailDocFilePath: url,
                    CreatedBy: 76,
                    ModifiedBy: 76,
                  };

                  const updatedAttachments: IEmailAttachments[] = [
                    ...existingAttachments,
                    newAttachment,
                  ];

                  setEmailAttachments(updatedAttachments);

                  console.log("File Added");
                }}
                onRemoveFile={(documentName: string) => {
                  const existingAttachments: IEmailAttachments[] = emailAttachments ?? [];

                  const updatedAttachments = existingAttachments?.filter(
                    (doc) => doc.EmailDocName !== documentName
                  );
                  setEmailAttachments(updatedAttachments);
                  console.log("File Removed");
                }}
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
            rules={[{ required: true, message: "Please enter comments" }]}
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
