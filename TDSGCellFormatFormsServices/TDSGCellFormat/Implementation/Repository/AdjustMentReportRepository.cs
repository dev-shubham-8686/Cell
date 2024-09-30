using TDSGCellFormat.Entities;
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

        public IQueryable<AdjustMentReportRequest> GetAll()
        {
            IQueryable<AdjustMentReportRequest> res = _context.AdjustmentReports
                                  .Where(n => n.IsDeleted == false)
                                  .Select(n => new AdjustMentReportRequest
                                  {
                                      AdjustMentReportId = n.AdjustMentReportId,
                                      Area = n.Area,
                                      MachineName = n.MachineName,
                                      SubMachineName = n.SubMachineName,
                                      ReportNo = n.ReportNo,
                                      RequestBy = n.RequestBy,
                                      CheckedBy = n.CheckedBy,
                                      DescribeProblem = n.DescribeProblem,
                                      Observation = n.Observation,
                                      RootCause = n.RootCause,
                                      AdjustmentDescription = n.AdjustmentDescription,
                                      Photos = n.Photos,
                                      ConditionAfterAdjustment = n.ConditionAfterAdjustment,
                                      Status = n.Status,
                                      WorkFlowStatus = n.WorkFlowStatus,
                                      IsSubmit = n.IsSubmit,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy,
                                      ModifiedDate = n.ModifiedDate,
                                      ModifiedBy = n.ModifiedBy,
                                      IsDeleted = n.IsDeleted,
                                  });

            return res;

        }
        public AdjustMentReportRequest GetById(int Id)
        {
            AdjustMentReportRequest? res = _context.AdjustmentReports
                                  .Where(n => n.IsDeleted == false && n.AdjustMentReportId == Id)
                                  .Select(n => new AdjustMentReportRequest
                                  {
                                      AdjustMentReportId = n.AdjustMentReportId,
                                      Area = n.Area,
                                      MachineName = n.MachineName,
                                      SubMachineName = n.SubMachineName,
                                      ReportNo = n.ReportNo,
                                      RequestBy = n.RequestBy,
                                      CheckedBy = n.CheckedBy,
                                      DescribeProblem = n.DescribeProblem,
                                      Observation = n.Observation,
                                      RootCause = n.RootCause,
                                      AdjustmentDescription = n.AdjustmentDescription,
                                      Photos = n.Photos,
                                      ConditionAfterAdjustment = n.ConditionAfterAdjustment,
                                      Status = n.Status,
                                      WorkFlowStatus = n.WorkFlowStatus,
                                      IsSubmit = n.IsSubmit,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy,
                                      ModifiedDate = n.ModifiedDate,
                                      ModifiedBy = n.ModifiedBy,
                                      IsDeleted = n.IsDeleted,
                                  }).FirstOrDefault();
            return res;
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest request)
        {
            var res = new AjaxResult();
            var existingReport = await _context.AdjustmentReports.FindAsync(request.AdjustMentReportId);
            if (existingReport == null)
            {
                var newReport = new AdjustmentReport()
                {
                    Area = request.Area,
                    MachineName = request.MachineName,
                    SubMachineName = request.SubMachineName,
                    ReportNo = request.ReportNo,
                    RequestBy = request.RequestBy,
                    CheckedBy = request.CheckedBy,
                    DescribeProblem = request.DescribeProblem,
                    Observation = request.Observation,
                    RootCause = request.RootCause,
                    AdjustmentDescription = request.AdjustmentDescription,
                    Photos = request.Photos,
                    ConditionAfterAdjustment = request.ConditionAfterAdjustment,
                    Status = request.Status,
                    WorkFlowStatus = request.WorkFlowStatus,
                    IsSubmit = request.IsSubmit,
                    CreatedDate = DateTime.Now,
                    CreatedBy = request.CreatedBy,
                    IsDeleted = false,
                };

                await _context.AdjustmentReports.AddAsync(newReport);

                // Get ID of newly added record
                request.AdjustMentReportId = newReport.AdjustMentReportId;

                if (request.ChangeRiskManagement != null)
                {
                    await _context.ChangeRiskManagements.AddRangeAsync(request.ChangeRiskManagement);
                }

                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.Area = request.Area;
                existingReport.MachineName = request.MachineName;
                existingReport.SubMachineName = request.SubMachineName;
                existingReport.ReportNo = request.ReportNo;
                existingReport.RequestBy = request.RequestBy;
                existingReport.CheckedBy = request.CheckedBy;
                existingReport.DescribeProblem = request.DescribeProblem;
                existingReport.Observation = request.Observation;
                existingReport.RootCause = request.RootCause;
                existingReport.AdjustmentDescription = request.AdjustmentDescription;
                existingReport.Photos = request.Photos;
                existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                existingReport.Status = request.Status;
                existingReport.WorkFlowStatus = request.WorkFlowStatus;
                existingReport.IsSubmit = request.IsSubmit;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = request.ModifiedBy;

                var changeRiskManagements = _context.ChangeRiskManagements.Where(x => x.AdjustMentReportId == request.AdjustMentReportId).ToList();
                if (changeRiskManagements == null)
                {
                    if (request.ChangeRiskManagement != null)
                    {
                        await _context.ChangeRiskManagements.AddRangeAsync(request.ChangeRiskManagement);
                    }
                }
                else
                {

                }

                await _context.SaveChangesAsync();
                res.Message = "Record Updated Successfully";
            }
            res.ReturnValue = request;
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
