using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeSectionsController : ControllerBase
{
    private readonly IHomeSectionService _sectionService;
    private readonly IFileService _fileService;

    public HomeSectionsController(IHomeSectionService sectionService, IFileService fileService)
    {
        _sectionService = sectionService;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
    {
        var result = await _sectionService.GetAllSectionsAsync(includeInactive);
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await _sectionService.GetActiveSectionsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _sectionService.GetSectionByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHomeSectionDto dto)
    {
        var result = await _sectionService.CreateSectionAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateHomeSectionDto dto)
    {
        var result = await _sectionService.UpdateSectionAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _sectionService.DeleteSectionAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<int> ids)
    {
        var result = await _sectionService.ReorderSectionsAsync(ids);
        return Ok(result);
    }

    // Section Items
    [HttpGet("items/{id}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var result = await _sectionService.GetSectionItemByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("items")]
    public async Task<IActionResult> CreateItem([FromBody] CreateHomeSectionItemDto dto)
    {
        var result = await _sectionService.CreateSectionItemAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateHomeSectionItemDto dto)
    {
        var result = await _sectionService.UpdateSectionItemAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var result = await _sectionService.DeleteSectionItemAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("items/{id}/image-desktop")]
    public async Task<IActionResult> UploadDesktopImage(int id, IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "home-sections");
        await _sectionService.UpdateSectionItemImagesAsync(id, path, null);
        return Ok(new { success = true, path });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("items/{id}/image-mobile")]
    public async Task<IActionResult> UploadMobileImage(int id, IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "home-sections");
        await _sectionService.UpdateSectionItemImagesAsync(id, null, path);
        return Ok(new { success = true, path });
    }
}
