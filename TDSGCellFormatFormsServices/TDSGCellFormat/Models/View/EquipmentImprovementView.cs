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
        public string? ImprovementName { get; set; }
        public string? Requestor {  get; set; }
        public string? CurrentApprover { get; set; }
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
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }
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
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }
        public string? SectionName { get; set; }
        public string? ImprovementName { get; set; }
        public string? Requestor { get; set; }
        public string? Status { get; set; }
    }

}
