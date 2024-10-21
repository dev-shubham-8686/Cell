using DocumentFormat.OpenXml.Bibliography;
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

        public IQueryable<SectionHeadView> GetAllSections(int departmentId)
        {
            IQueryable<SectionHeadView> res = _cloneContext.SectionHeadMasters.Where(x => x.IsActive == true && x.DepartmentId == departmentId)

                                           .Select(x => new SectionHeadView

                                           {

                                               sectionHeadId = x.Sectionid,

                                               head = x.Head,

                                               sectionName = x.SectionName

                                           });



            return res;
        }
    }
}
