using TDSGCellFormat.Entities;

namespace TDSGCellFormat.Models
{
    public class Photos
    {
        public List<AdjustmentReportPhoto>? BeforeImages { get; set; }

        public List<AdjustmentReportPhoto>? AfterImages { get; set; }
    }
}
