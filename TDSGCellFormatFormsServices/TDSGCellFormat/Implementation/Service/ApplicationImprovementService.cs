using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Implementation.Service
{
    public class ApplicationImprovementService : BaseService<ApplicationEquipmentImprovement>, IApplicationImprovementService
    {
        private readonly IApplicationImprovementRepository _applicationRepo;

        public ApplicationImprovementService(IApplicationImprovementRepository applicationRepo)
          : base(applicationRepo)
        {
            this._applicationRepo = applicationRepo;
           
        }

        public IQueryable<ApplicationImprovementAdd> GetAll()
        {
            return _applicationRepo.GetAll();
        }

        public ApplicationImprovementAdd GetById(int Id)
        {
            return _applicationRepo.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(ApplicationImprovementAdd reportAdd)
        {
            //var report = _mapper.Map<ApplicationEquipmentImprovement>(reportAdd);
            return await _applicationRepo.AddOrUpdateReport(reportAdd);
        }



        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _applicationRepo.DeleteReport(Id);
        }
    }
}
