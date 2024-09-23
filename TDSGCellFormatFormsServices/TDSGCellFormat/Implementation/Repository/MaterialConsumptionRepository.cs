using Microsoft.AspNetCore.Http.HttpResults;
using System.Net.Mail;
using System.Reflection.Emit;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Repository
{
    public class MaterialConsumptionRepository : BaseRepository<MaterialConsumptionSlip>, IMatrialConsumptionRepository
    {

        private readonly TdsgCellFormatDivisionContext _context;

        public MaterialConsumptionRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            this._context = context;
        }

        public IQueryable<MaterialConsumptionAdd> GetAll()
        {

            IQueryable<MaterialConsumptionAdd> res = _context.MaterialConsumptionSlips
                                  .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                  .Select(n => new MaterialConsumptionAdd
                                  {
                                      MaterialConsumptionSlipId = n.MaterialConsumptionSlipId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      category = n.Category,
                                      materialNumber = n.MaterialNumber,
                                      glCode = n.GLCode,
                                      costCenter = n.CostCenter,
                                      description = n.Description,
                                      quantity = n.Quantity,
                                      uom = n.UOMId,
                                      purpose = n.Purpose,
                                      attachment = n.Attachment,
                                      Status = n.Status,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy
                                      // Add other properties as needed
                                  });

            return res;

        }

        public MaterialConsumptionAdd GetById(int Id)
        {

            var res = _context.MaterialConsumptionSlips
                                  .Where(n => n.IsDeleted == false && n.MaterialConsumptionSlipId == Id)  // Filter out deleted records
                                  .Select(n => new MaterialConsumptionAdd
                                  {
                                      MaterialConsumptionSlipId = n.MaterialConsumptionSlipId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      category = n.Category,
                                      materialNumber = n.MaterialNumber,
                                      glCode = n.GLCode,
                                      costCenter = n.CostCenter,
                                      description = n.Description,
                                      quantity = n.Quantity,
                                      uom = n.UOMId,
                                      purpose = n.Purpose,
                                      attachment = n.Attachment,
                                      Status = n.Status,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy
                                      // Add other properties as needed
                                  }).FirstOrDefault();

            return res;

        }

        public async Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionAdd report)
        {
            var res = new AjaxResult();
            var existingReport = await _context.MaterialConsumptionSlips.FindAsync(report.MaterialConsumptionSlipId);

            if (existingReport == null)
            {
                var newReport = new MaterialConsumptionSlip()
                {
                    When = DateTime.Parse(report.when),
                    Category = report.category,
                    MaterialNumber = report.materialNumber,
                    GLCode = report.glCode,
                    CostCenter = report.costCenter,
                    Description = report.description,
                    Quantity = report.quantity,
                    UOMId = report.uom,
                    Purpose = report.purpose,
                    Attachment = report.attachment,
                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                    CreatedBy = report.CreatedBy,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = report.CreatedBy,
                };
                _context.MaterialConsumptionSlips.Add(newReport);
                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.When = DateTime.Parse(report.when);
                existingReport.Category = report.category;
                existingReport.MaterialNumber = report.materialNumber;
                existingReport.GLCode = report.glCode;
                existingReport.CostCenter = report.costCenter;
                existingReport.Description = report.description;
                existingReport.Quantity = report.quantity;
                existingReport.UOMId = report.uom;
                existingReport.Purpose = report.purpose;
                existingReport.Attachment = report.attachment;
                existingReport.IsDeleted = false;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = report.ModifiedBy;
                await _context.SaveChangesAsync();
                res.Message = "Record Updated Successfully";
            }
            
            res.ReturnValue = report;
            return res;
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = await _context.MaterialConsumptionSlips.FindAsync(Id);
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
                report.ModifiedDate = DateTime.Now;
                int rowsAffected = await _context.SaveChangesAsync();

                if (rowsAffected > 0)
                {
                    res.StatusCode = Status.Success;
                    res.Message = "Record deleted successfully.";
                }
                else
                {
                    res.StatusCode = Status.Error;
                    res.Message = "Record deletion failed.";
                }
            }
            return res;
        }
    }
}
