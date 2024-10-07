namespace TDSGCellFormat.Models.Add
{
    public class AdjustMentReportRequest
    {
        public int AdjustMentReportId { get; set; }

        public int? Area { get; set; }

        public int? MachineName { get; set; }

        public List<int>? SubMachineName { get; set; }

        public string? ReportNo { get; set; }

        public string? RequestBy { get; set; }

        public int? CheckedBy { get; set; }

        public string? DescribeProblem { get; set; }

        public string? Observation { get; set; }

        public string? RootCause { get; set; }

        public string? AdjustmentDescription { get; set; }

        public List<Photos>? Photos { get; set; }

        public bool? ChangeRiskManagementRequired { get; set; }

        public List<ChangeRiskManagement_AdjustmentReport>? ChangeRiskManagement_AdjustmentReport { get; set; }

        public string? ConditionAfterAdjustment { get; set; }

        public string? WorkFlowStatus { get; set; }

        public string? Status { get; set; }

        public bool? IsSubmit { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
