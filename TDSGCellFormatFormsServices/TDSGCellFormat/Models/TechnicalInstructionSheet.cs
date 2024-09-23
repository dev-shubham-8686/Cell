using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("TechnicalInstructionSheet")]
public partial class TechnicalInstructionSheet
{
    [Key]
    public int TechnicalId { get; set; }

    public DateTime? When { get; set; }

    public string? Title { get; set; }

    public string? Purpose { get; set; }

    public string? ProductType { get; set; }

    public string? Quantity { get; set; }

    public string? Outline { get; set; }

    public DateTime? TISApplicable { get; set; }

    public string? Attachment { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
