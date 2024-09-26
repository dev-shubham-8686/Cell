using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlClient;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Models;

public partial class TdsgCellFormatDivisionContext : DbContext
{
    public TdsgCellFormatDivisionContext(string connectionString)
       : this(new DbContextOptionsBuilder<TdsgCellFormatDivisionContext>()
              .UseSqlServer(connectionString, options => options.CommandTimeout(600))
              .Options)
    {

    }

    public TdsgCellFormatDivisionContext(DbContextOptions<TdsgCellFormatDivisionContext> options)
        : base(options)
    {
    }
    public TdsgCellFormatDivisionContext()
        : base()
    {
    }

    public virtual DbSet<TroubleReportReviewerTaskMaster> TroubleReportReviewerTaskMasters { get; set; }
    public virtual DbSet<AdjustmentReport> AdjustmentReports { get; set; }

    public virtual DbSet<EquipmentImprovementApplication> EquipmentImprovementApplication { get; set; }
    public virtual DbSet<EquipmentCurrSituationAttachment> EquipmentCurrSituationAttachment { get; set; }
    public virtual DbSet<EquipmentImprovementAttachment> EquipmentImprovementAttachment { get; set; }
    public virtual DbSet<ChangeRiskManagement> ChangeRiskManagement { get; set; }
    public virtual DbSet<TroubleAttachment> TroubleAttachments { get; set; }
    public DbSet<TroubleReportNumberResult> TroubleReportNumberResults { get; set; }

    [NotMapped]
    public DbSet<TroubleReportResult> TroubleReportResults { get; set; }
    [NotMapped]
    public DbSet<TroubleRevisionResult> TroubleRevisionResults { get; set; }

    public virtual DbSet<Category> Categories { get; set; }
    public DbSet<JsonDataSet> JsonResults { get; set; }
    public virtual DbSet<Material> Materials { get; set; }

    public virtual DbSet<MaterialConsumptionSlip> MaterialConsumptionSlips { get; set; }

    public virtual DbSet<MaterialConsumptionSlipItem> MaterialConsumptionSlipItem { get; set; }

    public virtual DbSet<MaterialConsumptionSlipItemAttachment> MaterialConsumptionSlipItemAttachment { get; set; }

    public virtual DbSet<TechnicalInstructionSheet> TechnicalInstructionSheets { get; set; }

    public virtual DbSet<TroubleReports> TroubleReports { get; set; }

    public virtual DbSet<TroubleReportApproverTaskMaster> TroubleReportApproverTaskMasters { get; set; }
    public virtual DbSet<MaterialConsumptionApproverTaskMaster> MaterialConsumptionApproverTaskMasters { get; set; }
    public virtual DbSet<TroubleReportHistoryMaster> TroubleReportHistoryMasters { get; set; }
    public virtual DbSet<MaterialConsumptionHistoryMaster> MaterialConsumptionHistoryMasters { get; set; }
    public virtual DbSet<TroubleRevisionDetail> TroubleRevisionDetails { get; set; }
    public virtual DbSet<FunctionMaster> FunctionMaster { get; set; }
    public virtual DbSet<DeviceMaster> DeviceMasters { get; set; }
    public virtual DbSet<TroubleType> TroubleTypes { get; set; }

    public virtual DbSet<UnitOfMeasure> UnitOfMeasures { get; set; }

    public virtual DbSet<WorkDoneDetail> WorkDoneDetails { get; set; }


    public virtual DbSet<GetUserDetailsView> GetUserDetailsViews { get; set; }

    public virtual DbSet<TroubleReportExcel> TroubleReportExcels { get; set; }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<CostCenter> CostCentres { get; set; }


    public virtual DbSet<EmailLogMaster> EmailLogMasters { get; set; }

    public virtual DbSet<ExceptionLog> ExceptionLogs { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Use a connection string from a configuration file or environment variable
            optionsBuilder.UseSqlServer("Data Source=192.168.100.30;Initial Catalog=TDSG_CellFormatDivision;User Id=sa;Password=Made1981@;TrustServerCertificate=True;MultipleActiveResultSets=true;Encrypt=True;");
        }

        // Enable lazy loading proxies
        optionsBuilder.UseLazyLoadingProxies();
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<TroubleReportResult>().HasNoKey();
        modelBuilder.Entity<TroubleRevisionResult>().HasNoKey();
        modelBuilder.Entity<TroubleReportApproverTaskMasterAdd>().HasNoKey();
        modelBuilder.Entity<MaterialConsumptionApproverTaskMasterAdd>().HasNoKey();
        modelBuilder.Entity<EquipmentImprovementView>().HasNoKey();
        modelBuilder.Entity<MaterialConsumptionListView>().HasNoKey();
        //JsonDataSet
        modelBuilder.Entity<JsonDataSet>().HasNoKey();
        modelBuilder.Entity<GetUserDetailsView>().HasNoKey();
        modelBuilder.Entity<TroubleReportExcel>().HasNoKey();
        modelBuilder.Ignore<Property>();
        //modelBuilder.Entity<AdjustmentReport>(entity =>
        //{
        //    //entity.HasKey(e => e.AdjustMentReportId).HasName("PK__AdjustMe__7FBB1AFB58CF0092");

