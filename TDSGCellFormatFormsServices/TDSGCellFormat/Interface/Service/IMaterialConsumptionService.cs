using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Interface.Service
{
    public interface IMaterialConsumptionService : IBaseService<MaterialConsumptionSlip>
    {
        IQueryable<MaterialConsumptionAdd> GetAll();
        MaterialConsumptionAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionAdd report);
    }
}
