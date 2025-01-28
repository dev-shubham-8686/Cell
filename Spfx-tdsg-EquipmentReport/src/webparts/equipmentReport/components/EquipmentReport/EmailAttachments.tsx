import * as React from "react";
import { DATE_FORMAT, DocumentLibraries, REQUEST_STATUS } from "../../GLOBAL_CONSTANT";
import { displayRequestStatus } from "../../utility/utility";
import dayjs from "dayjs";
import { IWorkFlow } from "../../apis/workflow/useGetApprovalFlowData";
import { Col, Form, Popover, Row } from "antd";
import FileUpload from "../fileUpload/FileUpload";
import { useParams } from "react-router-dom";
import { IEmailAttachments } from "../common/TextBoxModal";

export interface IRequestStatus {
  formStatus: string;
  workflowStatus: string;
}
export interface IRequestDetails extends IRequestStatus {
  activeSection: number;
  activeSectionInBE: number;
  isSubmit: boolean;
  createdBy: number;
}

interface IProps {
  emailAttachments?: IEmailAttachments[];
  EQReportNo?:any
  // requestStatus?: IRequestDetails;
  // userId: number;
}

// Define static data for requestStatus

const EmailAttachments: React.FC<IProps> = ({
  emailAttachments,
  EQReportNo
  //   requestStatus,
  //   userId,
}) => {
  const { id, mode } = useParams();
  const isModeView = mode === "view" ? true : false;
console.log("EMAIULATTACHmENTSZ",emailAttachments)
  return (
    <div className="tab-section p-4">
     {emailAttachments?.length>0 ? (<Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Toshiba Attachments"
              name="emailAttachments"
            >
              <FileUpload
              showbutton={false}
                files={emailAttachments?.map((a) => ({
                  ...a,
                  uid: a.EmailAttachmentId?.toString() ?? "",
                  name: a.EmailDocName,
                  url: "",
                }))}
                disabled={true}
                key={`email-Attachments`}
                folderName={EQReportNo}
                subFolderName={"Email Attachments"}
                libraryName={DocumentLibraries.EQ_Report}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>):(<div>Attachments has .</div>)}
    </div>
  );
};

export default EmailAttachments;
