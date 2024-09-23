using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IMatrialConsumptionRepository : IBaseRepository<MaterialConsumptionSlip>
    {
        IQueryable<MaterialConsumptionAdd> GetAll();
        MaterialConsumptionAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionAdd report);
    }
}
