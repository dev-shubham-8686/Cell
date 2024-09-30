namespace TDSGCellFormat.Models.Add
{
    public class EquipmentImprovementApplicationAdd
    {
        public int EquipmentImprovementId { get; set; }

        public string when { get; set; }

        public List<int>? deviceName { get; set; }

        public string? purpose { get; set; }

        public string? currentSituation { get; set; }

        public string? improvement { get; set; }

        public string? attachment { get; set; }
        public string? targetDate { get; set; }
        public string? actualDate {  get; set; }
        public string? resultStatus { get; set; }
        public string? pcrnDocName { get; set; }
        public string? pcrnFilePath { get; set; }
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
        public string? currSituationDocName { get; set; }
        public string? currSituationDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }


    public class EquipmentImprovementAttachData
    {
        public int EquipmentImprovementAttachmentId { get; set; }
        public int? EquipmentImprovementId { get; set; }
        public string? improvementDocName { get; set; }
        public string? improvementDocFilePath { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

    public class ChangeRiskManagementData
    {
        public int ChangeRiskManagementId { get; set; }
        public int? ApplicationImprovementId { get; set; }
        public string? changes { get; set; }
        public int? functionId { get; set; }
        public string? riskAssociated { get; set; }
        public string? factor { get; set; }
        public string? counterMeasures { get; set; }
        public string? dueDate { get; set; }
        public int? personInCharge { get; set; }
        public string? results { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }

    }

}
