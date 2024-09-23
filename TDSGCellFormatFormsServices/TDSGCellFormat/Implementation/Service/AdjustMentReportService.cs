using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;

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

        public IQueryable<AdjustMentReportAdd> GetAll()
        {
            return _adjustMentRepository.GetAll();
        }

        public AdjustMentReportAdd GetById(int Id)
        {
            return _adjustMentRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportAdd reportAdd)
        {
            //var report = _mapper.Map<AdjustmentReport>(reportAdd);
            return await _adjustMentRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
           
            return await _adjustMentRepository.DeleteReport(Id);
        }
    }
}
