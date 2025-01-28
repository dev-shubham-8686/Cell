using TDSGCellFormat.Models;
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
        IQueryable<SectionHeadView> GetSectionHead();
        IQueryable<FunctionView> GetAllFunction();
        IQueryable<AdvisorMasterView> GetAllAdvisorEmp();

        IQueryable<ResultMonitorView> GetAllResultMonitor();

        IQueryable<EmployeeMasterView> GetCheckedBy();

        IQueryable<EmployeeMasterView> GetAllEmployee();

        IQueryable<AdvisorMasterView> GetAllAdvisors();

        IQueryable<ImpCategoryView> GetImprovementCategory();

        #region Master Service Interface
        IQueryable<CellDivisionRoleView> GetAllCellDivisionRoles();

        IQueryable<CPCGroupMasterView> GetAllCPCGroups();

        IQueryable<EquipmentMasterView1> GetAllEquipments();

        IQueryable<SectionHeadEmpView> GetAllSectionHeadEmps();

        //-->Task<AreaAdd> AddUpdateAreaMaster(AreaAdd area);

        Task<CategoryAdd> AddUpdateCategoryMaster(CategoryAdd category);
        Task<CostCenterAdd> AddUpdateCostCenterMaster(CostCenterAdd costCenter);

        Task<CellDivisionRoleMasterAdd> AddUpdateCellDivisionRoleMaster(CellDivisionRoleMasterAdd cellDivisionRole);

        Task<CPCGroupMasterAdd> AddUpdateCPCGroupMaster(CPCGroupMasterAdd cPCGroupMasterAdd);

        Task<DeviceAdd> AddUpdateDeviceMaster(DeviceAdd deviceAdd);

        Task<SubDeviceAdd> AddUpdateSubDeviceMaster(SubDeviceAdd subDeviceAdd);

        Task<EquipmentMasterAdd> AddUpdateEquipmentMaster(EquipmentMasterAdd equipmentMasterAdd);

        Task<MachineAdd> AddUpdateMachineMaster(MachineAdd machineAdd);

        Task<SubMachineAdd> AddUpdateSubMachineMaster(SubMachineAdd subMachineAdd);

        Task<MaterialAdd> AddUpdateMaterialMaster(MaterialAdd materialAdd);

        Task<ResultMonitoringMasterAdd> AddUpdateResultMonitoringMaster(ResultMonitoringMasterAdd resultMonitoringMasterAdd);

        //Task<FunctionMasterAdd> AddUpdateFunctionMaster(FunctionMasterAdd functionMasterAdd);

        Task<SectionHeadEmpMasterAdd> AddUpdateSectionHeadEmpMaster(SectionHeadEmpMasterAdd sectionHeadEmpMasterAdd);

        Task<SectionMasterAdd> AddUpdateSectionMaster(SectionMasterAdd sectionMasterAdd);

        Task<TroubleTypeAdd> AddUpdateTroubleTypeMaster(TroubleTypeAdd troubleTypeAdd);

        Task<UnitOfMeasureDtoAdd> AddUpdateUnitOfMeasureMaster(UnitOfMeasureDtoAdd unitOfMeasure);

        IQueryable<AreaDtoAdd> GetAllAreaMaster();

        IQueryable<CategoryAdd> GetAllCategoryMaster();

        IQueryable<CellDivisionRoleMaster> GetAllCellDivisionRoleMaster();

        IQueryable<CPCGroupMaster> GetAllCPCGroupMaster();

        IQueryable<DeviceMaster> GetAllDeviceMaster();

        IQueryable<SubDeviceMaster> GetAllSubDeviceMaster();

        IQueryable<EquipmentMaster> GetAllEquipmentMaster();

        IQueryable<MachineAdd> GetAllMachineMaster();

        IQueryable<SubMachineAdd> GetAllSubMachineMaster();

        IQueryable<MaterialAdd> GetAllMaterialMaster();

        IQueryable<ResultMonitoringMaster> GetAllResultMonitoringMaster();

        IQueryable<FunctionMaster> GetAllFunctionMaster();

        IQueryable<SectionHeadEmpMasterAdd> GetAllSectionHeadEmpMaster();

        IQueryable<SectionMasterAdd> GetAllSectionMaster();

        IQueryable<TroubleType> GetAllTroubleTypeMaster();

        IQueryable<UnitOfMeasure> GetAllUnitOfMeasureMaster();

        Task<bool> DeleteAreaMaster(int areaId);

        Task<bool> DeleteCategory(int areaId);
        Task<bool> DeleteCostCenter(int id);

        Task<bool> DeleteCellDivisionRole(int areaId);

        Task<bool> DeleteCPCGroup(int areaId);

        Task<bool> DeleteDevice(int areaId);

        Task<bool> DeleteSubDevice(int areaId);

        Task<bool> DeleteEquipment(int areaId);

        Task<bool> DeleteMachine(int areaId);

        Task<bool> DeleteSubMachine(int areaId);

        Task<bool> DeleteMaterial(int areaId);

        Task<bool> DeleteResultMonitoring(int areaId);

        Task<bool> DeleteFunction(int areaId);

        Task<bool> DeleteSectionHeadEmp(int areaId);

        Task<bool> DeleteSection(int areaId);

        Task<bool> DeleteTroubleType(int areaId);

        Task<bool> DeleteUnitOfMeasure(int areaId);

        IQueryable<DivisionMaster> GetAllDivisionMasterSelection();
        IQueryable<SubDeviceMaster> GetAllSubDeviceMasterSelection();
        IQueryable<CostCenterAdd> GetAllCostCenterSelection();
        IQueryable<UnitOfMeasure> GetAllUOMSelection();
        IQueryable<MasterEmployeeSelection> GetAllMasterEmployeeSelection();
        IQueryable<SectionMaster> GetAllSectionMasterSelection();
        IQueryable<Category> GetAllCategorySelection();

        Task<AreaDtoAdd> AddUpdateAreaTableMaster(AreaDtoAdd area);
        #endregion
    }
}
