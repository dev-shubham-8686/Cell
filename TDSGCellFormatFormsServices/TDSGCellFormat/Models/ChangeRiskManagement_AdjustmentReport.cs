using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("ChangeRiskManagement_AdjustmentReport")]
    public class ChangeRiskManagement_AdjustmentReport
    {
       
        [Key]
        public int ChangeRiskManagementId { get; set; }

        public int AdjustMentReportId { get; set; }

        public string? Changes { get; set; }

        public int? FunctionId { get; set; }

        public string? RisksWithChanges { get; set; }

        public string? Factors { get; set; }

        public string? CounterMeasures { get; set; }

        public DateOnly? DueDate { get; set; }

        public int? PersonInCharge { get; set; }

        public string? Results { get; set; }

        public string? Status { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }

        [ForeignKey("AdjustMentReportId")]
        public virtual AdjustmentReport? AdjustmentReport { get; set; }
        [ForeignKey("FunctionId")]
        public virtual FunctionMaster? FunctionMaster { get; set; }
    }
}
