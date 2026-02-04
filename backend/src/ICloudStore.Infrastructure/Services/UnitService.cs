using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Domain.Enums;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICloudStore.Infrastructure.Services;

public class UnitService : IUnitService
{
    private readonly ApplicationDbContext _context;

    public UnitService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PagedResult<UnitListDto>>> GetUnitsAsync(
        PaginationParams pagination,
        int? productId = null,
        int? categoryId = null,
        UnitStatus? status = null,
        bool? isNew = null,
        UnitCondition? condition = null,
        string? storage = null,
        string? color = null,
        int? minBatteryHealth = null,
        int? maxBatteryHealth = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool includeDeleted = false)
    {
        var query = includeDeleted 
            ? _context.Units.IgnoreQueryFilters().AsQueryable()
            : _context.Units.AsQueryable();

        query = query.Include(u => u.Product).ThenInclude(p => p.Brand)
                     .Include(u => u.Media);

        if (productId.HasValue) query = query.Where(u => u.ProductId == productId);
        if (status.HasValue) query = query.Where(u => u.Status == status);
        if (isNew.HasValue) query = query.Where(u => u.IsNew == isNew);
        if (condition.HasValue) query = query.Where(u => u.Condition == condition);
        if (!string.IsNullOrEmpty(storage)) query = query.Where(u => u.Storage == storage);
        if (!string.IsNullOrEmpty(color)) query = query.Where(u => u.Color == color);
        if (minBatteryHealth.HasValue) query = query.Where(u => u.BatteryHealthPercent >= minBatteryHealth);
        if (maxBatteryHealth.HasValue) query = query.Where(u => u.BatteryHealthPercent <= maxBatteryHealth);
        if (minPrice.HasValue) query = query.Where(u => u.PriceEGP >= minPrice);
        if (maxPrice.HasValue) query = query.Where(u => u.PriceEGP <= maxPrice);

        if (categoryId.HasValue)
        {
            query = query.Where(u => u.Product.ProductCategories.Any(pc => pc.CategoryId == categoryId));
        }

        var totalCount = await query.CountAsync();

        var units = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var result = new PagedResult<UnitListDto>
        {
            Items = units.Select(MapToListDto).ToList(),
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };

        return ApiResponse<PagedResult<UnitListDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<UnitDto>> GetUnitByIdAsync(int id)
    {
        var unit = await _context.Units
            .Include(u => u.Product).ThenInclude(p => p.Brand)
            .Include(u => u.Media)
            .Include(u => u.PaymentInfo)
            .Include(u => u.InstallmentPlans)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (unit == null)
            return ApiResponse<UnitDto>.FailResult("الوحدة غير موجودة");

        return ApiResponse<UnitDto>.SuccessResult(MapToDto(unit));
    }

    public async Task<ApiResponse<UnitDto>> CreateUnitAsync(CreateUnitDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
            return ApiResponse<UnitDto>.FailResult("المنتج غير موجود");

        var unit = new Unit
        {
            ProductId = dto.ProductId,
            IsNew = dto.IsNew,
            Status = dto.Status,
            Condition = dto.Condition,
            Storage = dto.Storage,
            Color = dto.Color,
            BatteryHealthPercent = dto.BatteryHealthPercent,
            WarrantyType = dto.WarrantyType,
            AppleWarrantyEndDate = dto.AppleWarrantyEndDate,
            StoreWarrantyMonths = dto.StoreWarrantyMonths,
            StoreWarrantyStartDate = dto.StoreWarrantyMonths.HasValue ? DateTime.UtcNow : null,
            HasBox = dto.HasBox,
            HasCable = dto.HasCable,
            HasCharger = dto.HasCharger,
            OtherAccessoriesText = dto.OtherAccessoriesText,
            IMEI = dto.IMEI,
            SerialNumber = dto.SerialNumber,
            NotesAr = dto.NotesAr,
            NotesEn = dto.NotesEn,
            PriceEGP = dto.PriceEGP
        };

        _context.Units.Add(unit);
        await _context.SaveChangesAsync();

        return await GetUnitByIdAsync(unit.Id);
    }

    public async Task<ApiResponse<UnitDto>> UpdateUnitAsync(int id, UpdateUnitDto dto)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
            return ApiResponse<UnitDto>.FailResult("الوحدة غير موجودة");

        unit.IsNew = dto.IsNew;
        unit.Status = dto.Status;
        unit.Condition = dto.Condition;
        unit.Storage = dto.Storage;
        unit.Color = dto.Color;
        unit.BatteryHealthPercent = dto.BatteryHealthPercent;
        unit.WarrantyType = dto.WarrantyType;
        unit.AppleWarrantyEndDate = dto.AppleWarrantyEndDate;
        unit.StoreWarrantyMonths = dto.StoreWarrantyMonths;
        unit.HasBox = dto.HasBox;
        unit.HasCable = dto.HasCable;
        unit.HasCharger = dto.HasCharger;
        unit.OtherAccessoriesText = dto.OtherAccessoriesText;
        unit.IMEI = dto.IMEI;
        unit.SerialNumber = dto.SerialNumber;
        unit.NotesAr = dto.NotesAr;
        unit.NotesEn = dto.NotesEn;
        unit.PriceEGP = dto.PriceEGP;

        await _context.SaveChangesAsync();

        return await GetUnitByIdAsync(id);
    }

