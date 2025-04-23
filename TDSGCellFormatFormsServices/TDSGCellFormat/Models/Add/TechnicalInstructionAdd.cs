using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models.Add
{

    public class UpdateOutlineEditor
    {
        public int TechnicalId { get; set; }
        public string? outline { get; set; }

        public string? outlineImageBytes { get; set; }
    }
    public class TechnicalInstructionAdd
    {

        public int TechnicalId { get; set; }

        public string? when { get; set; }

        public string? title { get; set; }

        public string? issueDate { get; set; }

        public string? issuedBy { get; set; }

        public string? ctiNumber { get; set; }

        public int? revisionNo { get; set; }

        public string? purpose { get; set; }

        public string? productType { get; set; }

        public double? quantity { get; set; }

        public string? outline { get; set; }

        public string? tisApplicabilityDate { get; set; }

        public string? targetClosureDate { get; set; }

        public string? lotNo { get; set; }

        public string? attachment { get; set; }
        public string? applicationStartDate { get; set; }
        public string? applicationLotNo { get; set; }
        public string? applicationEquipment { get; set; }

        public string? status { get; set; }

        public bool? isSubmit { get; set; }

        public bool? isAmendReSubmitTask { get; set; }

        //public DateTime? CreatedDate { get; set; }

        //public int? CreatedBy { get; set; }

        //public int? ModifiedBy { get; set; }

        //public DateTime? ModifiedDate { get; set; }

        //public bool? IsDeleted { get; set; }

        public List<int?> equipmentIds { get; set; }

        public List<TechnicalAttachmentAdd?> technicalAttachmentAdds { get; set; }

        public List<TechnicalOutlineAttachmentAdd> technicalOutlineAttachmentAdds { get; set; }

        public int? seqNumber { get; set; }

        public int? userId { get; set; }

        public int? sectionId { get; set; }

        public string? comment { get; set; }

        public string? otherEquipment { get; set; }
    }

    public class EquipmentMasterView
    {

        public int EquipmentId { get; set; }

        public string? EquipmentName { get; set; }

    }

    public class TechnicalAttachmentAdd
    {
        public int TechnicalAttachmentId { get; set; }

        //[Required]
        public int? TechnicalId { get; set; }

        //[Required]
        public string? DocumentName { get; set; }

        public string? DocumentFilePath { get; set; }

        public int? CreatedBy { get; set; }

        //public int? ModifiedBy { get; set; }
    }

    public class TechnicalOutlineAttachmentAdd
    {
        public int TechnicalOutlineAttachmentId { get; set; }

        //[Required]
        public int? TechnicalId { get; set; }

        //[Required]
        public string? DocumentName { get; set; }

        public string? DocumentFilePath { get; set; }

        public int? CreatedBy { get; set; }

        //public int? ModifiedBy { get; set; }
    }

    public class TechnicalInstructionCTINumberResult
    {
        [Key]
        public string? TechnicalInstructionCTINumber { get; set; }
    }

    public class TechnicalInstructionTaskMasterAdd
    {
        public int ApproverTaskId { get; set; }
        public string? FormType { get; set; }
        public int TechnicalId { get; set; }
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

    public class Technical_ApproverTaskId_dto
    {
        public int approverTaskId { get; set; }
        public int userId { get; set; }
        public string? status { get; set; }
        public int? seqNumber { get; set; }

        public bool? isSubstitute { get; set; }

    }

    public class Technical_ScrapNoteAdd
    {
        public int TechnicalId { get; set; }
        //public bool isScraped { get; set; }
        //public string? scrapTicketNo { get; set; }
        //public string? scrapRemarks { get; set; }
        public int userId { get; set; }

        public List<TechnicalClosureAttachmentAdd> technicalClosureAttachmentAdds { get; set; }
    }

    public class TechnicalClosureAttachmentAdd
    {
        public int TechnicalClosureAttachmentId { get; set; }

        //[Required]
        public int? TechnicalId { get; set; }

        //[Required]
        public string? DocumentName { get; set; }

        public string? DocumentFilePath { get; set; }

        public int? CreatedBy { get; set; }

        //public int? ModifiedBy { get; set; }
    }

    public class TechnicalExcel
    {
        public string? CTINumber { get; set; }

        public string? HasAttachments { get; set; }

        public string? IssueDate { get; set; }

        public string? Title { get; set; }

        public string? EquipmentNames { get; set; }

        public string? Requestor { get; set; }

        public string? CurrentApprover { get; set; }

        //public string? IssuedBy { get; set; }
        //public string? Department { get; set; }

        public string? TargetClosureDate { get; set; }

        public string? Status { get; set; }

        public string? RequestedDate { get; set; }
        //public string? ClosedDate { get; set; }
    }

    public class TechnicalHistoryView
    {
        public int historyID { get; set; }

        public int formID { get; set; }

        public string formType { get; set; } = null!;

        public string? actionTakenDateTime { get; set; }

        public string? status { get; set; }

        public string? actionTakenBy { get; set; }
        public int? actionTakenByUserID { get; set; }

        public string? role { get; set; }

        public string? comment { get; set; }

        public string? actionType { get; set; }

        public int? delegateUserId { get; set; }

        public bool isActive { get; set; }
    }

    public class TechnicalNumberResult
    {
        [Key]
        public string? CTINumber { get; set; }
    }

    public class GetTechnicalUser
    {
        public int employeeId { get; set; }
        public int departmentId { get; set; }
        public string departmentName { get; set; }
        public int divisionId { get; set; }
        public string divisionName { get; set; }
        public string employeeCode { get; set; }
        public string employeeName { get; set; }
        public string email { get; set; }
        public string empDesignation { get; set; }
        public string mobileNo { get; set; }
        public int departmentHeadEmpId { get; set; }
        public int divisionHeadEmpId { get; set; }
        public string costCenter { get; set; }
        public int cMRoleId { get; set; }
        public Nullable<bool> isDivHeadUser { get; set; }
        public Nullable<bool> isAdmin { get; set; }
        public int isAdminId { get; set; }
        public bool isQcTeamUser { get; set; }
        public bool isQcTeamHead { get; set; }
        public bool? isITSupportUser { get; set; }
    }


    public class TecnicalDelegateUser
    {
        public int FormId { get; set; }
        public int? UserId { get; set; }   // who is delegating(admin id)
        public int activeUserId { get; set; }     // who u want to delegate
        public int DelegateUserId { get; set; } // with whom u want to delegate
        public string? Comments { get; set; }
    }

    public class equipment_master_list
    {
        public int EquipmentId { get; set; }

        public string? EquipmentName { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public bool? IsActive { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public string? UserName { get; set; }

        public string? UpdatedUserName { get; set; }
    }

    public class equipment_master_add
    {
        public int EquipmentId { get; set; }
        public string? EquipmentName { get; set; }
        public bool? IsActive { get; set; }

        public int? UserId { get; set; }
    }
}
