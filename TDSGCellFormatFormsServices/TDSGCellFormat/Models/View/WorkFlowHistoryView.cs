namespace TDSGCellFormat.Models.View
{
    public class TroubleReportHistoryView
    {
        public int historyID { get; set; }

        public int formID { get; set; }

        public string formType { get; set; } = null!;

        public string? actionTakenDateTime { get; set; }

        public string? status { get; set; }

        public string? actionTakenBy { get; set; }
        public int? actionTakenByUserID { get; set; }

        public string? role { get; set; }

        public string? comment { get; set; }

        public string? actionType { get; set; }

        public int? delegateUserId { get; set; }

        public bool isActive { get; set; }
    }


}
