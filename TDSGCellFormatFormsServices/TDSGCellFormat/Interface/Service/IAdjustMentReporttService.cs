using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using TDSGCellFormat.Models;

namespace TDSGCellFormat.Interface.Service
{
    public interface IAdjustMentReporttService : IBaseService<AdjustmentReport>
    {
        IQueryable<AdjustMentReportRequest> GetAll();

        AdjustMentReportRequest GetById(int Id);

        Task<AjaxResult> DeleteReport(int Id);

        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest report);

        Task<AjaxResult> DeleteAttachment(int Id);
    }
}
