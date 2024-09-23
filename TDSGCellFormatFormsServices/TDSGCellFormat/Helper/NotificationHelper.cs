using Azure.Core;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Mail;
using System.Text;
using TDSGCellFormat.Common;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Helper
{
    public class NotificationHelper
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IConfiguration _configuration;
        private readonly HttpContext httpContext;

        public NotificationHelper(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext)
        {
            this._context = context;
            this._cloneContext = cloneContext;

            /* var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "TDSGCellFormat");
             var configurationBuilder = new ConfigurationBuilder()
                 .SetBasePath(basePath)
                 .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
             _configuration = configurationBuilder.Build();*/

            var basePath = Path.Combine(Directory.GetCurrentDirectory());
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
                            //mailMessage.CC.Add("jipanchal@synoptek.com");
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
                            //mailMessage.CC.Add("jipanchal@synoptek.com");

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
                var commonHelper = new CommonHelper(_context);
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
                        //mm.CC.Add("jipanchal@synoptek.com");
                        //mm.CC.Add("bdavawala@synoptek.com");
                        using (SmtpClient smtp = new SmtpClient(_configuration["MailSettings:Host"]))
                        {
                            smtp.EnableSsl = Convert.ToBoolean(_configuration["MailSettings:EnableSsl"]);
                            smtp.UseDefaultCredentials = false;
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
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "SendEmailBySharePoint");
                return false;
            }

            return emailSent;
        }
        public async Task<bool> SendEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                //TroubleReports troubleReports = new TroubleReports();
                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false, isInReviewPullBack = false;
                bool isIsAmendTask = false;
                bool isRequestorinToEmail = false, isReqCCMail = false;
                bool isWorkDoneLeadinTOMail = false;
                bool notifyRM = false, notifyRMCC = false, notifyWMCC = false;
                //bool notifyWorkDone = false;
                bool notifyReviewManager = false;
                //bool allow = false, decline = false;
                string? rmName = null, rmEmail = null;
                bool isReOpen = false;
                string? reopenMemName = null, reopenMemEmail = null;
                string? workManagerName = null, workManagerEmail = null;
                string? requesterUserName = null, requesterUserEmail = null;
                string? workDoneName = null, workDoneEmail = null;
                string? workDoneLeadName = null, workDoneLeadEmail = null;
                string? templateFile = null, templateFilePath = null;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                bool approvelink = false;
                //string? templateFilePath = null;
                string? documentLink = _configuration["SPSiteUrl"] +
                    "/SitePages/CellFormatForms.aspx#/trouble-report/";
                StringBuilder emailBody = new StringBuilder();
                if (requestId > 0)
                {
                    var troubleReports = _context.TroubleReports.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false).FirstOrDefault();
                    if (troubleReports != null)
                    {
                        if (troubleReports.CreatedBy > 0)
                        {
                            EmployeeMaster? requesterUserDetail = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == troubleReports.CreatedBy);
                            requesterUserName = requesterUserDetail?.EmployeeName;
                            requesterUserEmail = requesterUserDetail?.Email;

                            //wokrdone people 

                        }
                        var workDoneData = _context.WorkDoneDetails.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();
                        var workDoneEmails = new List<string?>();
                        if (workDoneData.Count > 0)
                        {
                            foreach (var employee in workDoneData)
                            {
                                EmployeeMaster? workDonePeople = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == employee);
                                workDoneName = workDonePeople?.EmployeeName;
                                workDoneEmails.Add(workDonePeople?.Email);
                            }
                        }

                        var workDoneLead = _context.WorkDoneDetails.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false && x.Lead == true).Select(x => x.EmployeeId).FirstOrDefault();
                        if (workDoneLead != null)
                        {
                            EmployeeMaster? workDoneLeadData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == workDoneLead);
                            workDoneLeadName = workDoneLeadData?.EmployeeName;
                            workDoneLeadEmail = workDoneLeadData?.Email;
                        }

                        var reportingManager = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == requestId && x.IsClsoed == false && x.ProcessName == Enums.ReportingManager).Select(x => x.ReviewerId).FirstOrDefault();
                        if (reportingManager != null)
                        {
                            EmployeeMaster? reportingManagerData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == reportingManager);
                            rmName = reportingManagerData?.EmployeeName;
                            rmEmail = reportingManagerData?.Email;
                        }


                        var workdDoneManager = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == requestId && x.IsClsoed == false && x.ProcessName == Enums.WorkDoneManager).Select(x => x.ReviewerId).FirstOrDefault();
                        if (workdDoneManager != null)
                        {
                            EmployeeMaster? workDoneManagerData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == workdDoneManager);
                            workManagerName = workDoneManagerData?.EmployeeName;
                            workManagerEmail = workDoneManagerData?.Email;
                        }

                        var approverData = await _context.GetTroubleReportWorkFlowData(requestId);
                        switch (emailNotification)
                        {
                            case EmailNotificationAction.Submitted:
                                templateFile = "TroubleReport_Submitted.html";
                                emailSubject = string.Format("Submitted {0}", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                isInReviewTask = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "TroubleReport_ReSubmitted.html";
                                emailSubject = string.Format("ReSubmitted {0}", troubleReports.TroubleReportNo);
                                isIsAmendTask = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "TroubleReport_Approved.html";
                                emailSubject = string.Format("[Action required!] Approval required {0}", troubleReports.TroubleReportNo);
                                isInReviewTask = true;
                                isApprovedtask = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.ApproveInformed:
                                templateFile = "TroubleReport_ApprovedInfo.html";
                                emailSubject = string.Format("[Information!] Approval Done {0}", troubleReports.TroubleReportNo);
                                isApprovedtask = true;
                                isWorkDoneLeadinTOMail = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "TroubleReport_PullBack.html";
                                emailSubject = string.Format("Pullback of Trouble Report Request No. {0}", troubleReports.TroubleReportNo);
                                isApprovedtask = true;
                                isRequestorinToEmail = true;
                                notifyRM = true;
                                notifyReviewManager = true;
                                isInReviewPullBack = true;
                                break;

                            case EmailNotificationAction.Amended:
                                templateFile = "TroubleReport_AskForAmendment.html";
                                emailSubject = string.Format("Amendment of Trouble Report Request No. {0}", troubleReports.TroubleReportNo);
                                isIsAmendTask = true;
                                isWorkDoneLeadinTOMail = true;
                                break;

                            case EmailNotificationAction.Reopen:
                                templateFile = "TroubleReport_ReOpen.html";
                                emailSubject = string.Format("[Information] Trouble Report ReOpen {0}", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                isReOpen = true;
                                break;

                            case EmailNotificationAction.Rejected:
                                templateFile = "TroubleReport_Rejected.html";
                                emailSubject = string.Format("[Information] Trouble Report Request Rejected {0}", troubleReports.TroubleReportNo);
                                isRequestorinToEmail = true;
                                isWorkDoneLeadinTOMail = true;
                                isReqCCMail = true;
                                break;

                            case EmailNotificationAction.NotifyManager:
                                templateFile = "TroubleReport_NotifyRM.html";
                                emailSubject = string.Format("[Action required!] ", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                notifyRM = true;
                                break;

                            case EmailNotificationAction.NotifyWokrDone:
                                templateFile = "TroubleReport_NotifyWorkDone.html";
                                emailSubject = string.Format("[Information] {0}", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                notifyRMCC = true;
                                break;

                            case EmailNotificationAction.NotifyReviewManager:
                                templateFile = "TroubleReport_ReviewManager.html";
                                emailSubject = string.Format("[Action required!] Approval required {0}", troubleReports.TroubleReportNo);
                                notifyRM = true;
                                notifyReviewManager = true;
                                isReqCCMail = true;
                                break;

                            case EmailNotificationAction.Allow:
                                templateFile = "TroubleReport_Allow.html";
                                emailSubject = string.Format("[Information] {0}", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                break;

                            case EmailNotificationAction.AllowBoth:
                                templateFile = "TroubleReport_AllowBoth.html";
                                emailSubject = string.Format("[Information] Both Manager Allow {0}", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                notifyWMCC = true;
                                notifyRMCC = true;
                                break;

                            case EmailNotificationAction.Decline:
                                templateFile = "TroubleReport_Decline.html";
                                emailSubject = string.Format("[Information] Trouble Report Request Declined {0}", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "TroubleReport_Completed.html";
                                emailSubject = string.Format("[Information] Trouble Report Request Completed{0}", troubleReports.TroubleReportNo);
                                isRequestorinToEmail = true;
                                isReqCCMail = true;
                                break;

                            default:
                                break;
                        }

                        if (isReqCCMail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);

                        }
                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                            emailCCAddressList.Remove(requesterUserEmail);
                        }
                        if (workDoneData.Count > 0)
                        {
                            foreach (var email in workDoneEmails)
                            {
                                if (isWorkDoneLeadinTOMail)
                                {
                                    emailToAddressList.Add(email);
                                    emailCCAddressList.Remove(email);
                                }
                                else
                                {
                                    emailCCAddressList.Add(email);
                                }
                            }

                        }
                        if (isReOpen)
                        {
                            EmployeeMaster? reopenMemData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == nextApproverTaskId);
                            reopenMemName = reopenMemData?.EmployeeName;
                            reopenMemEmail = reopenMemData?.Email;
                            emailToAddressList.Add(reopenMemEmail);
                        }
                        if (notifyRM)
                        {
                            emailToAddressList.Add(rmEmail);
                        }
                        if (notifyRMCC)
                        {
                            emailCCAddressList.Add(rmEmail);
                        }
                        if (notifyWMCC)
                        {
                            emailCCAddressList.Add(workManagerEmail);
                        }
                        if (notifyReviewManager)
                        {
                            emailToAddressList.Add(workManagerEmail);
                        }
                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString())
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                        }
                        if (isInReviewPullBack)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isApprovedtask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }
                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }
                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                           // string action = null;
                            string docLink = null;
                           
                            var query = httpContext.Request.Query;
                            string? reqId = query["requestId"];
                            string? action = query["approval"];
                            //string projectRootDirectory = Directory.GetParent(baseDirectory).Parent.Parent.Parent.Parent.FullName;
                            //templateFilePath = Path.Combine(projectRootDirectory, templateDirectory, templateFile);
                            string? projectRootDirectory = null;
                            if (baseDirectory.Contains("Stage"))
                            {
                                // Stage environment path
                                projectRootDirectory = @"D:\Stage\CellFormat";
                            }
                            templateFilePath = Path.Combine(projectRootDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if(approvelink) 
                                {
                                     docLink = documentLink + "form/view/" + reqId + "?action=approval";
                                }
                                else
                                {
                                    docLink = documentLink + "form/view/" + requestId ;
                                }
                                emailBody = emailBody.Replace("#TroubleLink#", docLink);
                                emailBody = emailBody.Replace("#TroubleReportNo#", troubleReports.TroubleReportNo);
                                emailBody = emailBody.Replace("#ReportTitle#", troubleReports.ReportTitle);
                                if (nextApproverTaskId == reportingManager)
                                {
                                    emailBody = emailBody.Replace("#ReviewManager#", rmName);
                                }
                                else
                                {
                                    emailBody = emailBody.Replace("#ReviewManager#", workManagerName);
                                }
                                emailBody = emailBody.Replace("#EmployeeName#", requesterUserName);
                                emailBody = emailBody.Replace("#RequestorName#", requesterUserName);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailBody = emailBody.Replace("#Raiser#", requesterUserName);
                                emailBody = emailBody.Replace("#WorkDoneLead#", workDoneLeadName);
                                emailBody = emailBody.Replace("#Manager#", rmName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#AmendmendBy#", "");
                                emailBody = emailBody.Replace("#ApprovedBy#", "");

                                emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                // InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Raiser", "Form Send to Manager", ApprovalTaskStatus.InProcess.ToString(), userId, HistoryAction.SendToManager.ToString(), 0);

                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "SendEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendEmail1(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                StringBuilder? emailBody = new StringBuilder();
                emailBody = null;
                List<string> emailtolist = new List<string>();
                List<string> emailcclist = new List<string>();
                string? reuqestuser = "spo_test006@tdsgj.co.in";
                string? requerscc = "spo_test005@tdsgj.co.in";
                emailtolist.Add(reuqestuser);
                emailcclist.Add(requerscc);
                emailSent = SendEmailNotification(emailtolist, emailcclist, emailBody, "static mail");
                /* var requestData = new EmailLogMaster()
                 {
                     FormId = requestId,
                     EmailBody = emailBody.ToString(),
                     EmailCC = string.Join(",", emailtolist.Distinct().ToList()),
                     EmailTo = string.Join(",", emailcclist.Distinct().ToList()),
                     EmailSubject = "static mail",
                     EmailSentTime = DateTime.Now,
                     isDelete = false,
                     IsEmailSent = emailSent,
                 };
                 _context.EmailLogMasters.Add(requestData);
                 _context.SaveChanges();*/

            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "SendEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }
    }
}