    public async Task<ApiResponse<UnitDto>> DuplicateUnitAsync(int id)
    {
        var original = await _context.Units.FindAsync(id);
        if (original == null)
            return ApiResponse<UnitDto>.FailResult("الوحدة غير موجودة");

        var clone = new Unit
        {
            ProductId = original.ProductId,
            IsNew = original.IsNew,
            Status = UnitStatus.Available,
            Condition = original.Condition,
            Storage = original.Storage,
            Color = original.Color,
            BatteryHealthPercent = original.BatteryHealthPercent,
            WarrantyType = original.WarrantyType,
            AppleWarrantyEndDate = original.AppleWarrantyEndDate,
            StoreWarrantyMonths = original.StoreWarrantyMonths,
            StoreWarrantyStartDate = original.StoreWarrantyMonths.HasValue ? DateTime.UtcNow : null,
            HasBox = original.HasBox,
            HasCable = original.HasCable,
            HasCharger = original.HasCharger,
            OtherAccessoriesText = original.OtherAccessoriesText,
            NotesAr = original.NotesAr,
            NotesEn = original.NotesEn,
            PriceEGP = original.PriceEGP
        };

        _context.Units.Add(clone);
        await _context.SaveChangesAsync();

        return await GetUnitByIdAsync(clone.Id);
    }

    public async Task<ApiResponse<bool>> DeleteUnitAsync(int id)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
            return ApiResponse<bool>.FailResult("الوحدة غير موجودة");

