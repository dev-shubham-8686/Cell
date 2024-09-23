using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;

namespace TDSGCellFormat.Implementation.Service
{
    public class MaterialConsumptionService : BaseService<MaterialConsumptionSlip>, IMaterialConsumptionService
    {
        private readonly IMatrialConsumptionRepository _materialRepository;
        

        public MaterialConsumptionService(IMatrialConsumptionRepository materialRepository)
          : base(materialRepository)
        {
            this._materialRepository = materialRepository;
           
        }

        public IQueryable<MaterialConsumptionAdd> GetAll()
        {
            return _materialRepository.GetAll();
        }

        public MaterialConsumptionAdd GetById(int Id)
        {
            return _materialRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionAdd reportAdd)
        {
            //var report = _mapper.Map<MaterialConsumptionSlip>(reportAdd);
            return await _materialRepository.AddOrUpdateReport(reportAdd);
        }
        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _materialRepository.DeleteReport(Id);
        }
    }
}
