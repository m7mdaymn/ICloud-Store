using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// Product DTOs
public record ProductDto(
    int Id,
    string NameAr,
    string NameEn,
    string SlugAr,
    string SlugEn,
    string? DescriptionAr,
    string? DescriptionEn,
    string? ShortDescriptionAr,
    string? ShortDescriptionEn,
    int? BrandId,
    string? BrandNameAr,
    string? BrandNameEn,
    InventoryMode InventoryMode,
    bool IsActive,
    int SortOrder,
    List<ProductCategoryDto>? Categories,
    List<ProductMediaDto>? Media,
    ProductStockDto? Stock,
    List<ProductAttributeDto>? Attributes
);

public record ProductListDto(
    int Id,
    string NameAr,
    string NameEn,
    string SlugAr,
    string SlugEn,
    string? BrandNameAr,
    string? BrandNameEn,
    InventoryMode InventoryMode,
    bool IsActive,
    string? CoverImagePath,
    decimal? Price,
    int? AvailableUnitsCount
);

public record ProductCategoryDto(int CategoryId, string CategoryNameAr, string CategoryNameEn, bool IsPrimary);
public record ProductMediaDto(int Id, string FilePath, string FileName, bool IsCover, int SortOrder);
public record ProductStockDto(int QuantityAvailable, decimal PriceEGP, bool IsActive);
public record ProductAttributeDto(int Id, string Key, string ValueAr, string ValueEn, int SortOrder);

public record CreateProductDto(
    string NameAr,
    string NameEn,
    string? DescriptionAr,
    string? DescriptionEn,
    string? ShortDescriptionAr,
    string? ShortDescriptionEn,
    int? BrandId,
    InventoryMode InventoryMode,
    bool IsActive,
    int SortOrder,
    List<int> CategoryIds,
    int? PrimaryCategoryId
);

public record UpdateProductDto(
    string NameAr,
    string NameEn,
    string? DescriptionAr,
    string? DescriptionEn,
    string? ShortDescriptionAr,
    string? ShortDescriptionEn,
    int? BrandId,
    InventoryMode InventoryMode,
    bool IsActive,
    int SortOrder,
    List<int> CategoryIds,
    int? PrimaryCategoryId
);

// Product Stock
public record CreateProductStockDto(int ProductId, int QuantityAvailable, decimal PriceEGP, bool IsActive);
public record UpdateProductStockDto(int QuantityAvailable, decimal PriceEGP, bool IsActive);

// Product Attributes
public record CreateProductAttributeDto(int ProductId, string Key, string ValueAr, string ValueEn, int SortOrder);
public record UpdateProductAttributeDto(string Key, string ValueAr, string ValueEn, int SortOrder);
