using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;
    private readonly IFileService _fileService;

    public SettingsController(ISettingsService settingsService, IFileService fileService)
    {
        _settingsService = settingsService;
        _fileService = fileService;
    }

    // Public store info
    [HttpGet("store-info")]
    public async Task<IActionResult> GetStoreInfo()
    {
        var result = await _settingsService.GetPublicStoreInfoAsync();
        return Ok(result);
    }

    // Theme
    [HttpGet("theme")]
    public async Task<IActionResult> GetTheme()
    {
        var result = await _settingsService.GetThemeSettingAsync();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("theme")]
    public async Task<IActionResult> UpdateTheme([FromBody] UpdateThemeSettingDto dto)
    {
        var result = await _settingsService.UpdateThemeSettingAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("theme/logo-light")]
    public async Task<IActionResult> UploadLogoLight(IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "theme", "logo-light" + Path.GetExtension(file.FileName));
        await _settingsService.UpdateLogoAsync(path, null, null);
        return Ok(new { success = true, path });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("theme/logo-dark")]
    public async Task<IActionResult> UploadLogoDark(IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "theme", "logo-dark" + Path.GetExtension(file.FileName));
        await _settingsService.UpdateLogoAsync(null, path, null);
        return Ok(new { success = true, path });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("theme/favicon")]
    public async Task<IActionResult> UploadFavicon(IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "theme", "favicon" + Path.GetExtension(file.FileName));
        await _settingsService.UpdateLogoAsync(null, null, path);
        return Ok(new { success = true, path });
    }

    // Store Settings
    [Authorize(Roles = "Admin")]
    [HttpGet("store")]
    public async Task<IActionResult> GetAllStoreSettings()
    {
        var result = await _settingsService.GetAllStoreSettingsAsync();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("store/{key}")]
    public async Task<IActionResult> GetStoreSetting(string key)
    {
        var result = await _settingsService.GetStoreSettingAsync(key);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("store/{key}")]
    public async Task<IActionResult> UpdateStoreSetting(string key, [FromBody] UpdateStoreSettingDto dto)
    {
        var result = await _settingsService.UpdateStoreSettingAsync(key, dto);
        return Ok(result);
    }

    // Social Links
    [HttpGet("social-links")]
    public async Task<IActionResult> GetSocialLinks([FromQuery] bool includeHidden = false)
    {
        var result = await _settingsService.GetAllSocialLinksAsync(includeHidden);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("social-links")]
    public async Task<IActionResult> CreateSocialLink([FromBody] CreateSocialLinkDto dto)
    {
        var result = await _settingsService.CreateSocialLinkAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("social-links/{id}")]
    public async Task<IActionResult> UpdateSocialLink(int id, [FromBody] UpdateSocialLinkDto dto)
    {
        var result = await _settingsService.UpdateSocialLinkAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("social-links/{id}")]
    public async Task<IActionResult> DeleteSocialLink(int id)
    {
        var result = await _settingsService.DeleteSocialLinkAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("social-links/reorder")]
    public async Task<IActionResult> ReorderSocialLinks([FromBody] List<int> ids)
    {
        var result = await _settingsService.ReorderSocialLinksAsync(ids);
        return Ok(result);
    }
}
