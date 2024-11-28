
using System.ComponentModel;

namespace TDSGCellFormat.Common
{
    public class Enums
    {
        public enum MessageType
        {
            Success = 1,
            Error = 2,
            Info = 3,
            Warning = 4,
            AccessInValid = 5,
            NotAuthorize = 6
        }

        public enum Mode
        {
            None = 0,
            Add = 1,
            Edit = 2,
            Delete = 3,
            View = 4

        }
        public enum Status
        {
            Create = 1,
            Approved = 2,
            SessionTimeOut = 3,
            Close = 4,
            Received = 5,
            Error = 6,
            Success = 7,
            PartialSuccess = 8,
            Cancel = 9,
            NotAuthorize = 10
        }
        public enum ProjectType
        {
            TroubleReport = 1,
            AdjustMentReport = 2,
            Equipment = 3,
            MaterialConsumption = 4, //MATERIALCONSUMPTION
            TechnicalInstruction = 5
        }
        public enum HistoryAction
        {
            Submit = 1,
            ReSubmitted = 2,
            Approved = 3,
            Rejected = 4,
            Cancelled = 5,
            Amended = 6,
            Completed = 7,
            Closed = 8,
            PullBack = 9,
            Draft = 10,
            InReview = 11,
            Copy = 12,
            Save = 13,
            UnderAmendment = 14,
            Revise = 15,
            SendToManager =16,
            NotifyMembers = 17,
            ReviewByManager = 18,
            Allow = 19,
            Decline = 20,
            LogicalAmendment = 21,
            Update = 22,
            ToshibaApproved = 23,
            ToshibaApprovalRequired = 24,
            PCRNRequired = 25,
            ToshibaDiscussionRequired = 26
        }
        public enum ApprovalStatus
        {
            Approved = 1,
            Rejected = 2,
            AskToAmend = 3,
            LogicalAmendment = 4
        }
        public enum EmailNotificationAction
        {
            Submitted = 1,
            ReSubmitted = 2,
            Approved = 3,
            Rejected = 4,
            Closed = 5,
            Amended = 6,
            Completed = 7,
            PullBack = 8,
            FinalSubmitted = 9,
            delegateUser = 10,
            Created = 11,
            ParallelSubmit = 12,
            Reminder = 13,
            JudgmentTrialNo = 14,
            Information = 15,
            AutoApproved = 16,
            Reopen = 17,
            ApproveInformed = 18,
            NotifyManager = 19,
            NotifyWokrDone = 20,
            NotifyReviewManager = 21,
            Allow = 22,
            Decline = 23,
            AllowBoth =24,
            LogicalAmend = 25,
            W1Completed = 26,
            UnderImplementation = 27,
            ResultMonitoring = 28,
            ResultSubmit = 29,
            ResultApprove = 30,
            ResultReject = 31,
            ToshibaTeamDiscussion = 32,
            ToshibaTeamApproval = 33,
            PcrnRequired = 34


        }
        public enum ApprovalTaskStatus
        {
            Draft = 1,
            Save = 2,
            InReview = 3,
            Rejected = 4,
            Cancelled = 5,
            UnderAmendment = 6,
            Completed = 7,
            PullBack = 8,
            Pending = 9,
            Closed = 10,
            Revised = 11,
            Skipped = 12,
            Reminder = 13,
            Approved = 14,
            AutoApproved = 15,
            ReSubmitted = 16,
            InProcess = 17,
            UnderReview = 18,
            Reject = 19,
            Allow = 20,
            Decline = 21,
            Reviewed = 22,
            Submitted = 23,
            ReviewDeclined = 24,
            UnderApproval = 25,
            ReOpen =26,
            W1Completed = 27,
            ToshibaTechnicalReview = 28,
            UnderToshibaApproval = 29,
            LogicalAmendment = 30,
            PCRNPending = 31,
            UnderImplementation = 32,
            ResultMonitoring = 33,
            LogicalAmendmentInReview = 34
            

        }
        public enum FormType
        {
            TroubleReport = 1,
            MaterialConsumption = 2,
            AjustmentReport = 3,
            TechnicalInstruction = 4,
            EquipmentImprovement = 5,
        }
        public enum Message
        {
            [Description("Record Saved Successfully")]
            Save,
            [Description("Record Updated Successfully")]
            Edit,
            [Description("Record Deleted Successfully")]
            Delete,
            [Description("Are you sure you want to Delete?")]
            ConfirmDelete,
            [Description("Already Exists")]
            AlreadyExists,
            [Description("Record Not Save Successfully")]
            NotSave,
            [Description("Retrived Data Successfully")]
            RetrivedSuccess,
            [Description("Id {0} is not found")]
            NotEdit,
            [Description("Data Not Found")]
            DataNotFound,
            [Description("Not Uploaded")]
            NotUpload,
            [Description("Data is Not Valid.")]
            DataNotValid,
            [Description("Record Not Deleted Successfully")]
            NotDelete,
            [Description("Password do not match. Please try again.")]
            PasswordNotMatch,
            [Description("Email sent successfully.")]
            EmailSent
        }

