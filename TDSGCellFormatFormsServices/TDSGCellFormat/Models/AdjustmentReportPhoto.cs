using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("AdjustmentReportPhoto")]
    public class AdjustmentReportPhoto
    {
        [Key]
        public int AdjustmentReportPhotoId { get; set; }

        public int? AdjustmentReportId { get; set; }

        public string? DocumentName { get; set; }

        public string? DocumentFilePath { get; set; }

        public bool? IsOldPhoto { get; set; } = false;

        public int? SequenceId { get; set; }

        public bool? IsDeleted { get; set; } = false;

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; } = DateTime.Now;

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
