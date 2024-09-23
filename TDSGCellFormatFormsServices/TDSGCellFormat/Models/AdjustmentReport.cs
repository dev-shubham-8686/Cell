using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("AdjustmentReport")]
public partial class AdjustmentReport
{
    [Key]
    public int AdjustMentReportId { get; set; }

    public DateTime? When { get; set; }

    public string? Area { get; set; }

    public string? Line { get; set; }

    public string? MachineName { get; set; }

    public string? MachineNum { get; set; }

    public string? DescribeProblem { get; set; }

    public string? Observation { get; set; }

    public string? RootCause { get; set; }

    public string? AdjustmentSuggestion { get; set; }

    public string? Attachment { get; set; }

    public string? AdjustmentCondition { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