        //    entity.ToTable("AdjustmentReport");
        //    entity.Property(e => e.AdjustmentSuggestion).HasMaxLength(500);
        //    entity.Property(e => e.Area).HasMaxLength(100);
        //    entity.Property(e => e.Attachment).HasMaxLength(100);
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.DescribeProblem).HasMaxLength(500);
        //    entity.Property(e => e.Line).HasMaxLength(500);
        //    entity.Property(e => e.MachineName).HasMaxLength(100);
        //    entity.Property(e => e.MachineNum).HasMaxLength(100);
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Observation).HasMaxLength(500);
        //    entity.Property(e => e.RootCause).HasMaxLength(500);
        //    entity.Property(e => e.Status).HasMaxLength(50);
        //    entity.Property(e => e.When).HasColumnType("datetime");
        //});

        //modelBuilder.Entity<ApplicationEquipmentImprovement>(entity =>
        //{
        //    //entity.HasKey(e => e.ApplicationImprovementId).HasName("PK__Applicat__5439A1D0D7261C2C");

        //    entity.ToTable("ApplicationEquipmentImprovement");

        //    // entity.Property(e => e.ApplicationImprovementId).ValueGeneratedNever();
        //    entity.Property(e => e.Attachment).HasMaxLength(100);
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.CurrentSituation).HasMaxLength(500);
        //    entity.Property(e => e.DeviceName).HasMaxLength(50);
        //    entity.Property(e => e.Imrovement).HasMaxLength(500);
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Purpose).HasMaxLength(500);
        //    entity.Property(e => e.Status).HasMaxLength(50);
        //    entity.Property(e => e.When).HasColumnType("datetime");
        //});

        //modelBuilder.Entity<Category>(entity =>
        //{
        //    entity.HasKey(e => e.CategoryId).HasName("PK_dbo.Category");

        //    entity.ToTable("Category");

        //    entity.Property(e => e.CategoryId).ValueGeneratedNever();
        //    entity.Property(e => e.CreatedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ModifiedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Name)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //});

        //modelBuilder.Entity<Material>(entity =>
        //{
        //    entity.HasKey(e => e.MaterialId).HasName("PK_dbo.Material");

        //    entity.ToTable("Material");

        //    entity.Property(e => e.MaterialId).ValueGeneratedNever();
        //    entity.Property(e => e.CreatedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ModifiedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Name)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //});

        //modelBuilder.Entity<MaterialConsumptionSlip>(entity =>
        //{
        //    //entity.HasKey(e => e.MaterialConsumptionSlipId).HasName("PK__Material__034B4CACFD187BF0");

        //    entity.ToTable("MaterialConsumptionSlip");

        //    //entity.Property(e => e.MaterialConsumptionSlipId).ValueGeneratedNever();
        //    entity.Property(e => e.Attachment).HasMaxLength(100);
        //    entity.Property(e => e.CostCenter).HasMaxLength(100);
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Description).HasMaxLength(500);
        //    entity.Property(e => e.Glcode)
        //        .HasMaxLength(100)
        //        .HasColumnName("GLCode");
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Purpose).HasMaxLength(500);
        //    entity.Property(e => e.Quantity).HasMaxLength(100);
        //    entity.Property(e => e.Status).HasMaxLength(50);
        //    entity.Property(e => e.UOMId)
        //        .HasMaxLength(50)
        //        .HasColumnName("UOMId");
        //    entity.Property(e => e.When).HasColumnType("datetime");
        //});

        //modelBuilder.Entity<TechnicalInstructionSheet>(entity =>
        //{
        //    //entity.HasKey(e => e.TechnicalId).HasName("PK__Technica__F6E0647FC6044F5E");

        //    entity.ToTable("TechnicalInstructionSheet");

        //    //entity.Property(e => e.TechnicalId).ValueGeneratedNever();
        //    entity.Property(e => e.Attachment).HasMaxLength(100);
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Outline).HasMaxLength(500);
        //    entity.Property(e => e.ProductType).HasMaxLength(100);
        //    entity.Property(e => e.Purpose).HasMaxLength(500);
        //    entity.Property(e => e.Quantity).HasMaxLength(100);
        //    entity.Property(e => e.Status).HasMaxLength(50);
        //    entity.Property(e => e.Tisapplicable)
        //        .HasColumnType("datetime")
        //        .HasColumnName("TISApplicable");
        //    entity.Property(e => e.Title).HasMaxLength(100);
        //    entity.Property(e => e.When).HasColumnType("datetime");
        //});

        //modelBuilder.Entity<TroubleReports>(entity =>
        //{
        //    //entity.HasKey(e => e.TroubleReportId).HasName("PK__TroubleR__B620CFDD0CD998F2");
        //    entity.ToTable("TroubleReports");
        //    //entity.Property(e => e.TroubleReportId).ValueGeneratedNever();
        //    entity.Property(e => e.AdjustmentReport).HasMaxLength(500);
        //    entity.Property(e => e.Attachment).HasMaxLength(500);
        //    entity.Property(e => e.Closure).HasMaxLength(100);
        //    entity.Property(e => e.CompletionDate).HasColumnType("datetime");
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ImmediateCorrectiveAction).HasMaxLength(500);
        //    entity.Property(e => e.LotAndQuantity).HasMaxLength(100);
        //    entity.Property(e => e.Ng).HasColumnName("NG");
        //    entity.Property(e => e.Process).HasMaxLength(100);
        //    entity.Property(e => e.ProcessingLot).HasMaxLength(100);
        //    entity.Property(e => e.RootCause).HasMaxLength(500);
        //    entity.Property(e => e.Status).HasMaxLength(50);
        //    entity.Property(e => e.TroubleBriefExplanation).HasMaxLength(500);
        //    entity.Property(e => e.When).HasColumnType("datetime");
        //    entity.Property(e => e.WorkSubmittedDate).HasColumnType("datetime");
        //});

        //modelBuilder.Entity<TroubleType>(entity =>
        //{
        //    entity.HasKey(e => e.TroubleId).HasName("PK_dbo.TroubleType");

        //    entity.ToTable("TroubleType");

        //    entity.Property(e => e.TroubleId).ValueGeneratedNever();
        //    entity.Property(e => e.CreatedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ModifiedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Name)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //});

        //modelBuilder.Entity<UnitOfMeasure>(entity =>
        //{
        //    entity.HasKey(e => e.Uomid).HasName("PK_dbo.UnitOfMeasure");

        //    entity.ToTable("UnitOfMeasure");

        //    entity.Property(e => e.Uomid)
        //        .ValueGeneratedNever()
        //        .HasColumnName("UOMId");
        //    entity.Property(e => e.CreatedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.CreatedDate).HasColumnType("datetime");
        //    entity.Property(e => e.ModifiedBy)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //    entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
        //    entity.Property(e => e.Name)
        //        .HasMaxLength(10)
        //        .IsFixedLength();
        //});

        OnModelCreatingPartial(modelBuilder);
    }
    public void CallTroubleReportApproverMatrix(int? userId, int troubleReportId)
    {
        var userIdParam = new Microsoft.Data.SqlClient.SqlParameter("@UserId", userId);
        var troubleReportIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleReportId", troubleReportId);

        Database.ExecuteSqlRaw("EXECUTE dbo.SPP_TroubleReportApproverMatrix @UserId, @TroubleReportId", userIdParam, troubleReportIdParam);
    }

    public void CallMaterialConsumptionApproverMatrix(int? userId, int materialConsumptionId)
    {
        var userIdParam = new Microsoft.Data.SqlClient.SqlParameter("@UserId", userId);
        var materialConsumptionIdParam = new Microsoft.Data.SqlClient.SqlParameter("@MaterialConsumptionId", materialConsumptionId);

        Database.ExecuteSqlRaw("EXECUTE dbo.SPP_MaterialConsuptionApproverMatrix @UserId, @MaterialConsumptionId", userIdParam, materialConsumptionIdParam);
    }

    public void ExceptionLog(string exceptionMessage, string exceptionType, string exceptionStackTrack, string webMethodName, Nullable<int> employeeId)
    {
        var exMessage = new Microsoft.Data.SqlClient.SqlParameter("@ExceptionMessage", exceptionMessage);
        var exType = new Microsoft.Data.SqlClient.SqlParameter("@ExceptionType", exceptionType);
        var exStackTrace = new Microsoft.Data.SqlClient.SqlParameter("@ExceptionStackTrack", exceptionStackTrack);
        var webMethod = new Microsoft.Data.SqlClient.SqlParameter("@WebMethodName", webMethodName);
        var empId = new Microsoft.Data.SqlClient.SqlParameter("@EmployeeId", employeeId);

        Database.ExecuteSqlRaw("EXECUTE dbo.SPP_TraceExceptionLog @ExceptionMessage, @ExceptionType , @ExceptionStackTrack ,@WebMethodName,@EmployeeId", exMessage, exType, exStackTrace, webMethod, empId);
    }
    public async Task<List<TroubleReportApproverTaskMasterAdd>> GetTroubleReportWorkFlowData(int troubelReportId)
    {
        var userIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleReportId", troubelReportId);
        return await this.Set<TroubleReportApproverTaskMasterAdd>()
            .FromSqlRaw("EXEC SPP_GetTroubleReportWorkFlowDetails @TroubleReportId", userIdParam)
            .ToListAsync();
    }

    public async Task<List<MaterialConsumptionApproverTaskMasterAdd>> GetMaterialWorkFlowData(int materialConsumptionId)
    {
        var userIdParam = new Microsoft.Data.SqlClient.SqlParameter("@MaterialConsumptionId", materialConsumptionId);
        return await this.Set<MaterialConsumptionApproverTaskMasterAdd>()
            .FromSqlRaw("EXEC SPP_GetMaterialConsumptionWorkFlowDetails @MaterialConsumptionId", userIdParam)
            .ToListAsync();
    }
    public async Task<GetUserDetailsView> GetUserRole(string email)
    { 
        var emailParam = new Microsoft.Data.SqlClient.SqlParameter("@UserEmail", email);
        var result =  await this.Set<GetUserDetailsView>()
            .FromSqlRaw("EXEC SPP_GetUserDetails @UserEmail",emailParam)
            .ToListAsync();

        return result.FirstOrDefault();
     
    }

    public async Task<List<TroubleReportExcel>> GetTroubleReportExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
    {
        var fromDateParam = new Microsoft.Data.SqlClient.SqlParameter("@FromDate", fromDate.ToString("yyyy-MM-dd"));
        var toDateParam = new Microsoft.Data.SqlClient.SqlParameter("@ToDate", toDate.ToString("yyyy-MM-dd"));
        var employeeIdParam = new Microsoft.Data.SqlClient.SqlParameter("@EmployeeId", employeeId);
        var typeIdParam = new Microsoft.Data.SqlClient.SqlParameter("@Type", type);
        var result = await this.Set<TroubleReportExcel>()
        .FromSqlRaw("EXEC GetTroubleReportExcel @FromDate, @ToDate , @EmployeeId,@Type", fromDateParam, toDateParam, employeeIdParam,typeIdParam)
        .ToListAsync();
        return result;

    }

    public async Task<List<EquipmentImprovementView>> GetEquipmentImprovementApplication(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
    {
        var createdParam = new Microsoft.Data.SqlClient.SqlParameter("@createdOne", createdBy);
        var skipParam = new Microsoft.Data.SqlClient.SqlParameter("@skip", skip);
        var takeParam = new Microsoft.Data.SqlClient.SqlParameter("@take", take);
        var orderParam = new Microsoft.Data.SqlClient.SqlParameter("@order", order ?? string.Empty);
        var orderByParam = new Microsoft.Data.SqlClient.SqlParameter("@orderBy", orderBy ?? string.Empty);
        var columnParam = new Microsoft.Data.SqlClient.SqlParameter("@searchColumn", searchColumn ?? string.Empty);
        var valueParam = new Microsoft.Data.SqlClient.SqlParameter("@searchValue", searchValue ?? string.Empty);

        return await this.Set<EquipmentImprovementView>()
            .FromSqlRaw("EXEC GetEquipmentImprovementApplication @createdOne,@skip,@take,@order,@orderBy,@searchColumn,@searchValue", createdParam,skipParam,takeParam,orderParam,orderByParam,columnParam,valueParam)
            .ToListAsync();
    }

    public async Task<List<MaterialConsumptionListView>> GetMaterialConsumptionList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
    {
        var createdParam = new Microsoft.Data.SqlClient.SqlParameter("@createdOne", createdBy);
        var skipParam = new Microsoft.Data.SqlClient.SqlParameter("@skip", skip);
        var takeParam = new Microsoft.Data.SqlClient.SqlParameter("@take", take);
        var orderParam = new Microsoft.Data.SqlClient.SqlParameter("@order", order ?? string.Empty);
        var orderByParam = new Microsoft.Data.SqlClient.SqlParameter("@orderBy", orderBy ?? string.Empty);
        var columnParam = new Microsoft.Data.SqlClient.SqlParameter("@searchColumn", searchColumn ?? string.Empty);
        var valueParam = new Microsoft.Data.SqlClient.SqlParameter("@searchValue", searchValue ?? string.Empty);

        return await this.Set<MaterialConsumptionListView>()
            .FromSqlRaw("EXEC GetMaterialConsumptionSlips1 @createdOne,@skip,@take,@order,@orderBy,@searchColumn,@searchValue", createdParam, skipParam, takeParam, orderParam, orderByParam, columnParam, valueParam)
            .ToListAsync();
    }
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