        unit.IsDeleted = true;
        unit.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم حذف الوحدة بنجاح");
    }

    public async Task<ApiResponse<bool>> RestoreUnitAsync(int id)
    {
        var unit = await _context.Units.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Id == id);
        if (unit == null)
            return ApiResponse<bool>.FailResult("الوحدة غير موجودة");

        unit.IsDeleted = false;
        unit.DeletedAt = null;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم استعادة الوحدة بنجاح");
    }

    public async Task<ApiResponse<bool>> UpdateUnitStatusAsync(int id, UnitStatus status)
    {
        var unit = await _context.Units.FindAsync(id);
        if (unit == null)
            return ApiResponse<bool>.FailResult("الوحدة غير موجودة");

        unit.Status = status;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    // Media methods
    public async Task<ApiResponse<List<UnitMediaDto>>> GetUnitMediaAsync(int unitId)
    {
        var media = await _context.UnitMedia
            .Where(m => m.UnitId == unitId)
            .OrderBy(m => m.SortOrder)
            .ToListAsync();

        return ApiResponse<List<UnitMediaDto>>.SuccessResult(
            media.Select(m => new UnitMediaDto(m.Id, m.FilePath, m.FileName, m.IsCover, m.SortOrder)).ToList());
    }

    public async Task<ApiResponse<UnitMediaDto>> AddUnitMediaAsync(int unitId, string filePath, string fileName, bool isCover)
    {
        var existingCount = await _context.UnitMedia.CountAsync(m => m.UnitId == unitId);
        if (existingCount >= 5)
            return ApiResponse<UnitMediaDto>.FailResult("لا يمكن إضافة أكثر من 5 صور");

        if (isCover)
        {
            var existingCover = await _context.UnitMedia.Where(m => m.UnitId == unitId && m.IsCover).ToListAsync();
            existingCover.ForEach(m => m.IsCover = false);
        }

        var media = new UnitMedia
        {
            UnitId = unitId,
            FilePath = filePath,
            FileName = fileName,
            IsCover = isCover || existingCount == 0,
            SortOrder = existingCount + 1
        };

        _context.UnitMedia.Add(media);
        await _context.SaveChangesAsync();

        return ApiResponse<UnitMediaDto>.SuccessResult(
            new UnitMediaDto(media.Id, media.FilePath, media.FileName, media.IsCover, media.SortOrder));
    }

    public async Task<ApiResponse<bool>> SetUnitCoverImageAsync(int unitId, int mediaId)
    {
        var allMedia = await _context.UnitMedia.Where(m => m.UnitId == unitId).ToListAsync();
        allMedia.ForEach(m => m.IsCover = m.Id == mediaId);
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> DeleteUnitMediaAsync(int mediaId)
    {
        var media = await _context.UnitMedia.FindAsync(mediaId);
        if (media == null)
            return ApiResponse<bool>.FailResult("الصورة غير موجودة");

        _context.UnitMedia.Remove(media);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ReorderUnitMediaAsync(int unitId, List<int> mediaIds)
    {
        var media = await _context.UnitMedia.Where(m => m.UnitId == unitId).ToListAsync();
        for (int i = 0; i < mediaIds.Count; i++)
        {
            var item = media.FirstOrDefault(m => m.Id == mediaIds[i]);
            if (item != null) item.SortOrder = i + 1;
        }
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    // Payment Info
    public async Task<ApiResponse<UnitPaymentInfoDto>> GetUnitPaymentInfoAsync(int unitId)
    {
        var info = await _context.UnitPaymentInfos.FirstOrDefaultAsync(p => p.UnitId == unitId);
        if (info == null)
            return ApiResponse<UnitPaymentInfoDto>.SuccessResult(new UnitPaymentInfoDto(null, null));

        return ApiResponse<UnitPaymentInfoDto>.SuccessResult(
            new UnitPaymentInfoDto(info.PaymentDetailsAr, info.PaymentDetailsEn));
    }

    public async Task<ApiResponse<UnitPaymentInfoDto>> SaveUnitPaymentInfoAsync(int unitId, UpdateUnitPaymentInfoDto dto)
    {
        var info = await _context.UnitPaymentInfos.FirstOrDefaultAsync(p => p.UnitId == unitId);
        if (info == null)
        {
            info = new UnitPaymentInfo { UnitId = unitId };
            _context.UnitPaymentInfos.Add(info);
        }

        info.PaymentDetailsAr = dto.PaymentDetailsAr;
        info.PaymentDetailsEn = dto.PaymentDetailsEn;
        await _context.SaveChangesAsync();

        return ApiResponse<UnitPaymentInfoDto>.SuccessResult(
            new UnitPaymentInfoDto(info.PaymentDetailsAr, info.PaymentDetailsEn));
    }

    // Installment Plans
    public async Task<ApiResponse<List<InstallmentPlanDto>>> GetUnitInstallmentPlansAsync(int unitId)
    {
        var plans = await _context.UnitInstallmentPlans
            .Where(p => p.UnitId == unitId)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        return ApiResponse<List<InstallmentPlanDto>>.SuccessResult(
            plans.Select(p => new InstallmentPlanDto(
                p.Id, p.ProgramName, p.DurationMonths, p.MonthlyAmount,
                p.DownPaymentAmount, p.DownPaymentPercent,
                p.NotesAr, p.NotesEn, p.IsActive, p.SortOrder)).ToList());
    }

    public async Task<ApiResponse<InstallmentPlanDto>> AddUnitInstallmentPlanAsync(int unitId, CreateInstallmentPlanDto dto)
    {
        var plan = new UnitInstallmentPlan
        {
            UnitId = unitId,
            ProgramName = dto.ProgramName,
            DurationMonths = dto.DurationMonths,
            MonthlyAmount = dto.MonthlyAmount,
            DownPaymentAmount = dto.DownPaymentAmount,
            DownPaymentPercent = dto.DownPaymentPercent,
            NotesAr = dto.NotesAr,
            NotesEn = dto.NotesEn,
            IsActive = dto.IsActive,
            SortOrder = dto.SortOrder
        };

        _context.UnitInstallmentPlans.Add(plan);
        await _context.SaveChangesAsync();

        return ApiResponse<InstallmentPlanDto>.SuccessResult(
            new InstallmentPlanDto(plan.Id, plan.ProgramName, plan.DurationMonths, plan.MonthlyAmount,
                plan.DownPaymentAmount, plan.DownPaymentPercent, plan.NotesAr, plan.NotesEn, plan.IsActive, plan.SortOrder));
    }

    public async Task<ApiResponse<InstallmentPlanDto>> UpdateUnitInstallmentPlanAsync(int planId, UpdateInstallmentPlanDto dto)
    {
        var plan = await _context.UnitInstallmentPlans.FindAsync(planId);
        if (plan == null)
            return ApiResponse<InstallmentPlanDto>.FailResult("خطة التقسيط غير موجودة");

        plan.ProgramName = dto.ProgramName;
        plan.DurationMonths = dto.DurationMonths;
        plan.MonthlyAmount = dto.MonthlyAmount;
        plan.DownPaymentAmount = dto.DownPaymentAmount;
        plan.DownPaymentPercent = dto.DownPaymentPercent;
        plan.NotesAr = dto.NotesAr;
        plan.NotesEn = dto.NotesEn;
        plan.IsActive = dto.IsActive;
        plan.SortOrder = dto.SortOrder;

        await _context.SaveChangesAsync();

        return ApiResponse<InstallmentPlanDto>.SuccessResult(
            new InstallmentPlanDto(plan.Id, plan.ProgramName, plan.DurationMonths, plan.MonthlyAmount,
                plan.DownPaymentAmount, plan.DownPaymentPercent, plan.NotesAr, plan.NotesEn, plan.IsActive, plan.SortOrder));
    }

    public async Task<ApiResponse<bool>> DeleteUnitInstallmentPlanAsync(int planId)
    {
        var plan = await _context.UnitInstallmentPlans.FindAsync(planId);
        if (plan == null)
            return ApiResponse<bool>.FailResult("خطة التقسيط غير موجودة");

        _context.UnitInstallmentPlans.Remove(plan);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    // Public storefront methods
    public async Task<ApiResponse<PagedResult<UnitListDto>>> GetAvailableUnitsAsync(
        PaginationParams pagination,
        int? categoryId = null,
        bool? isNew = null,
        string? storage = null,
        string? color = null,
        UnitCondition? condition = null,
        int? minBatteryHealth = null,
        int? maxBatteryHealth = null,
        decimal? minPrice = null,
        decimal? maxPrice = null)
    {
        return await GetUnitsAsync(pagination, null, categoryId, UnitStatus.Available, isNew, condition,
            storage, color, minBatteryHealth, maxBatteryHealth, minPrice, maxPrice, false);
    }

    public async Task<ApiResponse<List<UnitListDto>>> GetNewArrivalsAsync(int count = 8)
    {
        var units = await _context.Units
            .Include(u => u.Product).ThenInclude(p => p.Brand)
            .Include(u => u.Media)
            .Where(u => u.Status == UnitStatus.Available)
            .OrderByDescending(u => u.CreatedAt)
            .Take(count)
            .ToListAsync();

        return ApiResponse<List<UnitListDto>>.SuccessResult(units.Select(MapToListDto).ToList());
    }

    public async Task<ApiResponse<List<UnitListDto>>> GetFeaturedUnitsAsync(List<int> unitIds)
    {
        var units = await _context.Units
            .Include(u => u.Product).ThenInclude(p => p.Brand)
            .Include(u => u.Media)
            .Where(u => unitIds.Contains(u.Id) && u.Status == UnitStatus.Available)
            .ToListAsync();

        return ApiResponse<List<UnitListDto>>.SuccessResult(units.Select(MapToListDto).ToList());
    }

    private static UnitListDto MapToListDto(Unit unit)
    {
        return new UnitListDto(
            unit.Id,
            unit.ProductId,
            unit.Product.NameAr,
            unit.Product.NameEn,
            unit.Product.Brand?.NameAr,
            unit.Product.Brand?.NameEn,
            unit.IsNew,
            unit.Status,
            unit.Condition,
            unit.Storage,
            unit.Color,
            unit.BatteryHealthPercent,
            unit.WarrantyType,
            unit.WarrantyRemainingMonths,
            unit.PriceEGP,
            unit.Media?.FirstOrDefault(m => m.IsCover)?.FilePath ?? unit.Media?.FirstOrDefault()?.FilePath,
            unit.CreatedAt
        );
    }

    private static UnitDto MapToDto(Unit unit)
    {
        return new UnitDto(
            unit.Id,
            unit.ProductId,
            unit.Product.NameAr,
            unit.Product.NameEn,
            unit.Product.Brand?.NameAr,
            unit.Product.Brand?.NameEn,
            unit.IsNew,
            unit.Status,
            unit.Condition,
            unit.Storage,
            unit.Color,
            unit.BatteryHealthPercent,
            unit.WarrantyType,
            unit.AppleWarrantyEndDate,
            unit.StoreWarrantyMonths,
            unit.WarrantyRemainingMonths,
            unit.HasBox,
            unit.HasCable,
            unit.HasCharger,
            unit.OtherAccessoriesText,
            unit.IMEI,
            unit.SerialNumber,
            unit.NotesAr,
            unit.NotesEn,
            unit.PriceEGP,
            unit.CreatedAt,
            unit.UpdatedAt,
            unit.Media?.OrderBy(m => m.SortOrder).Select(m => new UnitMediaDto(m.Id, m.FilePath, m.FileName, m.IsCover, m.SortOrder)).ToList(),
            unit.PaymentInfo != null ? new UnitPaymentInfoDto(unit.PaymentInfo.PaymentDetailsAr, unit.PaymentInfo.PaymentDetailsEn) : null,
            unit.InstallmentPlans?.OrderBy(p => p.SortOrder).Select(p => new InstallmentPlanDto(
                p.Id, p.ProgramName, p.DurationMonths, p.MonthlyAmount,
                p.DownPaymentAmount, p.DownPaymentPercent,
                p.NotesAr, p.NotesEn, p.IsActive, p.SortOrder)).ToList()
        );
    }
}
