using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IApplicationImprovementRepository : IBaseRepository<ApplicationEquipmentImprovement>
    {
        IQueryable<ApplicationImprovementAdd> GetAll();
        ApplicationImprovementAdd GetById(int Id);
        Task<AjaxResult> AddOrUpdateReport(ApplicationImprovementAdd report);
        Task<AjaxResult> DeleteReport(int Id);
    }
}
