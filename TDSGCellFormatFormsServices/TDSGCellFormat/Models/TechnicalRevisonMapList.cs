using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("TechnicalRevisonMapList")]
    public class TechnicalRevisonMapList
    {
        [Key]
        public int? TechnialRevisionMapId { get; set; }

        public int? TechnicalId { get; set; }

        public int? UserId { get; set; }
    }
}