        public class AjaxResult
        {
            public Int16 ResultType { get; set; }
            public Enums.Status StatusCode { get; set; }
            public string? Message { get; set; }
            public object? ReturnValue { get; set; }
        }

        public class ResultExecute
        {
            public int NewId { get; set; }
            public string RecordNumber { get; set; }
            public Int16 ResultType { get; set; }
            public string Message { get; set; }
            public string refNumber { get; set; }

        }
        public static string GetEnumDescription(Enum value)
        {
            var fi = value.GetType().GetField(value.ToString());
            var attributes =
             fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

            if (attributes != null && attributes.Length > 0)
                return attributes[0].Description;

            //if no attribute was specified, then we will return the regular enum.ToString()
            return value.ToString();
        }
        public class ResponseHelper
        {
            public AjaxResult ResponseMessage(Enums.Status StatusCode, string Messages, object? ReturnValue = null)
            {
                return new AjaxResult
                {
                    StatusCode = StatusCode,
                    Message = Messages,
                    ReturnValue = ReturnValue
                };
            }
        }

        #region Roles
        public const string ReportingManager = "ReportingManager";
        public const string WorkDoneLead = "WorkDoneLead";
        public const string ReviewReportingManager = "ReviewReportingManager";
        public const string WorkDoneManager = "ReviewWorkDoneManager";
        public const string DeputyDivisionHead = "Deputy Division Head";
        public const string DivisionHead = "Division Head";
        //public const string RoleGprocPC = "GproPC";
        #endregion

        #region Message
        public const string TroubleAuthorization = "You are not an authorized user. Please contact system administrator.";
        public const string TroubleSessionExpired = "Your session has expired. Please refresh and try again.";
        public const string TroubleSuccess = "Success";
        public const string TroubleSave = "Trouble Report saved successfully";
        public const string TroubleSubmit = "Trouble Report submitted successfully";
        public const string TroubleNotifyManager = "Email has been sent to Reporting Manager";
        public const string TroubleNotifyMembers = "Email has been sent to Word Done By Members";
        public const string TroubleReviewManager = "Email has been sent to Managers";
        public const string TroubleAllow = "The report has been successfully reviewed";
        public const string TroubleDecline = "The report has been successfully declined.";
        public const string TroublePullBack = "Trouble Report has been pulled back successfully";
        public const string TroubleAskToAmend = "Amendment Asked successfully";
        public const string TroubleResubmit = "Trouble Report form Resubmitted successfully";
        public const string TroubleApprove = "Trouble Report approved";
        public const string TroubleReject = "Trouble Report rejected";
        public const string TroubleReOpen = "Trouble Report reopened";

        public const string EquipmentSave = "Equipment Improvement form saved successfully";
        public const string EquipmentSubmit = "Equipment Improvement form submitted successfully";
        public const string EquipmentPullback = "Equipment Improvement form has been pulled back successfully";
        public const string EquipmentAsktoAmend = "Amendment Asked successfully";
        public const string EquipmentApprove = "Equipment Improvement form has been approved";
        public const string EquipmentReject = "Equipment Improvement rejected";
        public const string EquipmentDateUpdate = "Equipment Improvement record updated";
        public const string EquipmentResubmit = "Equipment Improvement form Resubmitted successfully";

        public const string AdjustMentSave = "Adjustment Report saved successfully";
        public const string AdjustMentSubmit = "AdjustMent form submitted successfully";
        public const string AdjustMentReSubmit = "AdjustMent form Resubmitted successfully";
        public const string AdjustMentPullback = "AdjustMent form has been pulled back successfully";
        public const string AdjustMentAsktoAmend = "Amendment Asked successfully";
        public const string AdjustMentApprove = "AdjustMent form has been approved";
        public const string AdjustMentReject = "AdjustMent rejected";
        public const string AdjustMentDateUpdate = "AdjustMent record updated";
        public const string AdjustMentExcel = "Excel file downloaded successfully";
        public const string AdjustMentPdf = "PDF file downloaded successfully";
        public const string AdjustMentNotFound = "Please complete the approval process to download the excel";

        public const string MaterialSave = "Material Consumption form saved successfully";
        public const string MaterialSubmit = "Material Consumption form submitted successfully";
        public const string MaterialApprove = "Material Consumption form has been approved";
        public const string MaterialAsktoAmend = "Amendment Asked successfully";
        public const string MaterialResubmit = "Material Consumption form Resubmitted successfully";
        public const string MaterialPullback = "Material Consumption form has been pulled back successfully";
        public const string MaterialClose = "Material Consumption form closed successfully";
        public const string MaterialExcel = "Excel file downloaded successfully";
        public const string MaterialPdf = "PDF file downloaded successfully";
        public const string MaterialExcelNotFound = "Please complete the approval process to download the excel";
        #endregion
    }
}
