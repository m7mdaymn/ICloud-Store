using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IFileService _fileService;

    public ProductsController(IProductService productService, IFileService fileService)
    {
        _productService = productService;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PaginationParams pagination,
        [FromQuery] int? categoryId,
        [FromQuery] int? brandId,
        [FromQuery] InventoryMode? inventoryMode,
        [FromQuery] bool includeInactive = false)
    {
        var result = await _productService.GetProductsAsync(pagination, categoryId, brandId, inventoryMode, includeInactive);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _productService.GetProductByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string lang = "en")
    {
        var result = await _productService.GetProductBySlugAsync(slug, lang);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var result = await _productService.CreateProductAsync(dto);
        if (!result.Success)
            return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var result = await _productService.UpdateProductAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/restore")]
    public async Task<IActionResult> Restore(int id)
    {
        var result = await _productService.RestoreProductAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Stock
    [HttpGet("{id}/stock")]
    public async Task<IActionResult> GetStock(int id)
    {
        var result = await _productService.GetProductStockAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}/stock")]
    public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateProductStockDto dto)
    {
        var result = await _productService.UpdateProductStockAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Attributes
    [HttpGet("{id}/attributes")]
    public async Task<IActionResult> GetAttributes(int id)
    {
        var result = await _productService.GetProductAttributesAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/attributes")]
    public async Task<IActionResult> AddAttribute(int id, [FromBody] CreateProductAttributeDto dto)
    {
        var result = await _productService.AddProductAttributeAsync(new CreateProductAttributeDto(id, dto.Key, dto.ValueAr, dto.ValueEn, dto.SortOrder));
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("attributes/{attrId}")]
    public async Task<IActionResult> UpdateAttribute(int attrId, [FromBody] UpdateProductAttributeDto dto)
    {
        var result = await _productService.UpdateProductAttributeAsync(attrId, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("attributes/{attrId}")]
    public async Task<IActionResult> DeleteAttribute(int attrId)
    {
        var result = await _productService.DeleteProductAttributeAsync(attrId);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Payment Info
    [HttpGet("{id}/payment-info")]
    public async Task<IActionResult> GetPaymentInfo(int id)
    {
        var result = await _productService.GetProductPaymentInfoAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}/payment-info")]
    public async Task<IActionResult> SavePaymentInfo(int id, [FromBody] UpdateProductPaymentInfoDto dto)
    {
        var result = await _productService.SaveProductPaymentInfoAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Installment Plans
    [HttpGet("{id}/installment-plans")]
    public async Task<IActionResult> GetInstallmentPlans(int id)
    {
        var result = await _productService.GetProductInstallmentPlansAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/installment-plans")]
    public async Task<IActionResult> AddInstallmentPlan(int id, [FromBody] CreateInstallmentPlanDto dto)
    {
        var result = await _productService.AddProductInstallmentPlanAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("installment-plans/{planId}")]
    public async Task<IActionResult> UpdateInstallmentPlan(int planId, [FromBody] UpdateInstallmentPlanDto dto)
    {
        var result = await _productService.UpdateProductInstallmentPlanAsync(planId, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("installment-plans/{planId}")]
    public async Task<IActionResult> DeleteInstallmentPlan(int planId)
    {
        var result = await _productService.DeleteProductInstallmentPlanAsync(planId);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }
}
