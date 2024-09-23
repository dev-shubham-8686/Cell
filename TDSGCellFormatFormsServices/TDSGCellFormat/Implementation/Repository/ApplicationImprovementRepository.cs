using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using System.Net.Mail;

namespace TDSGCellFormat.Implementation.Repository
{
    public class ApplicationImprovementRepository : BaseRepository<ApplicationEquipmentImprovement>, IApplicationImprovementRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;

        public ApplicationImprovementRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            this._context = context;
        }

        public IQueryable<ApplicationImprovementAdd> GetAll()
        {
            IQueryable<ApplicationImprovementAdd> res = _context.ApplicationEquipmentImprovements
                                 .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                 .Select(n => new ApplicationImprovementAdd
                                 {
                                     ApplicationImprovementId = n.ApplicationImprovementId,
                                     when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                     deviceName = n.DeviceName,
                                     purpose = n.Purpose,
                                     currentSituation = n.CurrentSituation,
                                     improvement = n.Imrovement,
                                     attachment = n.Attachment,
                                     Status = n.Status,
                                     CreatedDate = n.CreatedDate,
                                     CreatedBy = n.CreatedBy
                                     // Add other properties as needed
                                 });

            return res;
        }

        public ApplicationImprovementAdd GetById(int Id)
        {
            var res = (from n in _context.ApplicationEquipmentImprovements
                       where n.IsDeleted == false && n.ApplicationImprovementId == Id
                       // Filter out deleted records
                       select new ApplicationImprovementAdd()
                       {
                                     ApplicationImprovementId = n.ApplicationImprovementId,
                                     when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                     deviceName = n.DeviceName,
                                     purpose = n.Purpose,
                                     currentSituation = n.CurrentSituation,
                                     improvement = n.Imrovement,
                                     attachment = n.Attachment,
                                     Status = n.Status,
                                     CreatedDate = n.CreatedDate,
                                     CreatedBy = n.CreatedBy
                                     // Add other properties as needed
                                 }).FirstOrDefault();

            return res;
        }

        public async Task<AjaxResult> AddOrUpdateReport(ApplicationImprovementAdd report)
        {
            var res = new AjaxResult();
            var existingReport = await _context.ApplicationEquipmentImprovements.FindAsync(report.ApplicationImprovementId);

            if (existingReport == null)
            {
                var newReport = new ApplicationEquipmentImprovement
                {
                    When = DateTime.Parse(report.when),
                    DeviceName = report.deviceName,
                    Purpose = report.purpose,
                    CurrentSituation = report.currentSituation,
                    Imrovement = report.improvement,
                    Attachment = report.attachment,
                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                    CreatedBy = report.CreatedBy,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = report.CreatedBy,
                };
                _context.ApplicationEquipmentImprovements.Add(newReport);
                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.When = DateTime.Parse(report.when);
                existingReport.DeviceName = report.deviceName;
                existingReport.Purpose = report.purpose;
                existingReport.CurrentSituation = report.currentSituation;
                existingReport.Imrovement = report.improvement;
                existingReport.Attachment = report.attachment;
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
            var report = await _context.ApplicationEquipmentImprovements.FindAsync(Id);
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
