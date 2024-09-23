using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Interface.Service
{
    public interface IAdjustMentReporttService : IBaseService<AdjustmentReport>
    {
        IQueryable<AdjustMentReportAdd> GetAll();
        AdjustMentReportAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportAdd report);
    }
}
