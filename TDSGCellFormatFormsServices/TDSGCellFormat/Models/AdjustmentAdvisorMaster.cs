using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("AdjustmentAdvisorMaster")]
    public class AdjustmentAdvisorMaster
    {
        [Key]
        public int AdjustmentAdvisorId { get; set; }

        public int? EmployeeId { get; set; }

        public int? AdjustmentReportId { get; set; }

        public string? Comment { get; set; }

        public bool? IsActive { get; set; }
    }
}
