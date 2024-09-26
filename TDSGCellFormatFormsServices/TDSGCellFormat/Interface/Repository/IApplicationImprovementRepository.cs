using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IApplicationImprovementRepository : IBaseRepository<EquipmentImprovementApplication>
    {
        IQueryable<EquipmentImprovementApplicationAdd> GetAll();
        EquipmentImprovementApplicationAdd GetById(int Id);
        Task<AjaxResult> AddOrUpdateReport(EquipmentImprovementApplicationAdd report);
        Task<AjaxResult> DeleteReport(int Id);
        Task<List<EquipmentImprovementView>> GetEqupimentImprovementList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);

    }
}
