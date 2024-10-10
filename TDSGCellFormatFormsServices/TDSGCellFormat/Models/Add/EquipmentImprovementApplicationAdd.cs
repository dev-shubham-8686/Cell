namespace TDSGCellFormat.Models.Add
{
    public class EquipmentImprovementApplicationAdd
    {
        public int? EquipmentImprovementId { get; set; }
        public string? EquipmentImprovementNo { get; set; }
        public string? When { get; set; }

        public int? MachineName { get; set; }
        public List<int>? SubMachineName { get; set; }
        public int? SectionId { get; set; }
        public string? Purpose { get; set; }
        public string? ImprovementName { get; set; }
        public string? CurrentSituation { get; set; }

        public string? Improvement { get; set; }

        public string? Attachment { get; set; }
        public string? TargetDate { get; set; }
        public string? ActualDate {  get; set; }
        public string? ResultStatus { get; set; }
        public string? PcrnDocName { get; set; }
        public string? PcrnFilePath { get; set; }
        public string? Status { get; set; }

        public bool? IsSubmit { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsDeleted { get; set; }

        public List<EquipmentCurrSituationAttachData>? EquipmentCurrSituationAttachmentDetails { get; set; }
        public List<EquipmentImprovementAttachData>? EquipmentImprovementAttachmentDetails { get; set; }
        public List<ChangeRiskManagementData>? ChangeRiskManagementDetails { get; set; }

    }

    public class EquipmentCurrSituationAttachData
    {
        public int EquipmentCurrSituationAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? CurrSituationDocName { get; set; }
        public string? CurrSituationDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }


    public class EquipmentImprovementAttachData
    {
        public int EquipmentImprovementAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? ImprovementDocName { get; set; }
        public string? ImprovementDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

    public class ChangeRiskManagementData
    {
        public int ChangeRiskManagementId { get; set; }
        public int? ApplicationImprovementId { get; set; }
        public string? Changes { get; set; }
        public int? FunctionId { get; set; }
        public string? RiskAssociated { get; set; }
        public string? Factor { get; set; }
        public string? CounterMeasures { get; set; }
        public string? DueDate { get; set; }
        public int? PersonInCharge { get; set; }
        public string? Results { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

}
