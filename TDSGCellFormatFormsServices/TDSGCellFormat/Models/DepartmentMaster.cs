using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("DepartmentMaster")]

public class DepartmentMaster
{
    [Key]
    public int DepartmentID { get; set; }
    public int SPID { get; set; }
    public int CostCenterID { get; set; }
    public int DivisionID { get; set; }
    public string? Name { get; set; }
    public string? HRMSDeptName { get; set; }
    public int? Head { get; set; }
    public int PurchasingGroupID { get; set; }
    public bool? IsActive { get; set; }
    //public virtual EmployeeMaster? EmployeeMasters { get; set; }
}

