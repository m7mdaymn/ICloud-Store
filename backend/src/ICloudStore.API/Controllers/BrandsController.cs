using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IBrandService _brandService;
    private readonly IFileService _fileService;

    public BrandsController(IBrandService brandService, IFileService fileService)
    {
        _brandService = brandService;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _brandService.GetAllBrandsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _brandService.GetBrandByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _brandService.GetBrandBySlugAsync(slug);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
    {
        var result = await _brandService.CreateBrandAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBrandDto dto)
    {
        var result = await _brandService.UpdateBrandAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _brandService.DeleteBrandAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/logo")]
    public async Task<IActionResult> UploadLogo(int id, IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, "brands");
        await _brandService.UpdateBrandLogoAsync(id, path);
        return Ok(new { success = true, path });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<int> ids)
    {
        var result = await _brandService.ReorderBrandsAsync(ids);
        return Ok(result);
    }
}
