using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("MaterialConsumptionSlipItem")]
public class MaterialConsumptionSlipItem
{
    [Key]
    public int MaterialConsumptionSlipItemId { get; set; }

    [Required]
    public int MaterialConsumptionSlipId { get; set; }

    public int? CategoryId { get; set; }

    public int? MaterialId { get; set; }

    public double? Quantity { get; set; }

    public string? GLCode { get; set; }

    public string? Purpose { get; set; }

    public bool? IsDeleted { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<MaterialConsumptionSlipItemAttachment> Attachments { get; set; } = new List<MaterialConsumptionSlipItemAttachment>();
}
