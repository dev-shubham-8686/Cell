using TDSGCellFormat.Models;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.View;
namespace TDSGCellFormat.Interface.Service
{
    public interface IMasterService
    {
        IQueryable<TroubleTypeView> GetAllTroubles();
        IQueryable<CategoryView> GetAllCategories();
        IQueryable<UnitOfMeasureView> GetAllUnitsOfMeasure();
        IQueryable<MaterialView> GetAllMaterials();
        IQueryable<EmployeeMasterView> GetAllEmployees();

        IQueryable<EmployeeMasterView> GetEmployeeDetailsById(int id, string email);

        IQueryable<AreaMasterView> GetAllAreas();

        IQueryable<MachineView> GetAllMachines();

        IQueryable<MachineView> GetAllSubMachines(int machineId);
    }
}
