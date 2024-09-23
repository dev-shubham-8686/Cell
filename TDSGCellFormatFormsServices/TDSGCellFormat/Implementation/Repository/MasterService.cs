using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
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

        public IQueryable<TroubleTypeView> GetAllTroubles()
        {
            IQueryable<TroubleTypeView> res = _context.TroubleTypes.Where(x => x.IsActive == true)
                                            .Select(x  => new TroubleTypeView
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

        public IQueryable<MaterialView> GetAllMaterials()
        {
            IQueryable<MaterialView> res = _context.Materials.Where(x => x.IsActive == true)
                                            .Select(x => new MaterialView
                                            {
                                                materialId = x.MaterialId,
                                               
                                                name = x.Name
                                            });

            return res;
        }

        public IQueryable<EmployeeMasterView> GetAllEmployees()
        {

            int divisionID = _cloneContext.DivisionMasters
                                  .Where(d => d.Name == "Cell Production")
                                  .Select(d => d.DivisionID)
                                  .FirstOrDefault();

            IQueryable<EmployeeMasterView> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true &&
                                         _cloneContext.DepartmentMasters
                                               .Where(d => d.DivisionID == divisionID)
                                              .Select(d => d.DepartmentID)
                                              .Contains(x.DepartmentID))
                                            .Select(x => new EmployeeMasterView
                                            {
                                                employeeId = x.EmployeeID,

                                                employeeName = x.EmployeeName
                                            });

            return res;
        }
    }
}
