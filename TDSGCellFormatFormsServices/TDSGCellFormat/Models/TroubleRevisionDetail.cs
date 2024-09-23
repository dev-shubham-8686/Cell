using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("TroubleRevisionDetail")]
public partial class TroubleRevisionDetail
{
    [Key]
    public int TroubleRevisionId { get; set; }

    public int? TroubleReportId { get; set; }

    public string? TroubleRevisionNo { get; set; }

    public bool? IsReSubmit { get; set; }

    public DateTime? When { get; set; }

    public string? BreakDownMin { get; set; }

    public string? ReportTitle { get; set; }

    public string? Process { get; set; }

    public string? ProcessingLot { get; set; }

    public bool? NG { get; set; }

    public string? LotAndQuantity { get; set; }

    public bool? ProductHold { get; set; }

    public string? TroubleType { get; set; }

    public bool? Restarted { get; set; }

    public string? TroubleBriefExplanation { get; set; }

    public string? ImmediateCorrectiveAction { get; set; }

    public string? Closure { get; set; }

    public string? RootCause { get; set; }

    public string? AdjustmentReport { get; set; }

    public DateTime? CompletionDate { get; set; }

    public string? Attachment { get; set; }

    public string? Status { get; set; }

    public bool? IsDeleted { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
