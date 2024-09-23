using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("DivisionMaster")]

public class DivisionMaster
{
    [Key]
    public int DivisionID { get; set; }
    public int SPID { get; set; }
    public string ShortCode { get; set; }
    
    public string Name { get; set; }
   
    public int? Head { get; set; }
    public int? DeputyDivisionHead { get; set; }
    public bool? IsActive { get; set; }
    public virtual EmployeeMaster? EmployeeMasters { get; set; }
    public virtual DepartmentMaster? DepartmentMasters { get; set; }
}

