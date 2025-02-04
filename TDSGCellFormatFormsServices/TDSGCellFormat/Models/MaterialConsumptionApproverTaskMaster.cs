using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("MaterialConsumptionApproverTaskMaster")]
public class MaterialConsumptionApproverTaskMaster
{
    [Key]
    public int ApproverTaskId { get; set; }

    public string FormType { get; set; } = null!;

    public int MaterialConsumptionId { get; set; }

    public int? AssignedToUserId { get; set; }

    public int? DelegateUserId { get; set; }

    public int? DelegateBy { get; set; }

    public DateTime? DelegateOn { get; set; }

    public string? Status { get; set; }

    public string? Role { get; set; }

    public string? DisplayName { get; set; }

    public int SequenceNo { get; set; }

    public string? Comments { get; set; }

    public int? ActionTakenBy { get; set; }

    public DateTime? ActionTakenDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }
}

