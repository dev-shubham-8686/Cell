using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Interface.Service
{
    public interface ITechnicalInstructionService : IBaseService<TechnicalInstructionSheet>
    {
        IQueryable<TechnicalInstructionAdd> GetAll();
        TechnicalInstructionAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd report);
    }
}
