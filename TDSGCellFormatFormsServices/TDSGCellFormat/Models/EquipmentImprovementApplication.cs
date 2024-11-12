using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("EquipmentImprovementApplication")]
public partial class EquipmentImprovementApplication
{
    [Key]
    public int EquipmentImprovementId { get; set; }
    public string? EquipmentImprovementNo { get; set; }

    public DateTime? When { get; set; }
    public string? AreaId { get; set; }
    public int? SectionId  { get; set; }
    public int? SectionHeadId { get; set; }
    public int? MachineId { get; set; }

    public string? SubMachineId  { get; set; }

    public string? OtherSubMachine { get; set; }
    public string? ImprovementName { get; set; }
    public string? Purpose { get; set; }

    public string? CurrentSituation { get; set; }

    public string? Imrovement { get; set; }

    public string? Status { get; set; }
    public string? WorkFlowStatus { get; set; }
    public int? WorkFlowLevel { get; set; }
    public bool? IsSubmit { get; set; }
    public DateTime? TargetDate { get; set; }

    public DateTime? ActualDate { get; set; }

    public string? ResultStatus { get; set; }
    public string? ResultMonitoring { get; set; }
    public DateTime? ResultMonitorDate { get; set; }

    public bool? IsResultSubmit { get; set; }

    public bool? ToshibaTeamDiscussion { get; set; }

    public DateTime? ToshibaDiscussionTargetDate { get; set; }

    public string? ToshibaDicussionComment { get; set; }

    public bool? ToshibaApprovalRequired { get; set; }

    public DateTime? ToshibaApprovalTargetDate { get; set; }

    public string? ToshibaApprovalComment { get; set; }

    public bool? IsPcrnRequired { get; set; }
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<ChangeRiskManagement> ChangeRiskManagement { get; set; } = new List<ChangeRiskManagement>();
    public virtual ICollection<EquipmentCurrSituationAttachment> EquipmentCurrSituationAttachment { get; set; } = new List<EquipmentCurrSituationAttachment>();
    public virtual ICollection<EquipmentImprovementAttachment> EquipmentImprovementAttachment { get; set; } = new List<EquipmentImprovementAttachment>();

    public virtual ICollection<EquipmentAdvisorMaster> EquipmentAdvisorMaster { get; set; } = new List<EquipmentAdvisorMaster>();

    [ForeignKey("MachineId")]
    public virtual Machine? Machine { get; set; }

    [ForeignKey("SectionId")]
    public virtual SectionMaster? SectionMaster { get; set; }

}
