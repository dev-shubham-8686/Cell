using Microsoft.Kiota.Abstractions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models

{
    [Table("CellSubstituteMaster")]
    public class CellSubstituteMaster
    {
        [Key]
        public int SubstituteID { get; set; }
        public int? EmployeedID { get; set; }
        public int? SubstituteUserID { get; set; }
        public bool? IsSubstitute { get; set; }
            
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? FormName { get; set; }
    }
}
