using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;

namespace ICloudStore.Application.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync(bool includeInactive = false);
    Task<ApiResponse<List<CategoryDto>>> GetRootCategoriesAsync(bool includeInactive = false);
    Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> GetCategoryBySlugAsync(string slug, string language);
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryDto dto);
    Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
    Task<ApiResponse<bool>> UpdateCategoryImageAsync(int id, string imagePath);
    Task<ApiResponse<bool>> ReorderCategoriesAsync(List<int> categoryIds);
}

public interface IBrandService
{
    Task<ApiResponse<List<BrandDto>>> GetAllBrandsAsync(bool includeInactive = false);
    Task<ApiResponse<BrandDto>> GetBrandByIdAsync(int id);
    Task<ApiResponse<BrandDto>> GetBrandBySlugAsync(string slug);
    Task<ApiResponse<BrandDto>> CreateBrandAsync(CreateBrandDto dto);
    Task<ApiResponse<BrandDto>> UpdateBrandAsync(int id, UpdateBrandDto dto);
    Task<ApiResponse<bool>> DeleteBrandAsync(int id);
    Task<ApiResponse<bool>> UpdateBrandLogoAsync(int id, string logoPath);
    Task<ApiResponse<bool>> ReorderBrandsAsync(List<int> brandIds);
}
