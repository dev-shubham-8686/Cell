using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("MaterialConsumptionHistoryMaster")]
public partial class MaterialConsumptionHistoryMaster
{
    [Key]
    public int HistoryID { get; set; }

    public int FormID { get; set; }

    public string FormType { get; set; } = null!;

    public DateTime? ActionTakenDateTime { get; set; }

    public string? Status { get; set; }

    public int? ActionTakenByUserID { get; set; }

    public string? Role { get; set; }

    public string? Comment { get; set; }

    public string? ActionType { get; set; }

    public int? DelegateUserId { get; set; }

    public bool IsActive { get; set; }
}

