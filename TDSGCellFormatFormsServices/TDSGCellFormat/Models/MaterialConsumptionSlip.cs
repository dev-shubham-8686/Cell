using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("MaterialConsumptionSlip")]
public partial class MaterialConsumptionSlip
{
    [Key]
    public int MaterialConsumptionSlipId { get; set; }

    public DateTime? When { get; set; }

    public int? Category { get; set; }

    public int? MaterialNumber { get; set; }

    public string? GLCode { get; set; }

    public string? CostCenter { get; set; }

    public string? Description { get; set; }

    public string? Quantity { get; set; }

    public int? UOMId { get; set; }

    public string? Purpose { get; set; }

    public string? Attachment { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
