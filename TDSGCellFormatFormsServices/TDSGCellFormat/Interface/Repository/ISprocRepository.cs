using System.Data.Common;

namespace TDSGCellFormat.Interface.Repository
{
    public interface ISprocRepository
    {
        DbCommand GetStoredProcedure(string name, params (string, object)[] nameValueParams);

        DbCommand GetStoredProcedure(string? name);

        void LogException(Exception ex, string webmethod, int employeeId = 0, string data = "");
    }
}
