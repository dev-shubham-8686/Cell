using System.ComponentModel.DataAnnotations;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Models.View
{
    public class MaterialConsumptionSlipListView
    {
        public int materialConsumptionSlipId { get; set; }

        public string requestNo { get; set; }

        public int? createdBy { get; set; }

        public DateTime? createdDate { get; set; }
    }

    public class MaterialConsumptionSlipView
    {
        public int? materialConsumptionSlipId { get; set; }
        
        public string materialConsumptionSlipNo { get; set; }

        public string requestor {  get; set; }

        public string department { get; set; }

        public string? createdDate {  get; set; }

        public string remarks { get; set; }
        public string? status { get; set; }
        public int? userId { get; set; }
        public int? cpcDeptHead {  get; set; }
        public string? employeeCode { get; set; }
        public bool? isSubmit {  get; set; }
        public int? seqNumber { get; set; }
        public List<MaterialConsumptionSlipItemAdd> items { get; set; }
    }

    public class MaterialConsumptionSlipDto
    {
        public int MaterialConsumptionSlipId { get; set; }   // Primary Key from MaterialConsumptionSlip table
        public string? RequestNo { get; set; }                // Request No
        public DateTime Date { get; set; }                   // Date of the request
        public string? Remarks { get; set; }                  // Remarks
        public string? Department { get; set; }
        // From MaterialConsumptionSlipItem table
        public int MaterialConsumptionItemId { get; set; }   // Primary Key from MaterialConsumptionSlipItem table
        public string? Category { get; set; }             // Category from Category Master
        public string? MaterialNo { get; set; }               // Material No
        public string? MaterialDescription { get; set; }      // Material Description from Material Master
        public string? UOM { get; set; }
        public string? CostCenter { get; set; }
        public string? GLCode { get; set; }
        public decimal Quantity { get; set; }                // Quantity of the material
        public string? Purpose { get; set; }                  // Purpose of the material

        // Additional fields, if necessary
    }

    public class MaterialConsumptionListView
    {
        public int MaterialConsumptionSlipId { get; set; }
        public string? MaterialConsumptionSlipNo { get; set; }
        public string? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public string? Requestor {  get; set; }
        public string? Department { get; set; }
        public string? Status { get; set; } 
        public int? totalCount { get; set; }
    }

}
