using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("AdjustmentAdditionalDepartmentHeadMaster")]
    public class AdjustmentAdditionalDepartmentHeadMaster
    {
        [Key]
        public int AdditionalDepartmentHeadId { get; set; }

        public int EmployeeId { get; set; }

        public int AdjustmentReportId { get; set; }

        public int DepartmentHeadId { get; set; }

        public int ApprovalSequence { get; set; }

        public int WorkFlowlevel { get; set; }

        public bool IsActive { get; set; }
    }
}
