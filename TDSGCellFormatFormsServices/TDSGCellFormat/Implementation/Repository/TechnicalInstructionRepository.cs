using System.Net.Mail;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Repository
{
    public class TechnicalInstructionRepository : BaseRepository<TechnicalInstructionSheet>, ITechnicalInsurtuctionRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;

        public TechnicalInstructionRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            this._context = context;
        }

        public IQueryable<TechnicalInstructionAdd> GetAll()
        {

            IQueryable<TechnicalInstructionAdd> res = _context.TechnicalInstructionSheets
                                  .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                  .Select(n => new TechnicalInstructionAdd
                                  {
                                      TechnicalId = n.TechnicalId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      title = n.Title,
                                      purpose = n.Purpose,
                                      productType = n.ProductType,
                                      quantity = n.Quantity,
                                      outline = n.Outline,
                                      tisApplicabilityDate = n.TISApplicable.HasValue ? n.TISApplicable.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      attachment = n.Attachment,
                                      Status = n.Status,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy
                                      // Add other properties as needed
                                  });

            return res;

        }

        public TechnicalInstructionAdd GetById(int Id)
        {

            var res = _context.TechnicalInstructionSheets
                                  .Where(n => n.IsDeleted == false && n.TechnicalId == Id)  // Filter out deleted records
                                  .Select(n => new TechnicalInstructionAdd
                                  {
                                      TechnicalId = n.TechnicalId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      title = n.Title,
                                      purpose = n.Purpose,
                                      productType = n.ProductType,
                                      quantity = n.Quantity,
                                      outline = n.Outline,
                                      tisApplicabilityDate = n.TISApplicable.HasValue ? n.TISApplicable.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      attachment = n.Attachment,
                                      Status = n.Status,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy
                                      // Add other properties as needed
                                  }).FirstOrDefault();

            return res;

        }

        public async Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd report)
        {
            var res = new AjaxResult();
            var existingReport = await _context.TechnicalInstructionSheets.FindAsync(report.TechnicalId);

            if (existingReport == null)
            {
                var newReport = new TechnicalInstructionSheet()
                {
                    When = DateTime.Parse(report.when),
                    Title = report.title,
                    Purpose = report.purpose,
                    ProductType = report.productType,
                    Quantity = report.quantity,
                    Outline = report.outline,
                    TISApplicable = DateTime.Parse(report.tisApplicabilityDate),
                    Attachment = report.attachment,
                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                    CreatedBy = report.CreatedBy,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = report.CreatedBy,
                };
                _context.TechnicalInstructionSheets.Add(newReport);
                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.When = DateTime.Parse(report.when);
                existingReport.Title = report.title;
                existingReport.Purpose = report.purpose;
                existingReport.ProductType = report.productType;
                existingReport.Quantity = report.quantity;
                existingReport.Outline = report.outline;
                existingReport.TISApplicable = DateTime.Parse(report.tisApplicabilityDate);
                existingReport.Attachment = report.attachment;
                existingReport.IsDeleted = false;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = report.ModifiedBy;
                _context.SaveChanges();
                res.Message = "Record Updated Successfully";
            }
            res.ReturnValue = report;
            return res;
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = await _context.TechnicalInstructionSheets.FindAsync(Id);
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
