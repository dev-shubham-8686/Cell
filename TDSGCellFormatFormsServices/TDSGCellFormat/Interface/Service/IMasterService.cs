using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Interface.Service
{
    public interface IMasterService
    {
        IQueryable<TroubleTypeView> GetAllTroubles();
        IQueryable<CategoryView> GetAllCategories();
        IQueryable<UnitOfMeasureView> GetAllUnitsOfMeasure();
        IQueryable<CostCenterView> GetAllCostCenters();
        IQueryable<MaterialView> GetAllMaterials();
        Task<UnitOfMeasureView> CreateUnitOfMeasure(UnitOfMeasureAdd unitOfMeasure);
        Task<UnitOfMeasureView> UpdateUnitOfMeasure(UnitOfMeasureUpdate unitOfMeasure);
        IQueryable<EmployeeMasterView> GetAllEmployees();

        IQueryable<EmployeeMasterView> GetEmployeeDetailsById(int id, string email);

        IQueryable<AreaMasterView> GetAllAreas();

        IQueryable<MachineView> GetAllMachines();
        IQueryable<SubMachineView> GetAllSubMachines();
        IQueryable<DeviceView> GetAllDevice();
        IQueryable<SubDeviceView> GetAllSubDevice();
        IQueryable<SectionView> GetAllSection();
        IQueryable<FunctionView> GetAllFunction();
        IQueryable<SectionHeadView> GetAllSections(int departmentId);

        IQueryable<EmployeeMasterView> GetCheckedBy();
    }
}
