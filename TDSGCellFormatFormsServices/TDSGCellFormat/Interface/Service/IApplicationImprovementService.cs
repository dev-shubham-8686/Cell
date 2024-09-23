using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Interface.Service
{
    public interface IApplicationImprovementService : IBaseService<ApplicationEquipmentImprovement> 
    {

        IQueryable<ApplicationImprovementAdd> GetAll();
        ApplicationImprovementAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(ApplicationImprovementAdd report);
    }
}
