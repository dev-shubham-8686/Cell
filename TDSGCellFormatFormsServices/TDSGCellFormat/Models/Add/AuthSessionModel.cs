namespace TDSGCellFormat.Models.Add
{
    public class AuthSessionModel
    {
        public int AuthSessionId { get; set; }
        public string? EmailId { get; set; }
        public string? TenentID { get; set; }
        public string? APIKeyId { get; set; }
        public DateTime? StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public bool? IsExpired { get; set; }
    }
    public class AuthParameter
    {
        public string? parameter { get; set; }
        public string? type { get; set; }
    }
}
