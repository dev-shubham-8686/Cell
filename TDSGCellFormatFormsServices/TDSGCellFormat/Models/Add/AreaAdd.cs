namespace TDSGCellFormat.Models.Add
{
    public class AreaAdd
    {
        public string areaName {  get; set; }
    }

    public class UnitOfMeasureAdd
    {
        public string name { get; set; }

        public int? createdBy { get; set; }
    }

    public class UnitOfMeasureUpdate
    {
        public int uomId { get; set; }
        public string name { get; set; }

        public int? modifiedBy { get; set; }
    }
}
