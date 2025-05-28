namespace TDSGCellFormat.Models.View
{
    public class GetUserDetailsView
    {
        public int employeeId { get; set; }
        public int departmentId { get; set; }
        public string departmentName { get; set; }
        public int divisionId { get; set; }
        public string divisionName { get; set; }
        public string employeeCode { get; set; }
        public string employeeName { get; set; }
        public string email { get; set; }
        public string empDesignation { get; set; }
        public string mobileNo { get; set; }
        public int departmentHeadEmpId { get; set; }
        public int divisionHeadEmpId { get; set; }
        public string costCenter { get; set; }
        public int cMRoleId { get; set; }
        public Nullable<bool> isDivHeadUser { get; set; }
        public Nullable<bool> isAdmin { get; set; }

        public Nullable<bool> isMCSAdmin { get; set; }
        public int isAdminId { get; set; }
        public bool isQcTeamUser  { get; set; }
        public bool isQcTeamHead { get; set; }
        public bool isTdsgAdmin { get; set; }
        public bool? isITSupportUser { get; set; }
    }

    public class GetEquipmentUser
    {
        public int employeeId { get; set; }
        public int departmentId { get; set; }
        public string departmentName { get; set; }
        public int divisionId { get; set; }
        public string divisionName { get; set; }
        public string employeeCode { get; set; }
        public string employeeName { get; set; }
        public string email { get; set; }
        public string empDesignation { get; set; }
        public string mobileNo { get; set; }
        public int departmentHeadEmpId { get; set; }
        public int divisionHeadEmpId { get; set; }
        public string costCenter { get; set; }
        public int cMRoleId { get; set; }
        public Nullable<bool> isDivHeadUser { get; set; }
        public Nullable<bool> isAdmin { get; set; }
        public int isAdminId { get; set; }
        public bool isQcTeamUser { get; set; }
        public bool isQcTeamHead { get; set; }
        public bool? isITSupportUser { get; set; }
    }
}
