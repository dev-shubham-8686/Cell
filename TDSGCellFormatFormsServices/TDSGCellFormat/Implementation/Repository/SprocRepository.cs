using System.Data.Common;
using TDSGCellFormat.Extensions;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;

namespace TDSGCellFormat.Implementation.Repository
{
    public class SprocRepository : ISprocRepository
    {
        private readonly TdsgCellFormatDivisionContext _dbContext;

        public SprocRepository(TdsgCellFormatDivisionContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DbCommand GetStoredProcedure(string name, params (string, object)[] nameValueParams)
        {
            return _dbContext
                .LoadStoredProcedure(name)
                .WithSqlParams(nameValueParams);
        }

        public DbCommand GetStoredProcedure(string? name)
        {
            return _dbContext.LoadStoredProcedure(name);
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
            _dbContext.ExceptionLog(message, "", StackTrace, webmethod, employeeId);

        }
    }
}
