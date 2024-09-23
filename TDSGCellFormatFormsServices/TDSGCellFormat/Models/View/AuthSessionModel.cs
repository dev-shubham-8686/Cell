namespace TDSGCellFormat.Models.View
{
    public class AuthSessionModel
    {
        public int AuthSessionId { get; set; }
        public string EmailId { get; set; }
        public string TenentID { get; set; }
        public string APIKeyId { get; set; }
        public Nullable<System.DateTime> StartDateTime { get; set; }
        public Nullable<System.DateTime> EndDateTime { get; set; }
        public Nullable<bool> IsExpired { get; set; }
    }
}
