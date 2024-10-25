using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("CellDivisionRoleMaster")]
public class CellDivisionRoleMaster
{
    [Key]
    public int CellDivisionId { get; set; }
    public int? DivisionId { get; set; }
    public string? FormName { get; set; }
    public int? Head { get; set; }
    public int? DeputyDivisionHead { get; set; }
    public bool? IsActive { get; set; }
}

