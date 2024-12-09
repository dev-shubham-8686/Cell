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

    public DateTime? IssueDate { get; set; }

    public string? IssuedBy { get; set; }

    public string? CTINumber { get; set; }

    public int? RevisionNo { get; set; }

    public string? Purpose { get; set; }

    public string? ProductType { get; set; }

    public double? Quantity { get; set; }

    public string? Outline { get; set; }

    public DateTime? TISApplicable { get; set; }

    public DateTime? TargetClosureDate { get; set; }

    public string? LotNo { get; set; }

    public string? Attachment { get; set; }
    public DateTime? ApplicationStartDate { get; set; }

    public string? ApplicationLotNo { get; set; }

    public string? ApplicationEquipment { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public bool? IsClosed { get; set; }

    public DateTime? ClosedDate { get; set; }

    public bool? IsReOpen { get; set; }

    public int? TechnicalReviseId { get; set; }

    public int? OldCreatedBy { get; set; }

    public string? OutlineImageBytes { get; set; }

    public string? OtherEquipment { get; set; }
}
