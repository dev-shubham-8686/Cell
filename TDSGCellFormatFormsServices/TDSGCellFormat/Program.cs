using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Implementation.Repository;
using TDSGCellFormat.Implementation.Service;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.IgnoreNullValues = true; // Optional: Ignore null values
                options.JsonSerializerOptions.PropertyNamingPolicy = null; // Optional: CamelCase property names
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; // Optional: Preserve references
                                                                                                                               // options.JsonSerializerOptions.MaxDepth = 64; // Optional: Max depth of object graph
                                                                                                                               // Add any other customization as needed
            });
builder.Services.AddScoped<CommonHelper>();
builder.Services.AddScoped<IMasterService, MasterService>();

builder.Services.AddScoped<IAdjustMentReporttService, AdjustMentReporttService>();
//builder.Services.AddScoped<IAdjustMentReportRepository, AdjustMentReportRepository>();

builder.Services.AddScoped<IApplicationImprovementService, ApplicationImprovementService>();
builder.Services.AddScoped<IApplicationImprovementRepository, ApplicationImprovementRepository>();


builder.Services.AddScoped<IMaterialConsumptionService, MaterialConsumptionService>();
builder.Services.AddScoped<IMatrialConsumptionRepository, MaterialConsumptionRepository>();

builder.Services.AddScoped<ITechnicalInstructionService, TechnicalInstructionService>();
builder.Services.AddScoped<ITechnicalInsurtuctionRepository, TechnicalInstructionRepository>();

builder.Services.AddScoped<ITroubleReportService, TroubleReportService>();
builder.Services.AddScoped<ITroubleReportRepository, TroubleReportRepository>();
//DefaultConnection //TdsgCellFormatDivisionContext
builder.Services.AddDbContext<TdsgCellFormatDivisionContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AepplNewCloneStageContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("EmployeeConnection")));
var empConnectionstring = builder.Configuration.GetConnectionString("EmployeeConnection");
builder.Services.AddTransient(_ => new TdsgCellFormatDivisionContext(connectionString));
builder.Services.AddTransient(_ => new AepplNewCloneStageContext(empConnectionstring));
builder.Services.AddHttpContextAccessor();
var app = builder.Build();

// Configure the HTTP requestSystem.AggregateException: 'Some services are not able to be constructed (Error while validating the service descriptor 'ServiceType: TDSGCellFormat.Interface.Service.ITroubleReportService Lifetime: Scoped ImplementationType: TDSGCellFormat.Implementation.Service.TroubleReportService': Unable to resolve service for type 'TDSGCellFormat.Helper.CommonHelper' while attempting to activate 'TDSGCellFormat.Implementation.Repository.TroubleReportRepository'.) (Error while validating the service descriptor 'ServiceType: TDSGCellFormat.Interface.Repository.ITroubleReportRepository Lifetime: Scoped ImplementationType: TDSGCellFormat.Implementation.Repository.TroubleReportRepository': Unable to resolve service for type 'TDSGCellFormat.Helper.CommonHelper' while attempting to activate 'TDSGCellFormat.Implementation.Repository.TroubleReportRepository'.)'
 //pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//app.UseSwagger();
//app.UseSwaggerUI();

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

