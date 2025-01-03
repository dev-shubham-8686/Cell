using Microsoft.EntityFrameworkCore;
using TDSGCellFormat.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace TDSGCellFormat.Helper
{
    public class CommonHelper
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _dbContext;
        private readonly IConfiguration _configuration;


        public CommonHelper(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext dbContext)
        {
            this._context = context;
            this._dbContext = dbContext;

            var basePath = Path.Combine(Directory.GetCurrentDirectory());
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = configurationBuilder.Build();

        }
        public void LogException(Exception ex, string webmethod, int employeeId = 0, string data = "")
        {
            string? StackTrace = "";
            string message = "";


            //string message = !string.IsNullOrEmpty(ex.Message) ? ex.Message : ex.InnerException.Message;
            message = ex.Message + " Inner Exception: = " + ex.InnerException?.Message;
            //string StackTrace = !string.IsNullOrEmpty(ex.Message) ? ex.StackTrace : ex.InnerException.StackTrace;
            StackTrace = ex.StackTrace + " Inner Exception Trace: = " + ex.InnerException?.StackTrace ?? null;
            StackTrace += " || Exception object: ";
            if (!string.IsNullOrEmpty(data))
            {
                StackTrace = StackTrace + " || Data:=  " + data;
            }
            _context.ExceptionLog(message, "", StackTrace, webmethod, employeeId);

        }

        public int CheckSubstituteDelegate(int userId, string formname)
        {
            var user = _dbContext.SubstituteMasters.Where(x => x.EmployeedId == userId && (x.FormName == formname) && (x.DateFrom <= DateOnly.FromDateTime(System.DateTime.Today) && x.DateTo >= DateOnly.FromDateTime(System.DateTime.Today)) && x.IsSubstitute == true).FirstOrDefault();

            if (user == null)
            {
                return userId;
            }
            else
            {
                return user.SubstituteUserId.Value;
            }


        }
        public bool CheckSubstituteDelegateCheck(int userId, string formname)
        {

            var user = _dbContext.SubstituteMasters.Where(x => x.EmployeedId == userId && (x.FormName == formname) && (x.DateFrom <= DateOnly.FromDateTime(System.DateTime.Today) && x.DateTo >= DateOnly.FromDateTime(System.DateTime.Today)) && x.IsSubstitute == true).FirstOrDefault();

            if (user == null || userId == user.SubstituteUserId.Value)
            {
                return false;
            }
            else
            {
                return true;
            }
        }


    }
}
