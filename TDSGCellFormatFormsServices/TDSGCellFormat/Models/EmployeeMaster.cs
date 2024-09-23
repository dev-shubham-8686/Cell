using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("EmployeeMaster")]
public partial class EmployeeMaster
{
    [Key]
    public int EmployeeID { get; set; }

    public int SPID { get; set; }

    public int DepartmentID { get; set; }

    public int? ReportingManagerId { get; set; }

    public string PlantId { get; set; } = null!;

    public string EmployeeCode { get; set; } = null!;

    public string EmployeeName { get; set; } = null!;

    public string? CostCenter { get; set; }

    public bool IsAdmin { get; set; }

    public bool IsActive { get; set; }

    public string? Email { get; set; }

    public int? RoleId { get; set; }

    public int? CmroleId { get; set; }

    public bool? IsDirector { get; set; }

    public DateTime? EmpCreatedDate { get; set; }

    public DateTime? EmpModifiedDate { get; set; }

    public string? EmpDesignation { get; set; }

    public string? EmpContact { get; set; }

    public string? EmpSecondaryEmail { get; set; }

    public DateTime? JoiningDate { get; set; }

    public DateTime? TerminationDate { get; set; }

    public DateTime? MarriageDate { get; set; }

    public DateTime? EmpBirthDate { get; set; }

    public string? EmployeeType { get; set; }

    public bool? IsVendorSync { get; set; }

    //public bool? IsMatrixSync { get; set; }

    //public virtual ICollection<CostCenterMaster> CostCenterMasters { get; set; } = new List<CostCenterMaster>();

   // public virtual DepartmentMaster Department { get; set; } = null!;

    //public virtual ICollection<DepartmentMaster> DepartmentMasters { get; set; } = new List<DepartmentMaster>();

    //public virtual ICollection<DivisionMaster> DivisionMasters { get; set; } = new List<DivisionMaster>();

    //public virtual ICollection<PaymentInvoiceDetail> PaymentInvoiceDetailCreatedByNavigations { get; set; } = new List<PaymentInvoiceDetail>();

    //public virtual ICollection<PaymentInvoiceDetail> PaymentInvoiceDetailModifiedByNavigations { get; set; } = new List<PaymentInvoiceDetail>();

    //public virtual ICollection<PaymentRequestMaster> PaymentRequestMasters { get; set; } = new List<PaymentRequestMaster>();

    //public virtual RoleMaster? Role { get; set; }

    //public virtual ICollection<SubstituteMaster> SubstituteMasters { get; set; } = new List<SubstituteMaster>();

    //public virtual ICollection<VisitorContactPersonDetail> VisitorContactPersonDetails { get; set; } = new List<VisitorContactPersonDetail>();

    //public virtual ICollection<VisitorRequestMaster> VisitorRequestMasters { get; set; } = new List<VisitorRequestMaster>();
}
