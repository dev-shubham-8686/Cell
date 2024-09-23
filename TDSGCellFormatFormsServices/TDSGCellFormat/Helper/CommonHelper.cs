using TDSGCellFormat.Models;

namespace TDSGCellFormat.Helper
{
    public class CommonHelper
    {
        private readonly TdsgCellFormatDivisionContext _context;


        public CommonHelper(TdsgCellFormatDivisionContext context)
        {
            this._context = context;
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
    }
}
