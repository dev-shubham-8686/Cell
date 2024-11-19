
using Newtonsoft.Json;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Models.Add
{
    public class AdjustMentReportRequest
    {
        public int AdjustMentReportId { get; set; }

        public List<int>? Area { get; set; }

        public int? MachineName { get; set; }

        public List<int>? SubMachineName { get; set; }

        public string? ReportNo { get; set; }

        public string? RequestBy { get; set; }

        public int? EmployeeId { get; set; }

        public int? CheckedBy { get; set; }

        public string? DescribeProblem { get; set; }

        public string? Observation { get; set; }

        public string? RootCause { get; set; }

        public string? AdjustmentDescription { get; set; }

        public Photos? Photos { get; set; }

        public bool? ChangeRiskManagementRequired { get; set; }

        public List<ChangeRiskManagement_AdjustmentReports>? ChangeRiskManagement_AdjustmentReport { get; set; }

        public string? ConditionAfterAdjustment { get; set; }

        public string? WorkFlowStatus { get; set; }

        public string? Status { get; set; }

        public bool? IsSubmit { get; set; }

        public bool? IsAmendReSubmitTask { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }
    }

    public class ChangeRiskManagement_AdjustmentReports
    {
        public int ChangeRiskManagementId { get; set; }
        public int? AdjustMentReportId { get; set; }
        public string? Changes { get; set; }
        public string? FunctionId { get; set; }
        public string? RiskAssociated { get; set; }
        public string? Factor { get; set; }
        public string? CounterMeasures { get; set; }
        public string? DueDate { get; set; }
        public int? PersonInCharge { get; set; }
        public string? Results { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

    public class ApproveAsktoAmend
    {
        public int? ApproverTaskId { get; set; }

        public int CurrentUserId { get; set; }

        public ApprovalStatus Type { get; set; }

        public string? Comment { get; set; }

        public int AdjustmentId { get; set; }

        public int? AdvisorId { get; set; }

        [JsonProperty("additionalDepartmentHeads")]
        public List<AdditionalDepartmentHeads> AdditionalDepartmentHeads { get; set; } = new List<AdditionalDepartmentHeads>();
    }

    public class PullBackRequest
    {
        public int userId { get; set; }

        public string? comment { get; set; }

        public int AdjustmentReportId { get; set; }
    }

    public class AdditionalDepartmentHeads
    {
        [JsonProperty("departmentHead")]
        public int DepartmentHead { get; set; }

        [JsonProperty("approvalSequence")]
        public int ApprovalSequence { get; set; }
    }
}
