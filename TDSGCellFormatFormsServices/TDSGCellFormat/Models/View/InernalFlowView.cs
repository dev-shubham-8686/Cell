namespace TDSGCellFormat.Models.View
{
    public class TroubleReportInternalFlowView
    {
        public int reviewerTaskMasterId { get; set; }

        public int? troubleReportId { get; set; }

        public int? reviewerId { get; set; }
        public string? displayName { get; set; }
        public string? processName { get; set; }
        public string? comment { get; set; }

        public string? status { get; set; }

        public bool? isReviewed { get; set; }
        public bool? isSaved { get; set; }
        public bool? isActive { get; set; }
        public bool? isSubmit {  get; set; }
        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
