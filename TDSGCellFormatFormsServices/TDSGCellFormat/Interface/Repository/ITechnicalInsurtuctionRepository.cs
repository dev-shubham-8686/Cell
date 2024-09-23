using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Interface.Repository
{
    public interface ITechnicalInsurtuctionRepository : IBaseRepository<TechnicalInstructionSheet>
    {
        IQueryable<TechnicalInstructionAdd> GetAll();
        TechnicalInstructionAdd GetById(int Id);
        Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd report);
        Task<AjaxResult> DeleteReport(int Id);
    }
}
