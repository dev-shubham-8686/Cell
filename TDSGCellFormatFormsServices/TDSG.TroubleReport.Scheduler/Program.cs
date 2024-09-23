using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TDSGCellFormat.Models;
using Microsoft.EntityFrameworkCore;
using TDSG.TroubleReport.Scheduler;
using Microsoft.Extensions.Configuration;
using TDSGCellFormat;
using DocumentFormat.OpenXml.Bibliography;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;

public class Program
{
    public static void Main(string[] args)
    {

        var host = CreateHostBuilder(args).Build();
        string? templateFile = null;
        string? emailSubject = null;
        var builder = new ConfigurationBuilder();

        // Get the directory of the other project where appSettings.json is located
        string pathToOtherProject = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "TDSGCellFormat");

        // Specify the full path to appSettings.json
        builder.SetBasePath(pathToOtherProject)
               .AddJsonFile("appSettings.json", optional: false, reloadOnChange: true);

        IConfiguration config = builder.Build();
        using (var scope = host.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<TdsgCellFormatDivisionContext>();
            var context = scope.ServiceProvider.GetRequiredService<AepplNewCloneStageContext>();
            var icaReport = dbContext.TroubleReports
                                   .Where(tr => tr.ImmediateCorrectiveAction == null &&
                                                EF.Functions.DateDiffHour(tr.When, DateTime.Now) >= 48)
                                   .ToList();
            var reminderEmails = new ReminderEmails(dbContext, context);

            foreach (var report in icaReport)
            {
                DateTime now = DateTime.Now;
                DateTime lastEmailSent = (DateTime)(report?.LastEmailSent ?? report?.When); // Use the report creation time if no email was sent
                TimeSpan hoursSinceLastEmail = now - lastEmailSent;
                //int hoursSinceLastEmail = (int)hours.TotalHours;
                //double hoursSinceLastEmail = difference.TotalHours;
                //var emailFlag = report.RaiserEmailSent;
                var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                var sectionHead = context.EmployeeMasters.Where(x => x.EmployeeID == raiser && x.IsActive == true).Select(x => x.ReportingManagerId).ToList();

                var departMentHead = (from em in context.EmployeeMasters
                                      join dm in context.DepartmentMasters on em.DepartmentID equals dm.DepartmentID
                                      where em.EmployeeID == raiser && em.IsActive == true
                                      select dm.Head).ToList();

                var divisionHead = (from e in context.EmployeeMasters
                                    join dm in context.DepartmentMasters on e.DepartmentID equals dm.DepartmentID
                                    join div in context.DivisionMasters on dm.DivisionID equals div.DivisionID
                                    where e.EmployeeID == raiser && e.IsActive == true
                                    select new
                                    {
                                        Head = div.Head,
                                        DeputyDivisionHead = div.DeputyDivisionHead
                                    }).ToList();

               // var twentyFourHours = TimeSpan.FromHours(24);
                templateFile = "TroubleReport_ICA.html";
                emailSubject = $"ICA Reminder for Trouble Report Number: {report.TroubleReportNo}";
                if (report.RaiserEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to workdone people for 3 days
                    var workDonePeople = dbContext.WorkDoneDetails.Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();

                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,workDonePeople);
                    report.RaiserEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if (report.RaiserEmailSent == 3 && report.ManagerEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to manager
                    //var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,sectionHead);
                    report.ManagerEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if (report.ManagerEmailSent == 3 && report.DepartMentHeadEmailSent <3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //email to department head


                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject, departMentHead);
                    report.DepartMentHeadEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if(report.DepartMentHeadEmailSent == 3 && report.DivisionHeadEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {

                    var combinedList = divisionHead.SelectMany(d => new List<int?> { d.Head, d.DeputyDivisionHead })
                                     .Where(id => id.HasValue) // Optional: filter out nulls if needed
                                     .ToList();
                    //send an email to division Head
                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,  combinedList); // If RaiserEmailSent is 3 or more, skip sending any more emails
                    report.DivisionHeadEmailSent += 1;
                    report.LastEmailSent = now;
                }

                dbContext.SaveChanges(); // Save the changes to the database
                Console.WriteLine($"Sending email for Report ID: {report.TroubleReportId}, Email Type: {report.RaiserEmailSent + 1}");
               
             

            }


            //change the fields for the RCA count
            var rcaReport = dbContext.TroubleReports
                                   .Where(tr => tr.ImmediateCorrectiveAction == null &&
                                                EF.Functions.DateDiffDay(tr.When, DateTime.Now) >= 7)
                                   .ToList();

            foreach (var rca in rcaReport)
            {
                DateTime now = DateTime.Now;
                DateTime rcaLastEmailSent = (DateTime)(rca?.LastRCAEmailSent ?? rca?.When); // Use the report creation time if no email was sent
                TimeSpan hoursSinceLastEmail = now - rcaLastEmailSent;
                //var emailFlag = report.RaiserEmailSent;
                var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == rca.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                var sectionHead = context.EmployeeMasters.Where(x => x.EmployeeID == raiser && x.IsActive == true).Select(x => x.ReportingManagerId).ToList();

                var departMentHead = (from em in context.EmployeeMasters
                                      join dm in context.DepartmentMasters on em.DepartmentID equals dm.DepartmentID
                                      where em.EmployeeID == raiser && em.IsActive == true
                                      select dm.Head).ToList();

                var divisionHead = (from e in context.EmployeeMasters
                                    join dm in context.DepartmentMasters on e.DepartmentID equals dm.DepartmentID
                                    join div in context.DivisionMasters on dm.DivisionID equals div.DivisionID
                                    where e.EmployeeID == raiser && e.IsActive == true
                                    select new
                                    {
                                        Head = div.Head,
                                        DeputyDivisionHead = div.DeputyDivisionHead
                                    }).ToList();
            
                //var emailFlag = report.RaiserEmailSent;
                templateFile = "TroubleReport_RCA.html";
                emailSubject = $"RCA Reminder for Trouble Report Number: {rca.TroubleReportNo}";
                if (rca.RaiseEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to workdone people for 3 days
                    var workDonePeople = dbContext.WorkDoneDetails.Where(x => x.TroubleReportId == rca.TroubleReportId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();

                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject,  workDonePeople);
                    rca.RaiseEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.RaiseEmailRCA == 3 && rca.ManagerEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to manager
                    //var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject, sectionHead);
                    rca.ManagerEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.ManagerEmailRCA == 3 && rca.DepartMentHeadEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //email to department head
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject, departMentHead);
                    rca.DepartMentHeadEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.DepartMentHeadEmailRCA == 3 && rca.DivisionHeadRCAEmail < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to division Head
                    var combinedList = divisionHead.SelectMany(d => new List<int?> { d.Head, d.DeputyDivisionHead })
                                     .Where(id => id.HasValue) // Optional: filter out nulls if needed
                                     .ToList();
                    
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject,  combinedList); // If RaiserEmailSent is 3 or more, skip sending any more emails
                }

                dbContext.SaveChanges(); // Save the changes to the database
                Console.WriteLine($"Sending email for Report ID: {rca.TroubleReportId}, Email Type: {rca.RaiserEmailSent + 1}");
            }


        }
    }

    static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
         .ConfigureAppConfiguration((hostingContext, config) =>
         {
             // Specify the path to the appsettings.json file in the other project
             string pathToSettings = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "TDSGCellFormat", "appsettings.json");

             config.AddJsonFile(pathToSettings, optional: false, reloadOnChange: true)
                   .AddEnvironmentVariables();
         })
            .ConfigureServices((_, services) => {
                services.AddDbContext<TdsgCellFormatDivisionContext>(options =>
                    options.UseSqlServer("Data Source=192.168.100.30;Initial Catalog=TDSG_CellFormatDivision;User Id=sa;Password=Made1981@;TrustServerCertificate=True;MultipleActiveResultSets=true;Encrypt=True;")
                );
                services.AddDbContext<AepplNewCloneStageContext>(options =>
                    options.UseSqlServer("Data Source=192.168.100.30;Initial Catalog=AEPPL_NEW_Clone_Stage;User Id=sa;Password=Made1981@;TrustServerCertificate=True;MultipleActiveResultSets=true;Encrypt=True;")
                );


                }); // Use your actual connection string
}