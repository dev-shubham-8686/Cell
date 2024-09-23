using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using TDSGCellFormat.Common;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;


namespace TDSGCellFormat.Implementation.Repository
{
    public class AdjustMentReportRepository : BaseRepository<AdjustmentReport>, IAdjustMentReportRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;

        public AdjustMentReportRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            this._context = context;
        }
        public IQueryable<AdjustMentReportAdd> GetAll()
        {

            IQueryable<AdjustMentReportAdd> res = _context.AdjustmentReports
                                  .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                  .Select(n => new AdjustMentReportAdd
                                  {
                                      AdjustMentReportId = n.AdjustMentReportId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      Area = n.Area,
                                      linestation = n.Line,
                                      machinename = n.MachineName,
                                      machineno = n.MachineNum,
                                      describeproblem = n.DescribeProblem,
                                      observation = n.Observation,
                                      rootcause = n.RootCause,
                                      adjustmentsuggested = n.AdjustmentSuggestion,
                                      attachment = n.Attachment,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy
                                      // Add other properties as needed
                                  });

            return res;

        }
        public AdjustMentReportAdd GetById(int Id)
        {
            var res = (from n in _context.AdjustmentReports
                                                  where n.IsDeleted == false && n.AdjustMentReportId == Id
                                                  // Filter out deleted records
                                                  select new AdjustMentReportAdd()
                                                  {
                                                      AdjustMentReportId = n.AdjustMentReportId,
                                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                                      Area = n.Area,
                                                      linestation = n.Line,
                                                      machinename = n.MachineName,
                                                      machineno = n.MachineNum,
                                                      describeproblem = n.DescribeProblem,
                                                      observation = n.Observation,
                                                      rootcause = n.RootCause,
                                                      adjustmentsuggested = n.AdjustmentSuggestion,
                                                      attachment = n.Attachment,
                                                      CreatedDate = n.CreatedDate,
                                                      CreatedBy = n.CreatedBy
                                                      // Add other properties as needed
                                                  }).FirstOrDefault();

            return res;
        }
        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportAdd report)
        {
            var res = new AjaxResult();
            var existingReport = await _context.AdjustmentReports.FindAsync(report.AdjustMentReportId);
            if (existingReport == null)
            {
                var newReport = new AdjustmentReport()
                {
                    When = DateTime.Parse(report.when), //DateTime.Parse(report.when)
                    Area = report.Area,
                    Line = report.linestation,
                    MachineName = report.machinename,
                    MachineNum = report.machineno,
                    DescribeProblem = report.describeproblem,
                    Observation = report.observation,
                    RootCause = report.rootcause,
                    AdjustmentSuggestion = report.adjustmentsuggested,
                    Attachment = report.attachment,
                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                    CreatedBy = report.CreatedBy,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = report.CreatedBy,
                };
                _context.AdjustmentReports.Add(newReport);
                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.When = DateTime.Parse(report.when);
                existingReport.Area = report.Area;
                existingReport.Line = report.linestation;
                existingReport.MachineName = report.machinename;
                existingReport.MachineNum = report.machineno;
                existingReport.DescribeProblem = report.describeproblem;
                existingReport.Observation = report.observation;
                existingReport.RootCause = report.rootcause;
                existingReport.AdjustmentSuggestion = report.adjustmentsuggested;
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
            var report = await _context.AdjustmentReports.FindAsync(Id);
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
