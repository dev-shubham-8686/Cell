import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DOCUMENT_LIBRARIES } from "../../../GLOBAL_CONSTANT";
import { previewFile } from "../../../api/fileUploadApi";

const ClosureAttachment: React.FC<any> = ({
  isViewMode,
  ctiNumber,
  existingTechniaclInstructionSlip,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);

  // Map attachments to the Upload component's file format
  const mapTechnicalClosureAttachments = (attachments: any[]) => {
    return attachments.map((fileObj) => ({
      uid: fileObj.TechnicalClosureAttachmentId, // Unique ID of the file
      name: fileObj.DocumentName, // File name
      status: "done", // Upload status
      url: fileObj.DocumentUrl || null, // Optional file URL
    }));
  };

  // Effect to initialize the file list when data changes
  useEffect(() => {
    if (existingTechniaclInstructionSlip?.technicalClosureAttachmentAdds) {
      setFileList(
        mapTechnicalClosureAttachments(
          existingTechniaclInstructionSlip.technicalClosureAttachmentAdds
        )
      );
    }
  }, [existingTechniaclInstructionSlip]);

  return (
    <div className="closure-attachment-page">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Closure Attachments"
              name="technicalClosureAttachmentAdds"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please upload at least one document.",
              //   },
              // ]}
            >
              <Upload
                className={isViewMode ? "upload-red-only" : ""}
                fileList={fileList}
                multiple
                maxCount={5}
                disabled={isViewMode}
                //onRemove={handleRemove}
                //beforeUpload={handleBeforeUpload}
                onPreview={(file) => {
                  if (file.status === "done") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      ctiNumber,
                      DOCUMENT_LIBRARIES.Technical_Attchment__Closure_Attachment
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isViewMode}>
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ClosureAttachment;
