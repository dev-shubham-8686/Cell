using DocumentFormat.OpenXml.Drawing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("MaterialConsumptionSlip")]
public partial class MaterialConsumptionSlip
{
    [Key]
    public int MaterialConsumptionSlipId { get; set; }

    public string? MaterialConsumptionSlipNo { get; set; }

    public DateTime? When { get; set; }

    public string? Remarks { get; set; }
    public string? Status { get; set; }
    public bool? IsSubmit { get; set; }
    public bool? IsClosed {  get; set; }
    public string? ScrapTicketNo { get; set; }
    public string? ScrapRemarks { get; set; }
    public bool? IsDeleted { get; set; }
    public bool? IsScraped { get; set; }
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
