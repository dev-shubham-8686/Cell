using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Models.View
{
    public class TechnicalInstructionView
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
        public List<int?> equipmentIds { get; set; }
        public List<TechnicalAttachmentAdd?> technicalAttachmentAdds { get; set; }
        public List<TechnicalOutlineAttachmentAdd?> technicalOutlineAttachmentAdds { get; set; }
        public List<TechnicalClosureAttachmentAdd?> technicalClosureAttachmentAdds { get; set; }
        public bool? isClosed { get; set; }
        public int? seqNumber { get; set; }
        public int? userId { get; set; }
        public int? sectionId { get; set; }
        public string requestor { get; set; }
        public string department { get; set; }
        public int? sectionHead { get; set; }
        public string? employeeCode { get; set; }
        public string? createdDate { get; set; }

        public string? otherEquipment { get; set; }
    }

    public class TechnicalInstructionDto
    {
        public int TechnicalId { get; set; }   // Primary Key from MaterialConsumptionSlip table
        public string? RequestNo { get; set; }                // Request No
        public DateTime Date { get; set; }                   // Date of the request
        //public string? Remarks { get; set; }                  // Remarks
        public string? Department { get; set; }
        // From MaterialConsumptionSlipItem table
        //public int MaterialConsumptionItemId { get; set; }   // Primary Key from MaterialConsumptionSlipItem table
        //public string? Category { get; set; }             // Category from Category Master
        //public string? MaterialNo { get; set; }               // Material No
        //public string? MaterialDescription { get; set; }      // Material Description from Material Master
        //public string? UOM { get; set; }
        //public string? CostCenter { get; set; }
        //public string? GLCode { get; set; }
        public string? Title { get; set; }
        public decimal Quantity { get; set; }                // Quantity of the material
        public string? Purpose { get; set; }                  // Purpose of the material

        // Additional fields, if necessary
    }

    public class SectionHeadSelectionView
    {
        public int sectionHeadId { get; set; }
        public int? head { get; set; }
        public string? headName { get; set; }
        public string? sectionName { get; set; }
    }

    public class TechnicalEmployeeMasterView
    {

        public int EmployeeID { get; set; }

        public string? EmployeeName { get; set; }

        public string? Email { get; set; }

    }

    public class NotifyCellDivPartView
    {
        public string? emails { get; set; }

        public object? pdf { get; set; }
    }

}
