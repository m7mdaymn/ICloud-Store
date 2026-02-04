using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.Interfaces;

public interface IUnitService
{
    Task<ApiResponse<PagedResult<UnitListDto>>> GetUnitsAsync(
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
        bool includeDeleted = false);
    
    Task<ApiResponse<UnitDto>> GetUnitByIdAsync(int id);
    Task<ApiResponse<UnitDto>> CreateUnitAsync(CreateUnitDto dto);
    Task<ApiResponse<UnitDto>> UpdateUnitAsync(int id, UpdateUnitDto dto);
    Task<ApiResponse<UnitDto>> DuplicateUnitAsync(int id);
    Task<ApiResponse<bool>> DeleteUnitAsync(int id);
    Task<ApiResponse<bool>> RestoreUnitAsync(int id);
    Task<ApiResponse<bool>> UpdateUnitStatusAsync(int id, UnitStatus status);
    
    // Media
    Task<ApiResponse<List<UnitMediaDto>>> GetUnitMediaAsync(int unitId);
    Task<ApiResponse<UnitMediaDto>> AddUnitMediaAsync(int unitId, string filePath, string fileName, bool isCover);
    Task<ApiResponse<bool>> SetUnitCoverImageAsync(int unitId, int mediaId);
    Task<ApiResponse<bool>> DeleteUnitMediaAsync(int mediaId);
    Task<ApiResponse<bool>> ReorderUnitMediaAsync(int unitId, List<int> mediaIds);
    
    // Payment Info
    Task<ApiResponse<UnitPaymentInfoDto>> GetUnitPaymentInfoAsync(int unitId);
    Task<ApiResponse<UnitPaymentInfoDto>> SaveUnitPaymentInfoAsync(int unitId, UpdateUnitPaymentInfoDto dto);
    Task<ApiResponse<List<InstallmentPlanDto>>> GetUnitInstallmentPlansAsync(int unitId);
    Task<ApiResponse<InstallmentPlanDto>> AddUnitInstallmentPlanAsync(int unitId, CreateInstallmentPlanDto dto);
    Task<ApiResponse<InstallmentPlanDto>> UpdateUnitInstallmentPlanAsync(int planId, UpdateInstallmentPlanDto dto);
    Task<ApiResponse<bool>> DeleteUnitInstallmentPlanAsync(int planId);
    
    // Public storefront
    Task<ApiResponse<PagedResult<UnitListDto>>> GetAvailableUnitsAsync(
        PaginationParams pagination,
        int? categoryId = null,
        bool? isNew = null,
        string? storage = null,
        string? color = null,
        UnitCondition? condition = null,
        int? minBatteryHealth = null,
        int? maxBatteryHealth = null,
        decimal? minPrice = null,
        decimal? maxPrice = null);
    
    Task<ApiResponse<List<UnitListDto>>> GetNewArrivalsAsync(int count = 8);
    Task<ApiResponse<List<UnitListDto>>> GetFeaturedUnitsAsync(List<int> unitIds);
}
