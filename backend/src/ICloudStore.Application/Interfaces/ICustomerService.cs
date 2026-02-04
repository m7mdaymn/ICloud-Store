using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.Interfaces;

public interface IWishlistService
{
    Task<ApiResponse<List<WishlistDto>>> GetUserWishlistAsync(int userId);
    Task<ApiResponse<WishlistDto>> AddToWishlistAsync(int userId, AddToWishlistDto dto);
    Task<ApiResponse<bool>> RemoveFromWishlistAsync(int userId, int id);
    Task<ApiResponse<bool>> IsInWishlistAsync(int userId, TargetType targetType, int targetId);
}

public interface IRecentlyViewedService
{
    Task<ApiResponse<List<RecentlyViewedDto>>> GetUserRecentlyViewedAsync(int userId, int count = 10);
    Task<ApiResponse<bool>> AddToRecentlyViewedAsync(int userId, AddRecentlyViewedDto dto);
    Task<ApiResponse<bool>> ClearRecentlyViewedAsync(int userId);
}

public interface ILeadLogService
{
    Task<ApiResponse<PagedResult<LeadLogDto>>> GetLeadLogsAsync(
        PaginationParams pagination,
        TargetType? targetType = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    
    Task<ApiResponse<LeadLogDto>> CreateLeadLogAsync(CreateLeadLogDto dto, int? userId, string? userAgent, string? ipAddress);
    Task<ApiResponse<int>> GetTodayLeadCountAsync();
}

public interface IAuditLogService
{
    Task<ApiResponse<PagedResult<AuditLogDto>>> GetAuditLogsAsync(
        PaginationParams pagination,
        string? entityName = null,
        int? entityId = null,
        string? action = null,
        int? userId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    
    Task LogAsync(string entityName, int entityId, string action, object? oldValues, object? newValues, int? userId, string? userName, string? ipAddress);
}

public interface IDashboardService
{
    Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
}
