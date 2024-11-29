using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("TechnicalOutlineAttachment")]
    public partial class TechnicalOutlineAttachment
    {
        [Key]
        public int TechnicalOutlineAttachmentId { get; set; }
        public int? TechnicalId { get; set; }

        public string? DocumentName { get; set; }

        public string? DocumentFilePath { get; set; }

        public bool? IsDeleted { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
