using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using TDSG.TroubleReport.Scheduler.DataModel;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Models;

namespace TDSG.TroubleReport.Scheduler
{
    public class ReminderEmails
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IConfiguration _configuration;
        public ReminderEmails(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext)

        {
            this._context = context;
            this._cloneContext = cloneContext;
            var basePath = AppContext.BaseDirectory;
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = configurationBuilder.Build();
        }
        public bool SendEmailNotification(List<string> toAddressIds, List<string> ccAddress, StringBuilder emailBody, string emailSubject)
        {
            bool emailSent = false;
            string? smtpUserName = _configuration["SMTPUserName"];
            string? smtpPassword = _configuration["SMTPPassword"];

            try
            {
                if (toAddressIds?.Count > 0 && emailBody?.Length > 0)
                {
                    string? IsDevelopmentStage = _configuration["IsDevelopmentStage"]?.ToUpper();
                    if (IsDevelopmentStage == "NO")
                    {
                        List<string> ccAddressIds = new List<string>();

                        if (ccAddress?.Count > 0)
                        {
                            foreach (var ccAddressObj in ccAddress)
                            {
                                ccAddressIds.Add(ccAddressObj);
                            }
                        }
                        emailSent = SendEmailBySharePoint(toAddressIds, ccAddressIds, emailSubject, emailBody);
                        return emailSent;
                    }
                    else
                    {
                        string? emailFromAddress = _configuration["MailSettings:From"];
                        string? host = _configuration["MailSettings:Host"];

                        using (MailMessage mailMessage = new MailMessage())
                        {
                            mailMessage.From = new MailAddress(emailFromAddress);
                            if (toAddressIds?.Count > 0)
                            {
                                foreach (var toAddress in toAddressIds)
                                {
                                    mailMessage.To.Add(toAddress);
                                }
                            }
                            mailMessage.Subject = emailSubject;
                            mailMessage.Body = emailBody?.ToString();
                            mailMessage.IsBodyHtml = true;

                            if (ccAddress?.Count > 0)
                            {
                                foreach (var ccAddressObj in ccAddress)
                                {
                                    mailMessage.CC.Add(ccAddressObj);
                                }
                            }


                            using (SmtpClient smtpClient = new SmtpClient(host))
                            {
                                smtpClient.Send(mailMessage);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmailNotification");
                return false;
            }

            return emailSent;
        }

        private bool SendEmailBySharePoint(List<string> toAddress, List<string> ccAddress, string subject, StringBuilder body)
        {
            bool emailSent = false;
            try
            {
                string IsMailSendBySMTPSP = _configuration["IsMailSendBySMTPSP"].ToUpper();
                if (IsMailSendBySMTPSP == "YES")
                {
                    string smtpUserName = _configuration["SMTPUserName"];
                    string smtpPassword = _configuration["SMTPPassword"];

                    using (MailMessage mm = new MailMessage())
                    {
                        mm.Subject = subject;
                        mm.Body = body.ToString();
                        mm.From = new MailAddress(smtpUserName, _configuration["SmtpSettings:From"]);

                        if (toAddress?.Count > 0)
                        {
                            foreach (var toId in toAddress)
                            {
                                mm.To.Add(toId);
                            }
                        }

                        if (ccAddress?.Count > 0)
                        {
                            foreach (var ccId in ccAddress)
                            {
                                mm.CC.Add(ccId);
                            }
                        }

                        mm.IsBodyHtml = true;

                        using (SmtpClient smtp = new SmtpClient(_configuration["MailSettings:Host"]))
                        {
                            smtp.EnableSsl = Convert.ToBoolean(_configuration["MailSettings:EnableSsl"]);
                            smtp.UseDefaultCredentials = Convert.ToBoolean(_configuration["MailSettings:UseDefaultCredentials"]);
                            smtp.Credentials = new NetworkCredential(smtpUserName, smtpPassword);
                            smtp.Port = Convert.ToInt32(_configuration["MailSettings:Port"]);
                            smtp.Send(mm);
                            emailSent = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmailBySharePoint");
                return false;
            }

            return emailSent;
        }

        public bool SendEmailReminder(int? troubleId, string templateFile, string emailSubject, List<int?> employeeId = null)
        {
            bool emailSent = false;
            try
            {

                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                EmployeeMaster? requesterUserDetail = null;
                string? requesterUserName = null, requesterUserEmail = null;

                EmployeeMaster? raiserDetails = null;
                string? raiserCCName = null, raiserCCEmail = null;

                EmployeeMaster? raiserManagerData = null;
                string? raiserManagerName = null, raiserManagerEmail = null;


                EmployeeMaster? workdoneleadManagerdata = null;
                string? workdoneleadManagerName = null, workdoneleadManagerEmail = null;

                StringBuilder emailBody = new StringBuilder();
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                string? templateFilePath = null;

                //prod link
                 string? documentLink = _configuration["SPSiteUrl"] +
                  "/SitePages/Trouble-Report.aspx#/";

                //stage link
                //string? documentLink = _configuration["SPSiteUrl"] +
               // "/SitePages/CellFormatStage.aspx#/";

                string? troubleReportNo = null;
                string? reportTitle = null;
                List<string> emailToAddressList = new List<string>();
                List<string> emailCCAddressList = new List<string>();
               


                if(troubleId != null)
                {
                    var reaiser = _context.TroubleReports.Where(x => x.TroubleReportId == troubleId && x.IsDeleted == false).Select(x => x.CreatedBy).FirstOrDefault();
                    raiserDetails = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == reaiser);
                    raiserCCName = raiserDetails?.EmployeeName; //CommonMethod.CombinateEmployeeName(requesterUserDetail?.EmployeeName, requesterUserDetail?.EmployeeCode);
                    raiserCCEmail = raiserDetails?.Email;
                    emailCCAddressList.Add(raiserCCEmail);

                    //var raiserRM = _context.TroubleReports.Where(x => x.TroubleReportId == troubleId && x.IsDeleted == false).Select(x => x.CreatedBy).FirstOrDefault();
                    var raiserRmID = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == reaiser && x.IsActive == true).Select(x => x.ReportingManagerId).FirstOrDefault();
                    raiserManagerData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == raiserRmID);
                    raiserManagerName = raiserManagerData?.EmployeeName; //CommonMethod.CombinateEmployeeName(requesterUserDetail?.EmployeeName, requesterUserDetail?.EmployeeCode);
                    raiserManagerEmail = raiserManagerData?.Email;

                    foreach(var employee in employeeId)
                    {
                        if(employee != raiserRmID)
                        {
                            emailCCAddressList.Add(raiserManagerEmail);
                        }
                    }
                   
                    var workdonelead = _context.WorkDoneDetails.Where(x => x.TroubleReportId == troubleId && x.IsDeleted == false && x.Lead == true).Select(x => x.EmployeeId).FirstOrDefault();
                    if(workdonelead != null)
                    {
                        var wdlLead = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == workdonelead && x.IsActive == true).Select(x => x.ReportingManagerId).FirstOrDefault();
                        workdoneleadManagerdata = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == wdlLead);
                        workdoneleadManagerName = workdoneleadManagerdata?.EmployeeName; //CommonMethod.CombinateEmployeeName(requesterUserDetail?.EmployeeName, requesterUserDetail?.EmployeeCode);
                        workdoneleadManagerEmail = workdoneleadManagerdata?.Email;
                        emailCCAddressList.Add(workdoneleadManagerEmail);
                    }
                }

                if (employeeId != null)
                {
                    foreach (var employee in employeeId)
                    {
                        requesterUserDetail = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == employee);
                        requesterUserName = requesterUserDetail?.EmployeeName; //CommonMethod.CombinateEmployeeName(requesterUserDetail?.EmployeeName, requesterUserDetail?.EmployeeCode);
                        requesterUserEmail = requesterUserDetail?.Email;
                        emailToAddressList.Add(requesterUserEmail);
                    }
                }

                if (troubleId > 0)
                {
                    troubleReportNo = _context.TroubleReports.Where(x => x.TroubleReportId == troubleId && x.IsDeleted == false).Select(x => x.TroubleReportNo).FirstOrDefault();
                    reportTitle = _context.TroubleReports.Where(x => x.TroubleReportId == troubleId && x.IsDeleted == false).Select(x => x.ReportTitle).FirstOrDefault();

                }
                if (!string.IsNullOrEmpty(templateFile))
                {
                    string baseDirectory = AppContext.BaseDirectory;
                    //string projectRootDirectory = Directory.GetParent(baseDirectory).Parent.Parent.Parent.Parent.FullName;
                    //templateFilePath = Path.Combine(projectRootDirectory, templateDirectory, templateFile);
                    //string? projectRootDirectory = null;

                    //string docLink = documentLink + "form/view/" + troubleId;

                    templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                    if (!string.IsNullOrEmpty(templateFilePath))
                    {
                        emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                    }
                    if (emailBody?.Length > 0)
                    {
                        string docLink = documentLink + "form/edit/" + troubleId;

                        emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                        emailBody = emailBody.Replace("#TroubleReportNo#", troubleReportNo);
                        emailBody = emailBody.Replace("#ReporTitle#", reportTitle);
                        emailBody = emailBody.Replace("#TroubleLink#", docLink);

                        emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);

                        var requestData = new EmailLogMaster()
                        {
                            FormId = troubleId,
                            EmailBody = emailBody.ToString(),
                            EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                            EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                            EmailSubject = emailSubject.ToString(),
                            EmailSentTime = DateTime.Now,
                            isDelete = false,
                            IsEmailSent = emailSent,
                        };
                        _context.EmailLogMasters.Add(requestData);
                        _context.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }
    }
}
