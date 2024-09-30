namespace TDSGCellFormat.Entities
{
    public class ChangeRiskManagement
    {
        public int ChangeRiskManagementId { get; set; }

        public int AdjustMentReportId { get; set; }

        public string? Changes { get; set; }

        public string? Function { get; set; }

        public string? RisksWithChanges { get; set; }

        public string? Factors { get; set; }

        public string? CounterMeasures { get; set; }

        public DateTime? DueDate { get; set; }

        public string? PersonInCharge { get; set; }

        public string? Results { get; set; }

        public string? Status { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
