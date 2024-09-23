using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("TroubleReports")]
public partial class TroubleReports
{
    [Key]
    public int TroubleReportId { get; set; }
    public int? TroubleReviseId { get; set; }
    public string? TroubleReportNo { get; set; }
    public string? OtherTroubleType { get; set; }
    public DateTime? When { get; set; }

    public string? BreakDownMin { get; set; }

    public string? ReportTitle { get; set; }

    public string? Process { get; set; }

    public string? ProcessingLot { get; set; }

    public bool? NG { get; set; }

    public string? PHLotAndQuantity { get; set; }
    public string? NGLotAndQuantity { get; set; }


    public bool? ProductHold { get; set; }

    public string? TroubleType { get; set; }

    public string? EmployeeId { get; set; }

    public bool? Restarted { get; set; }

    public string? TroubleBriefExplanation { get; set; }
    public string? PermanantCorrectiveAction { get; set; }
    public string? ImmediateCorrectiveAction { get; set; }

    public DateTime? PCA { get; set; }

    public DateTime? Closure { get; set; }

    public string? RootCause { get; set; }

    public bool? IsAdjustMentReport { get; set; }

    public string? AdjustmentReport { get; set; }

    public DateTime? CompletionDate { get; set; }
    public string? Remarks { get; set; }
    public string? Status { get; set; }
    public bool? IsActive {  get; set; }
    public bool? IsReOpen { get; set; }
    public string? WorkFlowStatus { get; set; }
    public bool? IsSubmit { get; set; }
    public bool? IsReview {  get; set; }
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? WorkSubmittedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? ICADate { get; set; }

    public DateTime? RCADate { get; set; }
    public int? RaiserEmailSent { get; set; }
    public int? ManagerEmailSent { get; set; }
    public int? DepartMentHeadEmailSent { get; set; }
    public DateTime? LastEmailSent { get; set; }
    public int? RaiseEmailRCA { get; set; }
    public int? ManagerEmailRCA { get; set; }
    public int? DepartMentHeadEmailRCA { get; set; }
    public DateTime? LastRCAEmailSent { get; set; }
    public int? DivisionHeadEmailSent { get; set; }
    public int? DivisionHeadRCAEmail { get; set; }

    public int? ReportLevel { get; set; }
    public virtual ICollection<TroubleReportApproverTaskMaster> TroubleReportApproverTaskMasters { get; set; } = new List<TroubleReportApproverTaskMaster>();

    public virtual ICollection<WorkDoneDetail> WorkDoneDetails { get; set; } = new List<WorkDoneDetail>();
}
