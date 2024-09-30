using TDSGCellFormat.Entities;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IAdjustMentReportRepository  :  IBaseRepository<AdjustmentReport>
    {
        IQueryable<AdjustMentReportRequest> GetAll();
        AdjustMentReportRequest GetById(int Id);
        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest report);
        Task<AjaxResult> DeleteReport(int Id);
    }
}
