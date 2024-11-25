namespace TDSGCellFormat.Models.View
{
    public class EquipmentImprovementView
    {
        public int EquipmentImprovementId { get; set; }
        public string? EquipmentImprovementNo { get; set; }
        public string? IssueDate { get; set; }
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }
        public string? SectionName { get; set; }

        public string? Area {  get; set; }
        public string? ImprovementName { get; set; }
        public string? Requestor {  get; set; }
        public string? CurrentApprover { get; set; }

        public int? CurrentApproverId { get; set; }
        public string? Status { get; set; }

        public int? CreatedBy   { get; set; }

        public bool? IsSubmit {  get; set; }

        public bool? IsResultSubmit { get; set; }
        public int? totalCount { get; set; }

    }

    public class EquipmentImprovementApproverView
    {
        public int EquipmentImprovementId { get; set; }
        public string? EquipmentImprovementNo { get; set; }
        public string? IssueDate { get; set; }
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }
        public string? Area { get; set; }
        public string? SectionName { get; set; }
        public string? ImprovementName { get; set; }
        public string? Requestor { get; set; }
        public string? ApproverTaskStatus { get; set; }
        public string? Status { get; set; }
        public int? CreatedBy { get; set; }
        public int? totalCount { get; set; }
    }

    public class EquipmentExcelViewForType1
    {
        public string? EquipmentImprovementNo { get; set; }
        public string? IssueDate { get; set; }

        public string? Area { get; set; }
        public string? MachineName { get; set; }
        public string? OtherMachineName { get; set; }
        public string? SubMachineName { get; set; }
        public string? OtherSubMachine { get; set; }
        public string? SectionName { get; set; }
        public string? ImprovementName { get; set; }
        public string? Requestor { get; set; }
        public string? CurrentApprover { get; set; }
        public string? Status { get; set; }
    }

    public class EquipmentExcelViewForType2
    {
        public string? EquipmentImprovementNo { get; set; }
        public string? IssueDate { get; set; }
        public string? Area { get; set; }
        public string? MachineName { get; set; }
        public string? OtherMachineName { get; set; }
        public string? SubMachineName { get; set; }
        public string? OtherSubMachine { get; set; }
        public string? SectionName { get; set; }
        public string? ImprovementName { get; set; }
        public string? Requestor { get; set; }
        public string? Status { get; set; }
    }

    public class EquipmentPdfDTO
    {
        public string? RequestNo { get; set; }
        public DateTime IssueDate  { get; set; }
        public string? MachineName { get; set; }
        public string? Purpose { get; set; }
        public string? Applicant { get; set; }
        public string? CurrentSituation { get; set; }
        public string? Improvement { get; set; }
        public string? ResultStatus  { get; set; }
        public DateTime? TargetDate { get; set; }
        public DateTime? ActualDate { get; set; }
        public string? Changes { get; set; }
        public string? FunctionId { get; set; }
        public string? RiskAssociatedWithChanges { get; set; }
        public string? Factor { get; set; }
        public string? CounterMeasures { get; set; }
        public string? DueDate { get; set; }
        public string? PersonInCharge { get; set; }
        public string? Results { get; set; }
    }

}
