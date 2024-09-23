using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Implementation.Service
{
    public class TechnicalInstructionService : BaseService<TechnicalInstructionSheet>, ITechnicalInstructionService
    {
        private readonly ITechnicalInsurtuctionRepository _technicalRepository;
        

        public TechnicalInstructionService(ITechnicalInsurtuctionRepository technicalRepository)
          : base(technicalRepository)
        {
            this._technicalRepository = technicalRepository;
          
        }

        public IQueryable<TechnicalInstructionAdd> GetAll()
        {
            return _technicalRepository.GetAll();
        }

        public TechnicalInstructionAdd GetById(int Id)
        {
            return _technicalRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd reportAdd)
        {
            //var report = _mapper.Map<TechnicalInstructionSheet>(reportAdd);
            return await _technicalRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _technicalRepository.DeleteReport(Id);
        }
    }
}
