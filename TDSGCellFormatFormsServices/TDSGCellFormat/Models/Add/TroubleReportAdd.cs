using Newtonsoft.Json;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TDSGCellFormat.Models.Add
{
    public class TroubleReportAdd
    {
        public int? TroubleReportId { get; set; }
        public int? troubleRevisedId { get; set; }
        public string? troubleReportNo { get; set; }
        public string? when { get; set; }
        public string? breakDownMin { get; set; }
        public string? reportTitle { get; set; }
        public string? process { get; set; }

        public string? processingLot { get; set; }

        public bool? NG { get; set; }

        public string? PHlotAndQuantity { get; set; }
        public string? NGlotAndQuantity { get; set; }

        public bool? ProductHold { get; set; }

        public List<int>? troubleType { get; set; }
        public List<int>? employeeId { get; set; }
        public bool? restarted { get; set; }
        public string? otherTroubleType { get; set; }
        public string? troubleBriefExplanation { get; set; }
        public string? permanantCorrectiveAction { get; set; }
        public string? immediateCorrectiveAction { get; set; }
        public string? remarks { get; set; }
        public string? closure { get; set; }
        public string? pca {  get; set; }
        public string? rootCause { get; set; }
        public bool? isAdjustMentReport { get; set; }
        public string? adjustmentReport { get; set; }

        public string? completionDate { get; set; }

        public string? status { get; set; }
        public string? workFlowStatus { get; set; }
        public bool? isSubmit { get; set; }

        public bool? WorkDone { get; set; }
        public bool? isReOpen { get; set; }
        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public DateTime? WorkSubmittedDate { get; set; }
        public List<WorkDoneSection>? WorkDoneData { get; set; }

        public List<TroubleAttachmentData>? TroubleAttachmentDetail { get; set; }
        public List<troubleAttachment>? TroubleAttachmentDetails { get; set; }
        public bool? IsDeleted { get; set; }
        public int sequenceNumber { get; set; }
        public int approverTaskId { get; set; }
        public int? reportLevel { get; set; }
        public int? departmentHeadId { get; set; }


    }

    public class TroubleAttachmentData
    {
        public int? TroubleAttachmentId { get; set; }
        public int? TroubleReportId { get; set; }
        public string? documentName { get; set; }
        public string? documentFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
    }

    public class troubleAttachment
    {
        public string? uid { get; set; }
        public int? troubleReportId { get; set; }
        public int? attachmentId { get; set; }
        public string? status { get; set; }
        public string? name { get; set; }
        public string? url { get; set; }
    }

    public class TroubleReportNumberResult
    {
        [Key]
        public string? TroubleReportNo { get; set; }
    }
    public class WorkDoneSection
    {
        public int workDoneId { get; set; }
        public int? troubleReportId { get; set; }
        public int? employeeId { get; set; }
        public bool? lead { get; set;}
        public string? comment { get; set; }
        public bool? isSaved { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }

    public class JsonDataSet
    {
        public List<TroubleReportResult> JsonResult { get; set; }
    }
    public class TroubleReportApproverTaskMasterAdd
    {
        public int ApproverTaskId { get; set; }
        public string? FormType { get; set; }
        public int TroubleReportId { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? DelegateUserId { get; set; }
        public int? DelegateBy { get; set; }
        public DateTime? DelegateOn { get; set; }
        public string? Status { get; set; }
        public string? Role { get; set; }
        public string? DisplayName { get; set; }
        public int SequenceNo { get; set; }
        public string? Comments { get; set; }
        public int? ActionTakenBy { get; set; }
        public DateTime? ActionTakenDate { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool? IsActive { get; set; }
        public string? employeeName { get; set; }
        public string? employeeNameWithoutCode { get; set; }
        public string? email { get; set; }  
        public string? processName { get; set; }
    }
    public class TroubleReportResult
    {
       // [Key]
        public int TroubleReportId { get; set; }
        public string? TroubleReportNo { get; set; }
        //[Required]
        //[DisplayName("CreatedBy")]
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Status { get; set; }
        public List<TroubleRevisionResult>? SimilarEntries { get; set; }
    }

    public class TroubleRevisionResult
    {
       // [Key]
        public int TroubleRevisionId { get; set; }
        public string? TroubleRevisionNo { get; set; }
       // [Required]
       // [DisplayName("CreatedBy")]
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Status { get; set; }
    }

    public class TroubleReport_OnSubmit
    {
        public int troubleReportId { get; set; }
        public bool? isSubmit { get; set; }
        public bool? isAmendReSubmitTask { get; set; }
        public int? modifiedBy { get; set; }
        public int? approverTaskId { get; set; }

        public string? comment { get; set; }
    }
    public class ApproverTaskId_dto
    {
        public int approverTaskId { get; set; }
        public int userId { get; set; }
        public string? status { get; set; }
        public int? seqNumber { get; set; }

    }
    public class TroubleReportExcel
    {
        
        public string? TroubleReportNo { get; set; }
        public string? ReportTitle { get; set; }
        public string? DateofReportGeneration { get; set; }
        public string? Process { get; set; }
        public string? Raiser { get; set; }
        public string?  WorkDoneBy { get; set; }
        public string? SectionHead { get; set; }
        public string? Status { get; set; }
        public string? DateofCompletion { get; set; }
    }


}
