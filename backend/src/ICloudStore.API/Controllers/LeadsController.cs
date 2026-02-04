using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadLogService _leadLogService;

    public LeadsController(ILeadLogService leadLogService)
    {
        _leadLogService = leadLogService;
    }

    [HttpPost]
    public async Task<IActionResult> LogLead([FromBody] CreateLeadLogDto dto)
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var id))
                userId = id;
        }
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _leadLogService.CreateLeadLogAsync(dto, userId, userAgent, ipAddress);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet]
    public async Task<IActionResult> GetLeads(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var pagination = new PaginationParams { PageNumber = page, PageSize = pageSize };
        var result = await _leadLogService.GetLeadLogsAsync(pagination, null, from, to);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("stats/today")]
    public async Task<IActionResult> GetTodayCount()
    {
        var result = await _leadLogService.GetTodayLeadCountAsync();
        return Ok(result);
    }
}
