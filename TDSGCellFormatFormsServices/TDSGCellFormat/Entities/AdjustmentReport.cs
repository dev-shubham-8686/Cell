using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Entities;

[Table("AdjustmentReport")]
public partial class AdjustmentReport
{
    [Key]
    public int AdjustMentReportId { get; set; }

    public string? Area { get; set; }

    public string? MachineName { get; set; }

    public string? SubMachineName { get; set; }

    public string? ReportNo { get; set; }

    public string? RequestBy { get; set; }

    public string? CheckedBy { get; set; }

    public string? DescribeProblem { get; set; }

    public string? Observation { get; set; }

    public string? RootCause { get; set; }

    public string? AdjustmentDescription { get; set; }

    public string? Photos { get; set; }

    public string? ConditionAfterAdjustment { get; set; }

    public string? WorkFlowStatus { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public bool? IsDeleted { get; set; }
}
