using DocumentFormat.OpenXml.Bibliography;
using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models.Add
{
    public class MaterialConsumptionSlipAdd
    {
        public int? materialConsumptionSlipId { get; set; }

        public string? remarks { get; set; }

        public int userId { get; set; }

        public bool? isSubmit { get; set; }
        public bool? isAmendReSubmitTask { get; set; }
        public string? Comment { get; set; }
        public int? seqNumber { get; set; }
        public List<MaterialConsumptionSlipItemAdd> items { get; set; }
    }

    public class MaterialConsumptionSlipItemAdd
    {
        public int? materialConsumptionSlipItemId { get; set; }

        [Required]
        public int? categoryId { get; set; }

        [Required]
        public int? materialId { get; set; }

        [Required]
        public double? quantity { get; set; }

        public string? glCode { get; set; }

        [Required]
        public string purpose { get; set; }

        public List<MaterialConsumptionSlipItemAttachmentAdd>? attachments { get; set; }
    }

    public class MaterialConsumptionSlipItemAttachmentAdd
    {
        public int? materialConsumptionSlipItemAttachmentId { get; set; }

        [Required]
        public string name { get; set; }

        [Required]
        public string url { get; set; }
    }

    public class MaterialConsumptionApproverTaskMasterAdd
    {
        public int ApproverTaskId { get; set; }
        public string? FormType { get; set; }
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
        public System.DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool? IsActive { get; set; }

        public string? employeeName { get; set; }
        public string? employeeNameWithoutCode { get; set; }
        public string? email { get; set; }
    }

    public class ScrapNoteAdd
    {
        public int MaterialConsumptionId { get; set; }
        public bool isScraped { get; set; }
        public string? scrapTicketNo { get; set; }
        public string? scrapRemarks { get; set; }
        public int userId { get; set; }
    }

    public class MaterialExcel
    {
        public string? MaterialConsumptionSlipNo { get; set; }
        public string? Department { get; set; }
        public string? Requestor { get; set; }
        public string? WhenDate { get; set; }
        public string? Status { get; set; }
    }
}
