using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Entities;

namespace TDSGCellFormat.Interface.Service
{
    public interface IAdjustMentReporttService : IBaseService<AdjustmentReport>
    {
        IQueryable<AdjustMentReportRequest> GetAll();

        AdjustMentReportRequest GetById(int Id);

        Task<AjaxResult> DeleteReport(int Id);

        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest report);
    }
}
