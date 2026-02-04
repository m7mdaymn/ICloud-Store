using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// Category DTOs
public record CategoryDto(
    int Id,
    string NameAr,
    string NameEn,
    string SlugAr,
    string SlugEn,
    string? DescriptionAr,
    string? DescriptionEn,
    string? ImagePath,
    int? ParentCategoryId,
    int SortOrder,
    bool IsActive,
    List<CategoryDto>? SubCategories
);

public record CreateCategoryDto(
    string NameAr,
    string NameEn,
    string? DescriptionAr,
    string? DescriptionEn,
    int? ParentCategoryId,
    int SortOrder,
    bool IsActive
);

public record UpdateCategoryDto(
    string NameAr,
    string NameEn,
    string? DescriptionAr,
    string? DescriptionEn,
    int? ParentCategoryId,
    int SortOrder,
    bool IsActive
);

// Brand DTOs
public record BrandDto(
    int Id,
    string NameAr,
    string NameEn,
    string SlugAr,
    string SlugEn,
    string? LogoPath,
    int SortOrder,
    bool IsActive
);

public record CreateBrandDto(
    string NameAr,
    string NameEn,
    int SortOrder,
    bool IsActive
);

public record UpdateBrandDto(
    string NameAr,
    string NameEn,
    int SortOrder,
    bool IsActive
);
