using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UnitsController : ControllerBase
{
    private readonly IUnitService _unitService;
    private readonly IFileService _fileService;

    public UnitsController(IUnitService unitService, IFileService fileService)
    {
        _unitService = unitService;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PaginationParams pagination,
        [FromQuery] int? productId,
        [FromQuery] int? categoryId,
        [FromQuery] UnitStatus? status,
        [FromQuery] bool? isNew,
        [FromQuery] UnitCondition? condition,
        [FromQuery] string? storage,
        [FromQuery] string? color,
        [FromQuery] int? minBatteryHealth,
        [FromQuery] int? maxBatteryHealth,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool includeDeleted = false)
    {
        var result = await _unitService.GetUnitsAsync(pagination, productId, categoryId, status, isNew, condition,
            storage, color, minBatteryHealth, maxBatteryHealth, minPrice, maxPrice, includeDeleted);
        return Ok(result);
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable(
        [FromQuery] PaginationParams pagination,
        [FromQuery] int? categoryId,
        [FromQuery] bool? isNew,
        [FromQuery] string? storage,
        [FromQuery] string? color,
        [FromQuery] UnitCondition? condition,
        [FromQuery] int? minBatteryHealth,
        [FromQuery] int? maxBatteryHealth,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var result = await _unitService.GetAvailableUnitsAsync(pagination, categoryId, isNew, storage, color,
            condition, minBatteryHealth, maxBatteryHealth, minPrice, maxPrice);
        return Ok(result);
    }

    [HttpGet("new-arrivals")]
    public async Task<IActionResult> GetNewArrivals([FromQuery] int count = 8)
    {
        var result = await _unitService.GetNewArrivalsAsync(count);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] List<int> ids)
    {
        var result = await _unitService.GetFeaturedUnitsAsync(ids);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _unitService.GetUnitByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUnitDto dto)
    {
        var result = await _unitService.CreateUnitAsync(dto);
        if (!result.Success)
            return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUnitDto dto)
    {
        var result = await _unitService.UpdateUnitAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/duplicate")]
    public async Task<IActionResult> Duplicate(int id)
    {
        var result = await _unitService.DuplicateUnitAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _unitService.DeleteUnitAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/restore")]
    public async Task<IActionResult> Restore(int id)
    {
        var result = await _unitService.RestoreUnitAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UnitStatus status)
    {
        var result = await _unitService.UpdateUnitStatusAsync(id, status);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Media
    [HttpGet("{id}/media")]
    public async Task<IActionResult> GetMedia(int id)
    {
        var result = await _unitService.GetUnitMediaAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/media")]
    public async Task<IActionResult> AddMedia(int id, IFormFile file, [FromQuery] bool isCover = false)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, $"units/{id}");
        var result = await _unitService.AddUnitMediaAsync(id, path, file.FileName, isCover);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPatch("{unitId}/media/{mediaId}/cover")]
    public async Task<IActionResult> SetCover(int unitId, int mediaId)
    {
        var result = await _unitService.SetUnitCoverImageAsync(unitId, mediaId);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("media/{mediaId}")]
    public async Task<IActionResult> DeleteMedia(int mediaId)
    {
        var result = await _unitService.DeleteUnitMediaAsync(mediaId);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/media/reorder")]
    public async Task<IActionResult> ReorderMedia(int id, [FromBody] List<int> mediaIds)
    {
        var result = await _unitService.ReorderUnitMediaAsync(id, mediaIds);
        return Ok(result);
    }

    // Payment Info
    [HttpGet("{id}/payment-info")]
    public async Task<IActionResult> GetPaymentInfo(int id)
    {
        var result = await _unitService.GetUnitPaymentInfoAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}/payment-info")]
    public async Task<IActionResult> SavePaymentInfo(int id, [FromBody] UpdateUnitPaymentInfoDto dto)
    {
        var result = await _unitService.SaveUnitPaymentInfoAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    // Installment Plans
    [HttpGet("{id}/installment-plans")]
    public async Task<IActionResult> GetInstallmentPlans(int id)
    {
        var result = await _unitService.GetUnitInstallmentPlansAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/installment-plans")]
    public async Task<IActionResult> AddInstallmentPlan(int id, [FromBody] CreateInstallmentPlanDto dto)
    {
        var result = await _unitService.AddUnitInstallmentPlanAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("installment-plans/{planId}")]
    public async Task<IActionResult> UpdateInstallmentPlan(int planId, [FromBody] UpdateInstallmentPlanDto dto)
    {
        var result = await _unitService.UpdateUnitInstallmentPlanAsync(planId, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpDelete("installment-plans/{planId}")]
    public async Task<IActionResult> DeleteInstallmentPlan(int planId)
    {
        var result = await _unitService.DeleteUnitInstallmentPlanAsync(planId);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }
}
