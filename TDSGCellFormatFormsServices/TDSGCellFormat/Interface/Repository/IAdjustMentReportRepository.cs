using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IAdjustMentReportRepository  :  IBaseRepository<AdjustmentReport>
    {
        IQueryable<AdjustMentReportAdd> GetAll();
        AdjustMentReportAdd GetById(int Id);
        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportAdd report);
        Task<AjaxResult> DeleteReport(int Id);
    }
}
