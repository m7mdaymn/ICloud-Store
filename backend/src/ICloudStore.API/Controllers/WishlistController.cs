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
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var result = await _wishlistService.GetUserWishlistAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost("units/{unitId}")]
    public async Task<IActionResult> AddUnit(int unitId)
    {
        var dto = new AddToWishlistDto(TargetType.Unit, unitId);
        var result = await _wishlistService.AddToWishlistAsync(GetUserId(), dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("products/{productId}")]
    public async Task<IActionResult> AddProduct(int productId)
    {
        var dto = new AddToWishlistDto(TargetType.Product, productId);
        var result = await _wishlistService.AddToWishlistAsync(GetUserId(), dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var result = await _wishlistService.RemoveFromWishlistAsync(GetUserId(), id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("check/unit/{unitId}")]
    public async Task<IActionResult> CheckUnit(int unitId)
    {
        var result = await _wishlistService.IsInWishlistAsync(GetUserId(), TargetType.Unit, unitId);
        return Ok(result);
    }

    [HttpGet("check/product/{productId}")]
    public async Task<IActionResult> CheckProduct(int productId)
    {
        var result = await _wishlistService.IsInWishlistAsync(GetUserId(), TargetType.Product, productId);
        return Ok(result);
    }
}
