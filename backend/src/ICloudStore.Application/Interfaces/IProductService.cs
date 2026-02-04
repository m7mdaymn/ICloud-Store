using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.Interfaces;

public interface IProductService
{
    Task<ApiResponse<PagedResult<ProductListDto>>> GetProductsAsync(
        PaginationParams pagination,
        int? categoryId = null,
        int? brandId = null,
        InventoryMode? inventoryMode = null,
        bool includeInactive = false);
    
    Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id);
    Task<ApiResponse<ProductDto>> GetProductBySlugAsync(string slug, string language);
    Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto dto);
    Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<ApiResponse<bool>> DeleteProductAsync(int id);
    Task<ApiResponse<bool>> RestoreProductAsync(int id);
    
    // Stock management
    Task<ApiResponse<ProductStockDto>> GetProductStockAsync(int productId);
    Task<ApiResponse<ProductStockDto>> CreateProductStockAsync(CreateProductStockDto dto);
    Task<ApiResponse<ProductStockDto>> UpdateProductStockAsync(int productId, UpdateProductStockDto dto);
    
    // Attributes
    Task<ApiResponse<List<ProductAttributeDto>>> GetProductAttributesAsync(int productId);
    Task<ApiResponse<ProductAttributeDto>> AddProductAttributeAsync(CreateProductAttributeDto dto);
    Task<ApiResponse<ProductAttributeDto>> UpdateProductAttributeAsync(int id, UpdateProductAttributeDto dto);
    Task<ApiResponse<bool>> DeleteProductAttributeAsync(int id);
    
    // Payment Info
    Task<ApiResponse<ProductPaymentInfoDto>> GetProductPaymentInfoAsync(int productId);
    Task<ApiResponse<ProductPaymentInfoDto>> SaveProductPaymentInfoAsync(int productId, UpdateProductPaymentInfoDto dto);
    Task<ApiResponse<List<InstallmentPlanDto>>> GetProductInstallmentPlansAsync(int productId);
    Task<ApiResponse<InstallmentPlanDto>> AddProductInstallmentPlanAsync(int productId, CreateInstallmentPlanDto dto);
    Task<ApiResponse<InstallmentPlanDto>> UpdateProductInstallmentPlanAsync(int planId, UpdateInstallmentPlanDto dto);
    Task<ApiResponse<bool>> DeleteProductInstallmentPlanAsync(int planId);
}
