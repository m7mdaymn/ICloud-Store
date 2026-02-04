using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecentlyViewedController : ControllerBase
{
    private readonly IRecentlyViewedService _recentlyViewedService;

    public RecentlyViewedController(IRecentlyViewedService recentlyViewedService)
    {
        _recentlyViewedService = recentlyViewedService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetRecentlyViewed([FromQuery] int count = 10)
    {
        var result = await _recentlyViewedService.GetUserRecentlyViewedAsync(GetUserId(), count);
        return Ok(result);
    }

    [HttpPost("units/{unitId}")]
    public async Task<IActionResult> AddUnit(int unitId)
    {
        var dto = new AddRecentlyViewedDto(TargetType.Unit, unitId);
        var result = await _recentlyViewedService.AddToRecentlyViewedAsync(GetUserId(), dto);
        return Ok(result);
    }

    [HttpPost("products/{productId}")]
    public async Task<IActionResult> AddProduct(int productId)
    {
        var dto = new AddRecentlyViewedDto(TargetType.Product, productId);
        var result = await _recentlyViewedService.AddToRecentlyViewedAsync(GetUserId(), dto);
        return Ok(result);
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> Clear()
    {
        var result = await _recentlyViewedService.ClearRecentlyViewedAsync(GetUserId());
        return Ok(result);
    }
}
