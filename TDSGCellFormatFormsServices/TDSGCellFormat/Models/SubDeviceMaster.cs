using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;


[Table("SubDeviceMaster")]
public class SubDeviceMaster
{
    [Key]
    public int DeviceId { get; set; }

    public string? DeviceName { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual DeviceMaster? DeviceMasters { get; set; }
}

