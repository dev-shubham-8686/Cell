using DocumentFormat.OpenXml.Office2013.Drawing.Chart;
using Org.BouncyCastle.Cms;
using System.Linq;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Implementation.Repository
{
    public class MasterService : IMasterService
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;

        public MasterService(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext)
        {
            this._context = context;
            this._cloneContext = cloneContext;
        }

        public IQueryable<AreaMasterView> GetAllAreas()
        {
            IQueryable<AreaMasterView> res = null;
            try
            {
                res = _context.Areas
                    .Where(x => x.IsActive == true)
                    .Select(x => new AreaMasterView
                    {
                        AreaId = x.AreaId,
                        AreaName = x.AreaName
                    });

            }
            catch (Exception ex)
            {

            }
            return res;
        }


        public AreaView CreateArea(AreaAdd area)
        {
            var newArea = new Area()
            {
                AreaName = area.areaName,
                IsActive = true,
            };


            return new AreaView()
            {
                areaId = newArea.AreaId,
                areaName = newArea.AreaName,
            };
        }

        public IQueryable<CostCenterView> GetAllCostCenters()
        {
            IQueryable<CostCenterView> res = _context.CostCentres.Where(x => x.IsActive == true)
                                            .Select(x => new CostCenterView
                                            {
                                                costCenterId = x.CostCentreId,
                                                name = x.Name
                                            });

            return res;
        }

        public IQueryable<TroubleTypeView> GetAllTroubles()
        {
            IQueryable<TroubleTypeView> res = _context.TroubleTypes.Where(x => x.IsActive == true)
                                            .Select(x => new TroubleTypeView
                                            {
                                                troubleId = x.TroubleId,

                                                name = x.Name
                                            });

            return res;
        }
        public IQueryable<CategoryView> GetAllCategories()
        {
            IQueryable<CategoryView> res = _context.Categories.Where(x => x.IsActive == true)
                                            .Select(x => new CategoryView
                                            {
                                                categoryId = x.CategoryId,

                                                name = x.Name
                                            });

            return res;
        }

        public IQueryable<UnitOfMeasureView> GetAllUnitsOfMeasure()
        {
            IQueryable<UnitOfMeasureView> res = _context.UnitOfMeasures.Where(x => x.IsActive == true)
                                            .Select(x => new UnitOfMeasureView
                                            {
                                                uomid = x.UOMId,

                                                name = x.Name
                                            });

            return res;
        }

        public async Task<UnitOfMeasureView> CreateUnitOfMeasure(UnitOfMeasureAdd unitOfMeasure)
        {
            var newUOM = new UnitOfMeasure()
            {
                Name = unitOfMeasure.name.Trim(),
                IsActive = true,
                CreatedBy = unitOfMeasure.createdBy,
                CreatedDate = DateTime.Now,
                ModifiedBy = unitOfMeasure.createdBy,
                ModifiedDate = DateTime.Now,
            };

            _context.UnitOfMeasures.Add(newUOM);
            await _context.SaveChangesAsync();

            return new UnitOfMeasureView()
            {
                uomid = newUOM.UOMId,
                name = newUOM.Name,
            };
        }

        public async Task<UnitOfMeasureView> UpdateUnitOfMeasure(UnitOfMeasureUpdate unitOfMeasure)
        {
            var existingUOM = _context.UnitOfMeasures.Where(x => x.UOMId == unitOfMeasure.uomId && x.IsActive == true).FirstOrDefault();
            if (existingUOM == null)
            {
                return null;
            }

            existingUOM.Name = unitOfMeasure.name.Trim();
            existingUOM.ModifiedBy = unitOfMeasure.modifiedBy;
            existingUOM.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return new UnitOfMeasureView()
            {
                uomid = existingUOM.UOMId,
                name = existingUOM.Name,
            };
        }

        public IQueryable<MaterialView> GetAllMaterials()
        {
            IQueryable<MaterialView> res = _context.Materials.Where(x => x.IsActive == true)
                                            .Select(x => new MaterialView
                                            {
                                                materialId = x.MaterialId,
                                                code = x.Code,
                                                description = x.Description,
                                                uom = x.UOM,
                                                category = x.Category,
                                                costCenter = x.CostCenter,

                                                //name = x.Name
                                            });

            return res;
        }

        public IQueryable<EmployeeMasterView> GetAllEmployees()
        {

            int divisionID = _cloneContext.DivisionMasters
                                  .Where(d => d.Name == "Cell Production")
                                  .Select(d => d.DivisionID)
                                  .FirstOrDefault();

            IQueryable<EmployeeMasterView> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true
                                            && _cloneContext.DepartmentMasters
                                              .Where(d => d.DivisionID == divisionID)
                                            .Select(d => d.DepartmentID)
                                             .Contains(x.DepartmentID)
                                              )
                                            .Select(x => new EmployeeMasterView
                                            {
                                                employeeId = x.EmployeeID,

                                                employeeName = x.EmployeeName
                                            });

            return res;
        }


        public IQueryable<AdvisorMasterView> GetAllAdvisorEmp()
        {
            IQueryable<AdvisorMasterView> res = _cloneContext.EmployeeMasters
                                      .Where(x => x.IsActive == true
                                             && x.EmpDesignation.StartsWith("Advisor") // Filter for designation
                                             && _cloneContext.DepartmentMasters
                                                .Where(d => d.DivisionID == 1)
                                                .Select(d => d.DepartmentID)
                                                .Contains(x.DepartmentID))
                                      .Select(x => new AdvisorMasterView
                                      {
                                          employeeId = x.EmployeeID,
                                          employeeName = x.EmployeeName,
                                          Email = x.Email // Assuming you want to return department as well
                                      });

            return res;
        }
        public IQueryable<EmployeeMasterView> GetEmployeeDetailsById(int id, string email)
        {
            IQueryable<EmployeeMasterView> res = _cloneContext.EmployeeMasters
                .Join(_cloneContext.DepartmentMasters, em => em.DepartmentID, dm => dm.DepartmentID, (em, dm) => new { em, dm })
                .Where(x => x.em.IsActive == true && x.dm.Name == "Cell Production" && (id <= 0 ? x.em.Email == email : x.em.EmployeeID == id))
                .Select(x => new EmployeeMasterView
                {
                    employeeId = x.em.EmployeeID,
                    employeeName = x.em.EmployeeName,
                    Email = x.em.Email,
                });

            return res;
        }


        public IQueryable<MachineView> GetAllMachines()
        {
            IQueryable<MachineView> res = _context.Machines
                .Where(x => !x.IsDeleted.HasValue || !x.IsDeleted.Value)
                .Select(x => new MachineView
                {
                    MachineId = x.MachineId,
                    MachineName = x.MachineName
                });

            return res;
        }

        public IQueryable<SubMachineView> GetAllSubMachines()
        {
            IQueryable<SubMachineView> res = _context.SubMachines.Where(x => x.IsDeleted == false)
                                              .Select(x => new SubMachineView
                                              {
                                                  MachineId = x.MachineId,
                                                  SubMachineId = x.SubMachineId,
                                                  SubMachineName = x.SubMachineName
                                              });

            return res;
        }

        public IQueryable<SectionView> GetAllSection()
        {
            IQueryable<SectionView> res = _context.SectionMasters.Where(x => x.IsActive == true)
                                            .Select(x => new SectionView
                                            {
                                                sectionId = x.SectionId,
                                                sectionName = x.SectionName
                                            });

            return res;
        }
        public IQueryable<SectionHeadView> GetSectionHead()
        {
            IQueryable<SectionHeadView> res = _context.SectionHeadEmpMasters.Where(x => x.IsActive == true)
                                            .Select(x => new SectionHeadView
                                            {
                                                sectionHeadMasterId = x.SectionHeadMasterId,
                                                sectionId = x.SectionId,
                                                sectionHeadName = x.SectionHeadName
                                            });

            return res;
        }


        public IQueryable<SubDeviceView> GetAllSubDevice()
        {
            IQueryable<SubDeviceView> res = _context.SubDeviceMaster.Where(x => x.IsActive == true)
                                            .Select(x => new SubDeviceView
                                            {
                                                deviceId = x.DeviceId,
                                                subDeviceId = x.SubDeviceId,
                                                subDeviceName = x.SubDeviceName
                                            });

            return res;

        }

        public IQueryable<FunctionView> GetAllFunction()
        {
            IQueryable<FunctionView> res = _context.FunctionMaster.Where(x => x.IsActive == true)
                                            .Select(x => new FunctionView
                                            {
                                                functionId = x.FunctionId,
                                                functionName = x.FunctionName
                                            });

            return res;

        }

        public IQueryable<DeviceView> GetAllDevice()

        {

            IQueryable<DeviceView> res = _context.DeviceMasters.Where(x => x.IsActive == true)

                                            .Select(x => new DeviceView

                                            {

                                                deviceId = x.DeviceId,



                                                deviceName = x.DeviceName

                                            });



            return res;

        }


        public IQueryable<EmployeeMasterView> GetCheckedBy()
        {
            int divisionID = _cloneContext.DivisionMasters
                                .Where(d => d.Name == "Cell Production")
                                .Select(d => d.DivisionID)
                                .FirstOrDefault();

            IQueryable<EmployeeMasterView> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true
                                            && _cloneContext.DepartmentMasters
                                              .Where(d => d.DivisionID == divisionID)
                                            .Select(d => d.DepartmentID)
                                             .Contains(x.DepartmentID)
                                              )
                                            .Select(x => new EmployeeMasterView
                                            {
                                                employeeId = x.EmployeeID,

                                                employeeName = x.EmployeeName,
                                                Email = x.Email
                                            });

            return res;
        }

        public IQueryable<EmployeeMasterView> GetAllEmployee()
        {
            IQueryable<EmployeeMasterView> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true)
                                            .Select(x => new EmployeeMasterView
                                            {
                                                employeeId = x.EmployeeID,
                                                employeeName = x.EmployeeName
                                            });

            return res;
        }

        public IQueryable<AdvisorMasterView> GetAllAdvisors()
        {
            IQueryable<AdvisorMasterView> res = _cloneContext.EmployeeMasters
                                      .Where(x => x.IsActive == true
                                             && x.EmpDesignation.Contains("Advisor") // Filter for designation
                                             && _cloneContext.DepartmentMasters
                                                .Where(d => d.DivisionID == 1)
                                                .Select(d => d.DepartmentID)
                                                .Contains(x.DepartmentID))
                                      .Select(x => new AdvisorMasterView
                                      {
                                          employeeId = x.EmployeeID,
                                          employeeName = x.EmployeeName,
                                          Email = x.Email // Assuming you want to return department as well
                                      });
            return res;
        }

        public IQueryable<ResultMonitorView> GetAllResultMonitor()
        {
            IQueryable<ResultMonitorView> res = _context.ResultMonitoringMaster.Where(x => x.IsActive == true)
                                               .Select(x => new ResultMonitorView
                                               {
                                                 resultMonitorId = x.ResultMonitoringId,
                                                 resultMonitorName = x.ResultMonitoringName
                                               });

            return res;
        }

        public IQueryable<ImpCategoryView> GetImprovementCategory()
        {
            IQueryable<ImpCategoryView> res = _context.ImprovementCategoryMasters.Where(x => x.IsDeleted == false)
                                            .Select(x => new ImpCategoryView
                                            {
                                                ImpCategoryId = x.ImprovementCategoryId,

                                                ImpCategoryName = x.ImprovementCategoryName
                                            });

            return res;
        }


        #region Master Table API Methods

        #region Master Get Methods
        //public IQueryable<ResultMonitorDtoView> GetAllResultMonitor()
        //{
        //    IQueryable<ResultMonitorDtoView> res = _context.ResultMonitoringMaster.Where(x => x.IsActive == true)
        //                                       .Select(x => new ResultMonitorDtoView
        //                                       {
        //                                           resultMonitorId = x.ResultMonitoringId,
        //                                           resultMonitorName = x.ResultMonitoringName
        //                                       });

        //    return res;
        //}

        public IQueryable<CellDivisionRoleView> GetAllCellDivisionRoles()
        {
            IQueryable<CellDivisionRoleView> res = null;
            try
            {
                res = _context.CellDivisionRoleMasters
                    .Where(x => x.IsActive == true)
                    .Select(x => new CellDivisionRoleView
                    {
                        CellDivisionId = x.CellDivisionId,
                        DivisionId = x.DivisionId,
                        Head = x.Head,
                        DeputyDivisionHead = x.DeputyDivisionHead,
                        FormName = x.FormName,
                    });

            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<CPCGroupMasterView> GetAllCPCGroups()
        {
            IQueryable<CPCGroupMasterView> res = null;
            try
            {
                res = _context.CPCGroupMasters
                    .Where(x => x.IsActive == true)
                    .Select(x => new CPCGroupMasterView
                    {
                        CPCGroupId = x.CPCGroupId,
                        Email = x.Email,
                        EmployeeId = x.EmployeeId,
                        EmployeeName = x.EmployeeName,
                    });

            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<EquipmentMasterView1> GetAllEquipments()
        {
            IQueryable<EquipmentMasterView1> res = null;
            try
            {
                res = _context.EquipmentMasters
                    .Where(x => x.IsActive == true)
                    .Select(x => new EquipmentMasterView1
                    {
                        EquipmentId = x.EquipmentId,
                        EquipmentName = x.EquipmentName,
                    });

            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SectionHeadEmpView> GetAllSectionHeadEmps()
        {
            IQueryable<SectionHeadEmpView> res = null;
            try
            {
                res = _context.SectionHeadEmpMasters
                    .Where(x => x.IsActive == true)
                    .Select(x => new SectionHeadEmpView
                    {
                        SectionHeadMasterId = x.SectionHeadMasterId,
                        SectionHeadName = x.SectionHeadName,
                        SectionHeadEmail = x.SectionHeadEmail,
                        SectionId = x.SectionId,
                        EmployeeId = x.EmployeeId,
                    });

            }
            catch (Exception ex)
            {

            }
            return res;
        }



        public IQueryable<AreaDtoAdd> GetAllAreaMaster()
        {
            IQueryable<AreaDtoAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.Areas
                    .OrderByDescending(x => x.AreaId)
                    .Select(x => new AreaDtoAdd
                {
                    AreaId = x.AreaId,
                    AreaName = x.AreaName,
                    IsActive = (bool)x.IsActive,
                    CreatedDate = x.CreatedDate,
                    CreatedBy = x.CreatedBy,
                    ModifiedDate = x.ModifiedDate,
                    ModifiedBy = x.ModifiedBy,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

      

        public IQueryable<CategoryAdd> GetAllCategoryMaster()
        {
            IQueryable<CategoryAdd> res = null;
            try
            {

                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.Categories
                    .OrderByDescending(x => x.CategoryId)
                    .Select(x => new CategoryAdd
                {
                    CategoryId = x.CategoryId,
                    CategoryName = x.Name,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    IsActive = x.IsActive,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<CellDivisionRoleMaster> GetAllCellDivisionRoleMaster()
        {
            IQueryable<CellDivisionRoleMaster> res = null;
            try
            {
                res = _context.CellDivisionRoleMasters;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<CPCGroupMaster> GetAllCPCGroupMaster()
        {
            IQueryable<CPCGroupMaster> res = null;
            try
            {
                res = _context.CPCGroupMasters;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<DeviceMaster> GetAllDeviceMaster()
        {
            IQueryable<DeviceMaster> res = null;
            try
            {
                res = _context.DeviceMasters;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SubDeviceMaster> GetAllSubDeviceMaster()
        {
            IQueryable<SubDeviceMaster> res = null;
            try
            {
                res = _context.SubDeviceMaster;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<EquipmentMaster> GetAllEquipmentMaster()
        {
            IQueryable<EquipmentMaster> res = null;
            try
            {
                res = _context.EquipmentMasters;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<MachineAdd> GetAllMachineMaster()
        {
            IQueryable<MachineAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.Machines
                    .OrderByDescending(x => x.MachineId)
                    .Select(x => new MachineAdd
                {
                    MachineId = x.MachineId,
                    MachineName = x.MachineName,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    IsActive = x.IsDeleted == false ? true : false,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SubMachineAdd> GetAllSubMachineMaster()
        {
            IQueryable<SubMachineAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.SubMachines
                    .OrderByDescending(x => x.SubMachineId)
                    .Select(x => new SubMachineAdd
                {
                    SubMachineId = x.SubMachineId,
                    SubMachineName = x.SubMachineName,
                    MachineId = x.MachineId,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    IsActive = x.IsDeleted == false ? true : false,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<MaterialAdd> GetAllMaterialMaster()
        {
            IQueryable<MaterialAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.Materials
                    .OrderByDescending(x => x.MaterialId)
                    .Select(x => new MaterialAdd
                {
                    MaterialId = x.MaterialId,
                    Code = x.Code,
                    UOM = x.UOM,
                    Description = x.Description,
                    Category =  x.Category,
                    CostCenter = x.CostCenter,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate, 
                    IsActive = (bool)x.IsActive,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null

                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<ResultMonitoringMaster> GetAllResultMonitoringMaster()
        {
            IQueryable<ResultMonitoringMaster> res = null;
            try
            {
                res = _context.ResultMonitoringMaster;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<FunctionMaster> GetAllFunctionMaster()
        {
            IQueryable<FunctionMaster> res = null;
            try
            {
                res = _context.FunctionMaster;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SectionHeadEmpMasterAdd> GetAllSectionHeadEmpMaster()
        {
            IQueryable<SectionHeadEmpMasterAdd> res = null;
            try
            {
                res = _context.SectionHeadEmpMasters.
                    Select(c => new SectionHeadEmpMasterAdd
                    {
                        SectionHeadName = c.SectionHeadName,
                        SectionHeadMasterId = c.SectionHeadMasterId,
                        EmployeeId = c.EmployeeId,
                        SectionHeadEmail = c.SectionHeadEmail,
                        SectionId = c.SectionId,
                        IsActive = c.IsActive
                    });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SectionMasterAdd> GetAllSectionMaster()
        {
            IQueryable<SectionMasterAdd> res = null;
            try
            {

                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);
                res = _context.SectionMasters
                    .OrderByDescending(x => x.SectionId)
                    .Select(x => new SectionMasterAdd 
                { 
                    SectionId = x.SectionId,
                    SectionName = x.SectionName,
                    IsActive = (bool)x.IsActive,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<ImprovementCategoryAdd> GetImpCategoryMaster()
        {
            IQueryable<ImprovementCategoryAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.ImprovementCategoryMasters
                    .OrderByDescending(x => x.ImprovementCategoryId)
                    .Select(x => new ImprovementCategoryAdd
                {
                    ImpCategoryId = x.ImprovementCategoryId,
                    ImpCategoryName = x.ImprovementCategoryName,
                    IsActive = x.IsDeleted == false ? true : false,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }


        public IQueryable<TroubleType> GetAllTroubleTypeMaster()
        {
            IQueryable<TroubleType> res = null;
            try
            {
                res = _context.TroubleTypes;
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<UnitOfMeasureDtoAdd> GetAllUnitOfMeasureMaster()
        {
            IQueryable<UnitOfMeasureDtoAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);

                res = _context.UnitOfMeasures
                    .OrderByDescending(x => x.UOMId)
                    .Select(x => new UnitOfMeasureDtoAdd 
                {
                    UOMId = x.UOMId,
                    UOMName = x.Name,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                    IsActive = x.IsActive,
                    CreatedByName = x.CreatedBy.HasValue && employeeNames.ContainsKey(x.CreatedBy.Value) ? employeeNames[x.CreatedBy.Value] : null,
                    ModifiedByName = x.ModifiedBy.HasValue && employeeNames.ContainsKey(x.ModifiedBy.Value) ? employeeNames[x.ModifiedBy.Value] : null

                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        #endregion

        #region AddOrUpdate Methods

        public Task<AreaDtoAdd> AddUpdateAreaTableMaster(AreaDtoAdd area)
        {
            try
            {
                var check_dup = _context.Areas.Where(c => c.AreaName == area.AreaName && c.AreaId != area.AreaId).FirstOrDefault();
                if (check_dup != null)
                {
                    area.AreaId = -1;
                    return Task.FromResult(area);
                }

                if (area.AreaId > 0)
                {
                    var get_record = _context.Areas.Find(area.AreaId);

                    if (get_record != null)
                    {
                        get_record.IsActive = area.IsActive;
                        get_record.AreaName = area.AreaName;
                        get_record.ModifiedBy = area.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(area);
                    }
                }
                else
                {
                    var new_record = new Area
                    {
                        AreaName = area.AreaName,
                        IsActive = area.IsActive,
                        CreatedBy = area.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.Areas.Add(new_record);
                    _context.SaveChanges();

                    area.AreaId = new_record.AreaId;

                    return Task.FromResult(area);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<CategoryAdd> AddUpdateCategoryMaster(CategoryAdd category)
        {
            try
            {
                var check_dup = _context.Categories.Where(c => c.Name == category.CategoryName && c.CategoryId != category.CategoryId).FirstOrDefault();
                if (check_dup != null)
                {
                    category.CategoryId = -1;
                    return Task.FromResult(category);
                }

                if (category.CategoryId > 0)
                {
                    var get_record = _context.Categories.Find(category.CategoryId);

                    if (get_record != null)
                    {
                        get_record.IsActive = category.IsActive;
                        get_record.Name = category.CategoryName;
                        get_record.ModifiedBy = category.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(category);
                    }
                }
                else
                {
                    var new_record = new Category
                    {
                        Name = category.CategoryName,
                        IsActive = category.IsActive,
                        CreatedBy = category.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.Categories.Add(new_record);
                    _context.SaveChanges();

                    category.CategoryId = new_record.CategoryId;

                    return Task.FromResult(category);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }


        public Task<ImprovementCategoryAdd> AddUpdateImpCategoryMaster(ImprovementCategoryAdd category)
        {
            try
            {
                var check_dup = _context.ImprovementCategoryMasters.Where(c => c.ImprovementCategoryName == category.ImpCategoryName && c.ImprovementCategoryId != category.ImpCategoryId).FirstOrDefault();
                if (check_dup != null)
                {
                    category.ImpCategoryId = -1;
                    return Task.FromResult(category);
                }

                if (category.ImpCategoryId > 0)
                {
                    var get_record = _context.ImprovementCategoryMasters.Find(category.ImpCategoryId);

                    if (get_record != null)
                    {
                        get_record.IsDeleted = category.IsActive == false ? true : false;
                        get_record.ImprovementCategoryName = category.ImpCategoryName;
                        get_record.ModifiedBy = category.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(category);
                    }
                }
                else
                {
                    var new_record = new ImprovementCategoryMaster
                    {
                        ImprovementCategoryName = category.ImpCategoryName,
                        IsDeleted = category.IsActive == true ? false : true,
                        CreatedBy = category.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.ImprovementCategoryMasters.Add(new_record);
                    _context.SaveChanges();

                    category.ImpCategoryId = new_record.ImprovementCategoryId;

                    return Task.FromResult(category);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }



        public Task<CostCenterAdd> AddUpdateCostCenterMaster(CostCenterAdd costCenter)
        {
            try
            {
                var check_dup = _context.CostCentres.Where(c => c.Name == costCenter.CostCenterName && c.CostCentreId != costCenter.CostCenterId).FirstOrDefault();
                if (check_dup != null)
                {
                    costCenter.CostCenterId = -1;
                    return Task.FromResult(costCenter);
                }

                if (costCenter.CostCenterId > 0)
                {
                    var get_record = _context.CostCentres.Find(costCenter.CostCenterId);

                    if (get_record != null)
                    {
                        get_record.IsActive = costCenter.IsActive;
                        get_record.Name = costCenter.CostCenterName;
                        get_record.ModifiedBy = costCenter.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(costCenter);
                    }
                }
                else
                {
                    var new_record = new CostCenter
                    {
                        Name = costCenter.CostCenterName,
                        IsActive = costCenter.IsActive,
                        CreatedBy = costCenter.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.CostCentres.Add(new_record);
                    _context.SaveChanges();

                    costCenter.CostCenterId = new_record.CostCentreId;

                    return Task.FromResult(costCenter);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<CellDivisionRoleMasterAdd> AddUpdateCellDivisionRoleMaster(CellDivisionRoleMasterAdd cellDivisionRole)
        {
            try
            {
                var check_dup = _context.CellDivisionRoleMasters.Where(
                    c => c.CellDivisionId != cellDivisionRole.CellDivisionId &&
                    c.FormName == cellDivisionRole.FormName &&
                    c.DivisionId == cellDivisionRole.DivisionId &&
                    c.Head == cellDivisionRole.Head &&
                    c.DeputyDivisionHead == cellDivisionRole.DeputyDivisionHead
                    ).FirstOrDefault();
                if (check_dup != null)
                {
                    cellDivisionRole.CellDivisionId = -1;
                    return Task.FromResult(cellDivisionRole);
                }

                //var _emp_head = _MasterEmployeeSelection(cellDivisionRole.Head ?? 0);

                //var _emp_deputy = _MasterEmployeeSelection(cellDivisionRole.DeputyDivisionHead ?? 0);

                if (cellDivisionRole.CellDivisionId > 0)
                {
                    var get_record = _context.CellDivisionRoleMasters.Find(cellDivisionRole.CellDivisionId);

                    if (get_record != null)
                    {
                        get_record.IsActive = cellDivisionRole.IsActive;
                        get_record.DivisionId = cellDivisionRole.DivisionId;
                        get_record.FormName = cellDivisionRole.FormName;
                        get_record.IsActive = true;
                        get_record.Head = cellDivisionRole.Head;
                        get_record.DeputyDivisionHead = cellDivisionRole.DeputyDivisionHead;

                        _context.SaveChanges();

                        return Task.FromResult(cellDivisionRole);
                    }
                }
                else
                {
                    var new_record = new CellDivisionRoleMaster
                    {
                        DivisionId = cellDivisionRole.DivisionId,
                        FormName = cellDivisionRole.FormName,
                        IsActive = true,
                        Head = cellDivisionRole.Head,
                        DeputyDivisionHead = cellDivisionRole.DeputyDivisionHead,
                    };

                    _context.CellDivisionRoleMasters.Add(new_record);
                    _context.SaveChanges();

                    cellDivisionRole.CellDivisionId = new_record.CellDivisionId;

                    return Task.FromResult(cellDivisionRole);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<CPCGroupMasterAdd> AddUpdateCPCGroupMaster(CPCGroupMasterAdd cPCGroupMasterAdd)
        {
            try
            {
                var check_dup = _context.CPCGroupMasters.Where(c => c.EmployeeId == cPCGroupMasterAdd.EmployeeId && c.CPCGroupId != cPCGroupMasterAdd.CPCGroupId).FirstOrDefault();
                if (check_dup != null)
                {
                    cPCGroupMasterAdd.CPCGroupId = -1;
                    return Task.FromResult(cPCGroupMasterAdd);
                }

                var _emp = _MasterEmployeeSelection(cPCGroupMasterAdd.EmployeeId ?? 0);

                if (cPCGroupMasterAdd.CPCGroupId > 0)
                {
                    var get_record = _context.CPCGroupMasters.Find(cPCGroupMasterAdd.CPCGroupId);

                    if (get_record != null)
                    {
                        get_record.EmployeeId = cPCGroupMasterAdd.EmployeeId;
                        get_record.EmployeeName = _emp.EmployeeName;
                        get_record.Email = _emp.Email;
                        get_record.IsActive = cPCGroupMasterAdd.IsActive;

                        _context.SaveChanges();

                        return Task.FromResult(cPCGroupMasterAdd);
                    }
                }
                else
                {
                    var new_record = new CPCGroupMaster
                    {
                        CPCGroupId = cPCGroupMasterAdd.CPCGroupId,
                        EmployeeId = cPCGroupMasterAdd.EmployeeId,
                        Email = _emp.Email,
                        EmployeeName = _emp.EmployeeName
                    };

                    _context.CPCGroupMasters.Add(new_record);
                    _context.SaveChanges();

                    cPCGroupMasterAdd.CPCGroupId = new_record.CPCGroupId;

                    return Task.FromResult(cPCGroupMasterAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<DeviceAdd> AddUpdateDeviceMaster(DeviceAdd deviceAdd)
        {
            try
            {
                var check_dup = _context.DeviceMasters.Where(c => c.DeviceName == deviceAdd.DeviceName ).FirstOrDefault();
                if (check_dup != null)
                {
                    deviceAdd.DeviceId = -1;
                    return Task.FromResult(deviceAdd);
                }

                if (deviceAdd.DeviceId > 0)
                {
                    var get_record = _context.DeviceMasters.Find(deviceAdd.DeviceId);

                    if (get_record != null)
                    {
                        get_record.IsActive = deviceAdd.IsActive;
                        get_record.DeviceName = deviceAdd.DeviceName;
                        get_record.ModifiedBy = deviceAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(deviceAdd);
                    }
                }
                else
                {
                    var new_record = new DeviceMaster
                    {
                        DeviceName = deviceAdd.DeviceName,
                        IsActive = deviceAdd.IsActive,
                        CreatedBy = deviceAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.DeviceMasters.Add(new_record);
                    _context.SaveChanges();

                    deviceAdd.DeviceId = new_record.DeviceId;

                    return Task.FromResult(deviceAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<SubDeviceAdd> AddUpdateSubDeviceMaster(SubDeviceAdd subDeviceAdd)
        {
            try
            {
                var check_dup = _context.SubDeviceMaster.Where(c => c.SubDeviceName == subDeviceAdd.SubDeviceName).FirstOrDefault();
                if (check_dup != null)
                {
                    subDeviceAdd.SubDeviceId = -1;
                    return Task.FromResult(subDeviceAdd);
                }

                if (subDeviceAdd.SubDeviceId > 0)
                {
                    var get_record = _context.SubDeviceMaster.Find(subDeviceAdd.SubDeviceId);

                    if (get_record != null)
                    {
                        get_record.IsActive = subDeviceAdd.IsActive;
                        get_record.SubDeviceName = subDeviceAdd.SubDeviceName;
                        get_record.DeviceId = subDeviceAdd.DeviceId;
                        get_record.ModifiedBy = subDeviceAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(subDeviceAdd);
                    }
                }
                else
                {
                    var new_record = new SubDeviceMaster
                    {
                        SubDeviceName = subDeviceAdd.SubDeviceName,
                        DeviceId = subDeviceAdd.DeviceId,
                        IsActive = subDeviceAdd.IsActive,
                        CreatedBy = subDeviceAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.SubDeviceMaster.Add(new_record);
                    _context.SaveChanges();

                    subDeviceAdd.SubDeviceId = new_record.SubDeviceId;

                    return Task.FromResult(subDeviceAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<EquipmentMasterAdd> AddUpdateEquipmentMaster(EquipmentMasterAdd equipmentMasterAdd)
        {
            try
            {
                var check_dup = _context.EquipmentMasters.Where(c => c.EquipmentName == equipmentMasterAdd.EquipmentName && c.EquipmentId != equipmentMasterAdd.EquipmentId).FirstOrDefault();
                if (check_dup != null)
                {
                    equipmentMasterAdd.EquipmentId = -1;
                    return Task.FromResult(equipmentMasterAdd);
                }

                if (equipmentMasterAdd.EquipmentId > 0)
                {
                    var get_record = _context.EquipmentMasters.Find(equipmentMasterAdd.EquipmentId);

                    if (get_record != null)
                    {
                        get_record.IsActive = equipmentMasterAdd.IsActive;
                        get_record.EquipmentName = equipmentMasterAdd.EquipmentName;
                        get_record.ModifiedBy = equipmentMasterAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(equipmentMasterAdd);
                    }
                }
                else
                {
                    var new_record = new EquipmentMaster
                    {
                        EquipmentName = equipmentMasterAdd.EquipmentName,
                        IsActive = equipmentMasterAdd.IsActive,
                        CreatedBy = equipmentMasterAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.EquipmentMasters.Add(new_record);
                    _context.SaveChanges();

                    equipmentMasterAdd.EquipmentId = new_record.EquipmentId;

                    return Task.FromResult(equipmentMasterAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<MachineAdd> AddUpdateMachineMaster(MachineAdd machineAdd)
        {
            try
            {
                var check_dup = _context.Machines.Where(c => c.MachineName == machineAdd.MachineName && c.MachineId != machineAdd.MachineId).FirstOrDefault();
                if (check_dup != null)
                {
                    machineAdd.MachineId = -1;
                    return Task.FromResult(machineAdd);
                }

                if (machineAdd.MachineId > 0)
                {
                    var get_record = _context.Machines.Find(machineAdd.MachineId);

                    if (get_record != null)
                    {
                        get_record.IsDeleted = machineAdd.IsActive == true ? false : true;
                        get_record.MachineName = machineAdd.MachineName;
                        get_record.ModifiedBy = machineAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(machineAdd);
                    }
                }
                else
                {
                    var new_record = new TDSGCellFormat.Models.Machine
                    {
                        MachineName = machineAdd.MachineName,
                        IsDeleted = machineAdd.IsActive == true ? false : true,
                        CreatedBy = machineAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.Machines.Add(new_record);
                    _context.SaveChanges();

                    machineAdd.MachineId = new_record.MachineId;

                    return Task.FromResult(machineAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<SubMachineAdd> AddUpdateSubMachineMaster(SubMachineAdd subMachineAdd)
        {
            try
            {
                var check_dup = _context.SubMachines.Where(c => c.SubMachineName == subMachineAdd.SubMachineName && c.SubMachineId != subMachineAdd.SubMachineId).FirstOrDefault();
                if (check_dup != null)
                {
                    subMachineAdd.SubMachineId = -1;
                    return Task.FromResult(subMachineAdd);
                }

                if (subMachineAdd.SubMachineId > 0)
                {
                    var get_record = _context.SubMachines.Find(subMachineAdd.SubMachineId);

                    if (get_record != null)
                    {
                        get_record.IsDeleted = subMachineAdd.IsActive == true ? false : true;
                        get_record.SubMachineName = subMachineAdd.SubMachineName;
                        get_record.MachineId = subMachineAdd.MachineId;
                        get_record.ModifiedBy = subMachineAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(subMachineAdd);
                    }
                }
                else
                {
                    var new_record = new SubMachine
                    {
                        SubMachineName = subMachineAdd.SubMachineName,
                        MachineId = subMachineAdd.MachineId,
                        IsDeleted = subMachineAdd.IsActive == true ? false : true,
                        CreatedBy = subMachineAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.SubMachines.Add(new_record);
                    _context.SaveChanges();

                    subMachineAdd.SubMachineId = new_record.SubMachineId;

                    return Task.FromResult(subMachineAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<MaterialAdd> AddUpdateMaterialMaster(MaterialAdd materialAdd)
        {
            try
            {
                var check_dup = _context.Materials.Where(c => c.Code == materialAdd.Code && c.MaterialId != materialAdd.MaterialId).FirstOrDefault();
                if (check_dup != null)
                {
                    materialAdd.MaterialId = -1;
                    return Task.FromResult(materialAdd);
                }

                if (materialAdd.MaterialId > 0)
                {
                    var get_record = _context.Materials.Find(materialAdd.MaterialId);

                    if (get_record != null)
                    {
                        get_record.IsActive = materialAdd.IsActive;
                        get_record.Code = materialAdd.Code;
                        get_record.Description = materialAdd.Description;
                        get_record.Category = materialAdd.Category ?? 0;
                        get_record.UOM = materialAdd.UOM ?? 0;
                        get_record.CostCenter = materialAdd.CostCenter ?? 0;
                        get_record.ModifiedBy = materialAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(materialAdd);
                    }
                }
                else
                {
                    var new_record = new Material
                    {
                        Code = materialAdd.Code,
                        Description = materialAdd.Description,
                        Category = materialAdd.Category ?? 0,
                        UOM = materialAdd.UOM ?? 0,
                        CostCenter = materialAdd.CostCenter ?? 0,
                        IsActive = materialAdd.IsActive,
                        CreatedBy = materialAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.Materials.Add(new_record);
                    _context.SaveChanges();

                    materialAdd.MaterialId = new_record.MaterialId;

                    return Task.FromResult(materialAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<ResultMonitoringMasterAdd> AddUpdateResultMonitoringMaster(ResultMonitoringMasterAdd resultMonitoringMasterAdd)
        {
            try
            {
                var check_dup = _context.ResultMonitoringMaster.Where(c => c.ResultMonitoringName == resultMonitoringMasterAdd.ResultMonitoringName && c.ResultMonitoringId != resultMonitoringMasterAdd.ResultMonitoringId).FirstOrDefault();
                if (check_dup != null)
                {
                    resultMonitoringMasterAdd.ResultMonitoringId = -1;
                    return Task.FromResult(resultMonitoringMasterAdd);
                }

                if (resultMonitoringMasterAdd.ResultMonitoringId > 0)
                {
                    var get_record = _context.ResultMonitoringMaster.Find(resultMonitoringMasterAdd.ResultMonitoringId);

                    if (get_record != null)
                    {
                        get_record.IsActive = resultMonitoringMasterAdd.IsActive;
                        get_record.ResultMonitoringName = resultMonitoringMasterAdd.ResultMonitoringName;

                        _context.SaveChanges();

                        return Task.FromResult(resultMonitoringMasterAdd);
                    }
                }
                else
                {
                    var new_record = new ResultMonitoringMaster
                    {
                        ResultMonitoringName = resultMonitoringMasterAdd.ResultMonitoringName,
                        IsActive = resultMonitoringMasterAdd.IsActive,
                    };

                    _context.ResultMonitoringMaster.Add(new_record);
                    _context.SaveChanges();

                    resultMonitoringMasterAdd.ResultMonitoringId = new_record.ResultMonitoringId;

                    return Task.FromResult(resultMonitoringMasterAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        //public Task<FunctionMasterAdd> AddUpdateFunctionMaster(FunctionMasterAdd functionMasterAdd)
        //{
        //    try
        //    {
        //        var check_dup = _context.Categories.Where(c => c.Name == category.Name && c.CategoryId != category.CategoryId).FirstOrDefault();
        //        if (check_dup != null)
        //        {
        //            category.CategoryId = -1;
        //            return Task.FromResult(category);
        //        }

        //        if (category.CategoryId > 0)
        //        {
        //            var get_record = _context.Categories.Find(category.CategoryId);

        //            if (get_record != null)
        //            {
        //                get_record.IsActive = category.IsActive;
        //                get_record.Name = category.Name;
        //                get_record.ModifiedBy = category.ModifiedBy;
        //                get_record.ModifiedDate = DateTime.Now;

        //                _context.SaveChanges();

        //                return Task.FromResult(category);
        //            }
        //        }
        //        else
        //        {
        //            var new_record = new Category
        //            {
        //                Name = category.Name,
        //                IsActive = category.IsActive,
        //                CreatedBy = category.CreatedBy,
        //                CreatedDate = DateTime.Now
        //            };

        //            _context.Categories.Add(new_record);
        //            _context.SaveChanges();

        //            category.CategoryId = new_record.CategoryId;

        //            return Task.FromResult(category);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }

        //    return null;
        //    FunctionMaster? newFunctionMaster = new FunctionMaster();

        //    var existingArea = _context.FunctionMaster.Where(x => x.FunctionId == functionMasterAdd.FunctionId || x.FunctionName == functionMasterAdd.FunctionName).FirstOrDefault();
        //    if (existingArea == null)
        //    {
        //        newFunctionMaster = new FunctionMaster();
        //        newFunctionMaster.FunctionName = functionMasterAdd.FunctionName;
        //        newFunctionMaster.IsActive = true;
        //        newFunctionMaster.CreatedBy = functionMasterAdd.CreatedBy;
        //        newFunctionMaster.CreatedDate = DateTime.Now;
        //        _context.FunctionMaster.Add(newFunctionMaster);
        //        _context.SaveChanges();

        //        return Task.FromResult(new FunctionView()
        //        {
        //            functionId = newFunctionMaster.FunctionId,
        //            functionName = newFunctionMaster.FunctionName,
        //        });
        //    }
        //    else
        //    {
        //        existingArea.FunctionName = functionMasterAdd.FunctionName;
        //        existingArea.IsActive = functionMasterAdd.IsActive ? true : false;
        //        existingArea.ModifiedBy = functionMasterAdd.ModifiedBy;
        //        existingArea.ModifiedDate = DateTime.Now;
        //        _context.SaveChanges();

        //        return Task.FromResult(new FunctionView()
        //        {
        //            functionId = existingArea.FunctionId,
        //            functionName = existingArea.FunctionName,
        //        });
        //    }
        //}

        public Task<SectionHeadEmpMasterAdd> AddUpdateSectionHeadEmpMaster(SectionHeadEmpMasterAdd sectionHeadEmpMasterAdd)
        {
            try
            {
                var check_dup = _context.SectionHeadEmpMasters.Where(c =>
                c.EmployeeId == sectionHeadEmpMasterAdd.EmployeeId &&
                c.SectionId == sectionHeadEmpMasterAdd.SectionId &&
                c.SectionHeadMasterId != sectionHeadEmpMasterAdd.SectionHeadMasterId).FirstOrDefault();

                if (check_dup != null)
                {
                    sectionHeadEmpMasterAdd.SectionHeadMasterId = -1;
                    return Task.FromResult(sectionHeadEmpMasterAdd);
                }

                var _emp = _MasterEmployeeSelection(sectionHeadEmpMasterAdd.EmployeeId ?? 0);

                if (sectionHeadEmpMasterAdd.SectionHeadMasterId > 0)
                {
                    var get_record = _context.SectionHeadEmpMasters.Find(sectionHeadEmpMasterAdd.SectionHeadMasterId);

                    if (get_record != null)
                    {
                        get_record.IsActive = sectionHeadEmpMasterAdd.IsActive;
                        get_record.SectionHeadName = _emp.EmployeeName;
                        get_record.EmployeeId = sectionHeadEmpMasterAdd.EmployeeId;
                        get_record.SectionHeadEmail = _emp.Email;
                        get_record.SectionId = sectionHeadEmpMasterAdd.SectionId;

                        _context.SaveChanges();

                        return Task.FromResult(sectionHeadEmpMasterAdd);
                    }
                }
                else
                {
                    var new_record = new SectionHeadEmpMaster
                    {
                        SectionHeadName = _emp.EmployeeName,
                        EmployeeId = sectionHeadEmpMasterAdd.EmployeeId,
                        SectionHeadEmail = _emp.Email,
                        SectionId = sectionHeadEmpMasterAdd.SectionId,
                        IsActive = sectionHeadEmpMasterAdd.IsActive,
                    };

                    _context.SectionHeadEmpMasters.Add(new_record);
                    _context.SaveChanges();

                    sectionHeadEmpMasterAdd.SectionHeadMasterId = new_record.SectionHeadMasterId;

                    return Task.FromResult(sectionHeadEmpMasterAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<SectionMasterAdd> AddUpdateSectionMaster(SectionMasterAdd sectionMasterAdd)
        {
            try
            {
                var check_dup = _context.SectionMasters.Where(c => c.SectionName == sectionMasterAdd.SectionName && c.SectionId != sectionMasterAdd.SectionId).FirstOrDefault();
                if (check_dup != null)
                {
                    sectionMasterAdd.SectionId = -1;
                    return Task.FromResult(sectionMasterAdd);
                }

                if (sectionMasterAdd.SectionId > 0)
                {
                    var get_record = _context.SectionMasters.Find(sectionMasterAdd.SectionId);

                    if (get_record != null)
                    {
                        get_record.IsActive = sectionMasterAdd.IsActive;
                        get_record.SectionName = sectionMasterAdd.SectionName;
                        get_record.ModifiedBy = sectionMasterAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(sectionMasterAdd);
                    }
                }
                else
                {
                    var new_record = new SectionMaster
                    {
                        SectionName = sectionMasterAdd.SectionName,
                        IsActive = sectionMasterAdd.IsActive,
                        CreatedBy = sectionMasterAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.SectionMasters.Add(new_record);
                    _context.SaveChanges();

                    sectionMasterAdd.SectionId = new_record.SectionId;

                    return Task.FromResult(sectionMasterAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<TroubleTypeAdd> AddUpdateTroubleTypeMaster(TroubleTypeAdd troubleTypeAdd)
        {
            try
            {
                var check_dup = _context.TroubleTypes.Where(c => c.Name == troubleTypeAdd.Name ).FirstOrDefault();
                if (check_dup != null)
                {
                    troubleTypeAdd.TroubleId = -1;
                    return Task.FromResult(troubleTypeAdd);
                }

                if (troubleTypeAdd.TroubleId > 0)
                {
                    var get_record = _context.TroubleTypes.Find(troubleTypeAdd.TroubleId);

                    if (get_record != null)
                    {
                        get_record.IsActive = troubleTypeAdd.IsActive;
                        get_record.Name = troubleTypeAdd.Name;
                        get_record.ModifiedBy = troubleTypeAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(troubleTypeAdd);
                    }
                }
                else
                {
                    var new_record = new TroubleType
                    {
                        Name = troubleTypeAdd.Name,
                        IsActive = troubleTypeAdd.IsActive,
                        CreatedBy = troubleTypeAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.TroubleTypes.Add(new_record);
                    _context.SaveChanges();

                    troubleTypeAdd.TroubleId = new_record.TroubleId;

                    return Task.FromResult(troubleTypeAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        public Task<UnitOfMeasureDtoAdd> AddUpdateUnitOfMeasureMaster(UnitOfMeasureDtoAdd unitOfMeasureAdd)
        {
            try
            {
                var check_dup = _context.UnitOfMeasures.Where(c => c.Name == unitOfMeasureAdd.UOMName && c.UOMId != unitOfMeasureAdd.UOMId).FirstOrDefault();
                if (check_dup != null)
                {
                    unitOfMeasureAdd.UOMId = -1;
                    return Task.FromResult(unitOfMeasureAdd);
                }

                if (unitOfMeasureAdd.UOMId > 0)
                {
                    var get_record = _context.UnitOfMeasures.Find(unitOfMeasureAdd.UOMId);

                    if (get_record != null)
                    {
                        get_record.IsActive = unitOfMeasureAdd.IsActive;
                        get_record.Name = unitOfMeasureAdd.UOMName;
                        get_record.ModifiedBy = unitOfMeasureAdd.ModifiedBy;
                        get_record.ModifiedDate = DateTime.Now;

                        _context.SaveChanges();

                        return Task.FromResult(unitOfMeasureAdd);
                    }
                }
                else
                {
                    var new_record = new UnitOfMeasure
                    {
                        Name = unitOfMeasureAdd.UOMName,
                        IsActive = unitOfMeasureAdd.IsActive,
                        CreatedBy = unitOfMeasureAdd.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    _context.UnitOfMeasures.Add(new_record);
                    _context.SaveChanges();

                    unitOfMeasureAdd.UOMId = new_record.UOMId;

                    return Task.FromResult(unitOfMeasureAdd);
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

        #endregion

        #region Master Remove Methods

        public Task<bool> DeleteAreaMaster(int id)
        {
            var existingArea = _context.Areas.Where(x => x.AreaId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingArea.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteImpCategoryMaster(int id)
        {
            var existingArea = _context.ImprovementCategoryMasters.Where(x => x.ImprovementCategoryId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingArea.IsDeleted = true;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteCategory(int id)
        {
            var existingCategory = _context.Categories.Where(x => x.CategoryId == id).FirstOrDefault();
            if (existingCategory == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingCategory.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteCostCenter(int id)
        {
            var existingcost = _context.CostCentres.Where(x => x.CostCentreId == id).FirstOrDefault();
            if (existingcost == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingcost.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteCellDivisionRole(int id)
        {
            var existingArea = _context.CellDivisionRoleMasters.Where(x => x.CellDivisionId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.CellDivisionRoleMasters.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteCPCGroup(int id)
        {
            var existingArea = _context.CPCGroupMasters.Where(x => x.CPCGroupId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.CPCGroupMasters.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteDevice(int id)
        {
            var existingArea = _context.DeviceMasters.Where(x => x.DeviceId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.DeviceMasters.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteSubDevice(int id)
        {
            var existingUOM = _context.SubDeviceMaster.Where(x => x.SubDeviceId == id).FirstOrDefault();
            if (existingUOM == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingUOM.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteEquipment(int id)
        {
            var existingArea = _context.EquipmentMasters.Where(x => x.EquipmentId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.EquipmentMasters.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteMachine(int id)
        {
            var existingMachine = _context.Machines.Where(x => x.MachineId == id).FirstOrDefault();
            if (existingMachine == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingMachine.IsDeleted = true;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteSubMachine(int id)
        {
            var existingSubMachine = _context.SubMachines.Where(x => x.SubMachineId == id).FirstOrDefault();
            if (existingSubMachine == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingSubMachine.IsDeleted = true;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteMaterial(int id)
        {
            var existingMaterial = _context.Materials.Where(x => x.MaterialId == id).FirstOrDefault();
            if (existingMaterial == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingMaterial.IsActive = false; 
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteResultMonitoring(int id)
        {
            var existingArea = _context.ResultMonitoringMaster.Where(x => x.ResultMonitoringId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.ResultMonitoringMaster.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteFunction(int id)
        {
            var existingArea = _context.FunctionMaster.Where(x => x.FunctionId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.FunctionMaster.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteSectionHeadEmp(int id)
        {
            var existingArea = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.SectionHeadEmpMasters.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteSection(int id)
        {
            var existingSection = _context.SectionMasters.Where(x => x.SectionId == id).FirstOrDefault();
            if (existingSection == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingSection.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteTroubleType(int id)
        {
            var existingArea = _context.TroubleTypes.Where(x => x.TroubleId == id).FirstOrDefault();
            if (existingArea == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                _context.TroubleTypes.Remove(existingArea);
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteUnitOfMeasure(int id)
        {
            var existingUOM = _context.UnitOfMeasures.Where(x => x.UOMId == id).FirstOrDefault();
            if (existingUOM == null)
            {
                return Task.FromResult(false);
            }
            else
            {
                existingUOM.IsActive = false;
                _context.SaveChanges();
                return Task.FromResult(true);
            }
        }

        #endregion

        #region Master Selection Methods

        public IQueryable<DivisionMaster> GetAllDivisionMasterSelection()
        {
            IQueryable<DivisionMaster> res = null;
            try
            {
                res = _cloneContext.DivisionMasters.Where(c => c.IsActive == true).Select(c => new DivisionMaster
                {
                    Name = c.Name,
                    DivisionID = c.DivisionID
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<SubDeviceMaster> GetAllSubDeviceMasterSelection()
        {
            IQueryable<SubDeviceMaster> res = null;
            try
            {
                res = _context.SubDeviceMaster.Where(c => c.IsActive == true).Select(c => new SubDeviceMaster
                {
                    SubDeviceId = c.SubDeviceId,
                    SubDeviceName = c.SubDeviceName,
                    IsActive = c.IsActive,
                    DeviceId = c.DeviceId
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<CostCenterAdd> GetAllCostCenterSelection()
        {
            IQueryable<CostCenterAdd> res = null;
            try
            {
                var employeeNames = _cloneContext.EmployeeMasters
                                 .ToDictionary(t => t.EmployeeID, t => t.EmployeeName);
                res = _context.CostCentres
                    .OrderByDescending(x => x.CostCentreId)
                    .Select(c => new CostCenterAdd
                {
                    CostCenterId = c.CostCentreId,
                    CostCenterName = c.Name,
                    IsActive = c.IsActive,
                    CreatedBy = c.CreatedBy,
                    CreatedDate = c.CreatedDate,
                    ModifiedBy = c.ModifiedBy,
                    ModifiedDate = c.ModifiedDate,
                    CreatedByName = c.CreatedBy.HasValue && employeeNames.ContainsKey(c.CreatedBy.Value) ? employeeNames[c.CreatedBy.Value] : null,
                    ModifiedByName = c.ModifiedBy.HasValue && employeeNames.ContainsKey(c.ModifiedBy.Value) ? employeeNames[c.ModifiedBy.Value] : null

                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<UnitOfMeasure> GetAllUOMSelection()
        {
            IQueryable<UnitOfMeasure> res = null;
            try
            {
                res = _context.UnitOfMeasures.Where(c => c.IsActive == true).Select(c => new UnitOfMeasure
                {
                    UOMId = c.UOMId,
                    Name = c.Name,
                    IsActive = c.IsActive
                });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<MasterEmployeeSelection> GetAllMasterEmployeeSelection()
        {
            IQueryable<MasterEmployeeSelection> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true)
                                            .Select(x => new MasterEmployeeSelection
                                            {
                                                EmployeeId = x.EmployeeID,
                                                EmployeeName = x.EmployeeName,
                                                Email = x.Email
                                            });

            return res;
        }

        public IQueryable<SectionMaster> GetAllSectionMasterSelection()
        {
            IQueryable<SectionMaster> res = null;
            try
            {
                res = _context.SectionMasters.Where(c => c.IsActive == true)
                    .Select(c => new SectionMaster 
                    { SectionId = c.SectionId, SectionName = c.SectionName, IsActive = c.IsActive });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        public IQueryable<Category> GetAllCategorySelection()
        {
            IQueryable<Category> res = null;
            try
            {
                res = _context.Categories.Where(c => c.IsActive == true)
                    .Select(c => new Category { CategoryId = c.CategoryId, Name = c.Name, IsActive = c.IsActive });
            }
            catch (Exception ex)
            {

            }
            return res;
        }

        private MasterEmployeeSelection _MasterEmployeeSelection(int EmployeeId)
        {
            return _cloneContext.EmployeeMasters.Where(c => c.EmployeeID == EmployeeId).Select(x => new MasterEmployeeSelection
            {
                EmployeeId = x.EmployeeID,
                EmployeeName = x.EmployeeName,
                Email = x.Email
            }).SingleOrDefault();
        }

        #endregion

        #endregion
    }
}
