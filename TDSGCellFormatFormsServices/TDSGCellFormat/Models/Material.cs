using DocumentFormat.OpenXml.Presentation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("Material")]
public partial class Material
{
    [Key]
    public int MaterialId { get; set; }

    public string? Code { get; set; }

    public string Description { get; set; }

    public int UOM {  get; set; }

    public int Category { get; set; }

    public int CostCenter { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }
}
