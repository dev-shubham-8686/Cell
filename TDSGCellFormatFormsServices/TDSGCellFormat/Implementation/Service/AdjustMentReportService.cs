using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Service
{
    public class AdjustMentReporttService : BaseService<AdjustmentReport>, IAdjustMentReporttService
    {
        private readonly IAdjustMentReportRepository _adjustMentRepository;

        public AdjustMentReporttService(IAdjustMentReportRepository tdsgRepository)
          : base(tdsgRepository)
        {
            this._adjustMentRepository = tdsgRepository;
        }

        public IQueryable<AdjustMentReportRequest> GetAll()
        {
            return _adjustMentRepository.GetAll();
        }

        public AdjustMentReportRequest GetById(int Id)
        {
            return _adjustMentRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest reportAdd)
        {
            //var report = _mapper.Map<AdjustmentReport>(reportAdd);
            return await _adjustMentRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _adjustMentRepository.DeleteReport(Id);
        }

        public async Task<AjaxResult> DeleteAttachment(int Id)
        {

            return await _adjustMentRepository.DeleteAttachment(Id);
        }
    }
}
