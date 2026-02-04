using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// Wishlist DTOs
public record WishlistDto(
    int Id,
    TargetType TargetType,
    int TargetId,
    string? ItemNameAr,
    string? ItemNameEn,
    string? ImagePath,
    decimal? Price,
    DateTime CreatedAt
);

public record AddToWishlistDto(TargetType TargetType, int TargetId);

// Recently Viewed DTOs
public record RecentlyViewedDto(
    int Id,
    TargetType TargetType,
    int TargetId,
    string? ItemNameAr,
    string? ItemNameEn,
    string? ImagePath,
    decimal? Price,
    DateTime ViewedAt
);

public record AddRecentlyViewedDto(TargetType TargetType, int TargetId);

// Lead Log DTOs
public record LeadLogDto(
    int Id,
    int? UserId,
    string? UserName,
    TargetType TargetType,
    int TargetId,
    string? ItemName,
    string Language,
    string? UserAgent,
    string? IpAddress,
    DateTime Timestamp
);

public record CreateLeadLogDto(
    TargetType TargetType,
    int TargetId,
    string? ItemName,
    string WhatsAppUrl,
    string Language
);

// Audit Log DTOs
public record AuditLogDto(
    int Id,
    string EntityName,
    int EntityId,
    string Action,
    string? OldValuesJson,
    string? NewValuesJson,
    int? UserId,
    string? UserName,
    string? IpAddress,
    DateTime Timestamp
);

// Dashboard DTOs
public record DashboardStatsDto(
    int AvailableUnitsCount,
    int ReservedUnitsCount,
    int SoldUnitsCount,
    int TotalProductsCount,
    int TotalCustomersCount,
    int TodayLeadsCount,
    List<RecentActivityDto> RecentActivities,
    List<LeadLogDto> RecentLeads
);

public record RecentActivityDto(
    string Action,
    string EntityName,
    int EntityId,
    string? UserName,
    DateTime Timestamp
);
