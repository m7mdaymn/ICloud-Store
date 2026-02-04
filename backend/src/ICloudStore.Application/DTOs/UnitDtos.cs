using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// Unit DTOs
public record UnitDto(
    int Id,
    int ProductId,
    string ProductNameAr,
    string ProductNameEn,
    string? BrandNameAr,
    string? BrandNameEn,
    bool IsNew,
    UnitStatus Status,
    UnitCondition? Condition,
    string? Storage,
    string? Color,
    int? BatteryHealthPercent,
    WarrantyType WarrantyType,
    DateTime? AppleWarrantyEndDate,
    int? StoreWarrantyMonths,
    int? WarrantyRemainingMonths,
    bool HasBox,
    bool HasCable,
    bool HasCharger,
    string? OtherAccessoriesText,
    string? IMEI,
    string? SerialNumber,
    string? NotesAr,
    string? NotesEn,
    decimal PriceEGP,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<UnitMediaDto>? Media,
    UnitPaymentInfoDto? PaymentInfo,
    List<InstallmentPlanDto>? InstallmentPlans
);

public record UnitListDto(
    int Id,
    int ProductId,
    string ProductNameAr,
    string ProductNameEn,
    string? BrandNameAr,
    string? BrandNameEn,
    bool IsNew,
    UnitStatus Status,
    UnitCondition? Condition,
    string? Storage,
    string? Color,
    int? BatteryHealthPercent,
    WarrantyType WarrantyType,
    int? WarrantyRemainingMonths,
    decimal PriceEGP,
    string? CoverImagePath,
    DateTime CreatedAt
);

public record UnitMediaDto(int Id, string FilePath, string FileName, bool IsCover, int SortOrder);

public record CreateUnitDto(
    int ProductId,
    bool IsNew,
    UnitStatus Status,
    UnitCondition? Condition,
    string? Storage,
    string? Color,
    int? BatteryHealthPercent,
    WarrantyType WarrantyType,
    DateTime? AppleWarrantyEndDate,
    int? StoreWarrantyMonths,
    bool HasBox,
    bool HasCable,
    bool HasCharger,
    string? OtherAccessoriesText,
    string? IMEI,
    string? SerialNumber,
    string? NotesAr,
    string? NotesEn,
    decimal PriceEGP
);

public record UpdateUnitDto(
    bool IsNew,
    UnitStatus Status,
    UnitCondition? Condition,
    string? Storage,
    string? Color,
    int? BatteryHealthPercent,
    WarrantyType WarrantyType,
    DateTime? AppleWarrantyEndDate,
    int? StoreWarrantyMonths,
    bool HasBox,
    bool HasCable,
    bool HasCharger,
    string? OtherAccessoriesText,
    string? IMEI,
    string? SerialNumber,
    string? NotesAr,
    string? NotesEn,
    decimal PriceEGP
);

// Payment Info
public record UnitPaymentInfoDto(string? PaymentDetailsAr, string? PaymentDetailsEn);
public record ProductPaymentInfoDto(string? PaymentDetailsAr, string? PaymentDetailsEn);

public record CreateUnitPaymentInfoDto(int UnitId, string? PaymentDetailsAr, string? PaymentDetailsEn);
public record UpdateUnitPaymentInfoDto(string? PaymentDetailsAr, string? PaymentDetailsEn);
public record CreateProductPaymentInfoDto(int ProductId, string? PaymentDetailsAr, string? PaymentDetailsEn);
public record UpdateProductPaymentInfoDto(string? PaymentDetailsAr, string? PaymentDetailsEn);

// Installment Plans
public record InstallmentPlanDto(
    int Id,
    string ProgramName,
    int DurationMonths,
    decimal? MonthlyAmount,
    decimal? DownPaymentAmount,
    decimal? DownPaymentPercent,
    string? NotesAr,
    string? NotesEn,
    bool IsActive,
    int SortOrder
);

public record CreateInstallmentPlanDto(
    string ProgramName,
    int DurationMonths,
    decimal? MonthlyAmount,
    decimal? DownPaymentAmount,
    decimal? DownPaymentPercent,
    string? NotesAr,
    string? NotesEn,
    bool IsActive,
    int SortOrder
);

public record UpdateInstallmentPlanDto(
    string ProgramName,
    int DurationMonths,
    decimal? MonthlyAmount,
    decimal? DownPaymentAmount,
    decimal? DownPaymentPercent,
    string? NotesAr,
    string? NotesEn,
    bool IsActive,
    int SortOrder
);
