using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Models.Add
{
    public class EquipmentImprovementApplicationAdd
    {
        public int? EquipmentImprovementId { get; set; }
        public string? EquipmentImprovementNo { get; set; }
        public string? When { get; set; }
        public List<int>? AreaId { get; set; }
        public int? MachineName { get; set; }
        public List<int>? SubMachineName { get; set; }
        public int? SectionId { get; set; }

        public int? SectionHeadId  { get; set; }

        public int? AdvisorId { get; set; }
        public string? Purpose { get; set; }
        public string? ImprovementName { get; set; }
        public string? CurrentSituation { get; set; }

        public string? Improvement { get; set; }

        public string? Attachment { get; set; }
       
       
        public string? PcrnDocName { get; set; }
        public string? PcrnFilePath { get; set; }
        public string? Status { get; set; }
        public string? WorkflowStatus { get; set; }
        public int? WorkflowLevel { get; set; }
        public bool? IsSubmit { get; set; }

        public bool? IsAmendReSubmitTask { get; set; }


        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsDeleted { get; set; }

        public string? ToshibaApprovalTargetDate    { get; set; }
        public bool? ToshibaApprovalRequired { get; set; }

        public string? ToshibaDiscussionTargetDate { get; set; }
        public bool? IsPcrnRequired { get; set; }
        public bool? ToshibaTeamDiscussion { get; set; }
        public List<EquipmentCurrSituationAttachData>? EquipmentCurrSituationAttachmentDetails { get; set; }
        public List<EquipmentImprovementAttachData>? EquipmentImprovementAttachmentDetails { get; set; }
        public List<ChangeRiskManagementData>? ChangeRiskManagementDetails { get; set; }
        public PcrnAttachment? PcrnAttachments { get; set; }
        public ResultAfterImplementation? ResultAfterImplementation { get; set; }
    }

    public class PcrnAttachment
    {
        public int PcrnAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? PcrnDocName { get; set; }
        public string? PcrnFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public bool? IsDeleted { get; set; }

    }

    public class ResultAfterImplementation
    {
        public string? TargetDate { get; set; }
        public string? ActualDate { get; set; }
        public bool? IsResultSubmit { get; set; }
        public bool? IsResultAmendSubmit { get; set; }
        public string? ResultStatus { get; set; }
       public string? ResultMonitoring {  get; set; }
        public string? ResultMonitoringDate { get; set; }
    }

    public class EquipmentCurrSituationAttachData
    {
        public int EquipmentCurrSituationAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? CurrSituationDocName { get; set; }
        public string? CurrSituationDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }


    public class EquipmentImprovementAttachData
    {
        public int EquipmentImprovementAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? ImprovementDocName { get; set; }
        public string? ImprovementDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

    public class ChangeRiskManagementData
    {
        public int ChangeRiskManagementId { get; set; }
        public int? ApplicationImprovementId { get; set; }
        public string? Changes { get; set; }
        public string? FunctionId { get; set; }
        public string? RiskAssociated { get; set; }
        public string? Factor { get; set; }
        public string? CounterMeasures { get; set; }
        public string? DueDate { get; set; }
        public int? PersonInCharge { get; set; }
        public string? Results { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

    public class EquipmentApproverTaskMasterAdd
    {
        public int ApproverTaskId { get; set; }
        public string? FormType { get; set; }
        public int? WorkFlowlevel { get; set; }
        public int EquipmentImprovementId { get; set; }
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
    }

    public class EquipmentPullBack
    {
        public int? equipmentId { get; set; }
        public int? userId { get; set; }
        public string? comment { get; set; }
    }

    public class EquipmentApproveAsktoAmend
    {
        public int? ApproverTaskId { get; set; }
        public int CurrentUserId { get; set; }
        public ApprovalStatus Type { get; set; }
        public string? Comment { get; set; }
        public int EquipmentId { get; set; }

        public EquipmentApprovalData? EquipmentApprovalData { get; set; }
    }

    public class EquipmentApprovalData
    {
        public int EquipmentId { get; set; }
        public bool? IsToshibaDiscussion { get; set; }
        public string? TargetDate { get; set; }
        public string? Comment { get; set; }
        public int? AdvisorId { get; set; }
        public bool? IsPcrnRequired { get; set; }
        public int? EmployeeId { get; set; }
        public List<EquipmentAttachment>? EmailAttachments { get; set; }
    }

    public class EquipmentAttachment
    {
        public int EquipmentId { get; set; }
        public int EmailAttachmentId { get; set; }

        public string? EmailDocName { get; set; }
        public string? EmailDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
    }
}
