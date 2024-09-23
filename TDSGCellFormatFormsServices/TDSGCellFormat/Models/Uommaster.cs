using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models;

public partial class Uommaster
{
    [Key]
    public int Uomid { get; set; }

    public int Spid { get; set; }

    public string UoMcode { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool IsActive { get; set; }

    //public virtual ICollection<AssetRequestMaster> AssetRequestMasters { get; set; } = new List<AssetRequestMaster>();

    //public virtual ICollection<PoritemDetail> PoritemDetails { get; set; } = new List<PoritemDetail>();

    //public virtual ICollection<RingiMaterialDetail> RingiMaterialDetails { get; set; } = new List<RingiMaterialDetail>();
}
