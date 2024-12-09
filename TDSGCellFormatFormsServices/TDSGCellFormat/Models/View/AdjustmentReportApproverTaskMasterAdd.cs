namespace TDSGCellFormat.Models.View
{
    public class AdjustmentReportApproverTaskMasterAdd
    {
        public int ApproverTaskId { get; set; }
        public string? FormType { get; set; }
        public int AdjustmentReportId { get; set; }
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
}
