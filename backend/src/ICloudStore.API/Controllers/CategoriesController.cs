using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ICloudStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IFileService _fileService;

    public CategoriesController(ICategoryService categoryService, IFileService fileService)
    {
        _categoryService = categoryService;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
    {
        var result = await _categoryService.GetAllCategoriesAsync(includeInactive);
        return Ok(result);
    }

    [HttpGet("root")]
    public async Task<IActionResult> GetRootCategories([FromQuery] bool includeInactive = false)
    {
        var result = await _categoryService.GetRootCategoriesAsync(includeInactive);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _categoryService.GetCategoryByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string lang = "en")
    {
        var result = await _categoryService.GetCategoryBySlugAsync(slug, lang);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await _categoryService.CreateCategoryAsync(dto);
        if (!result.Success)
            return BadRequest(result);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, dto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        if (!_fileService.ValidateImageFile(file, out var error))
            return BadRequest(new { success = false, message = error });

        var path = await _fileService.SaveFileAsync(file, $"categories");
        var result = await _categoryService.UpdateCategoryImageAsync(id, path);
        if (!result.Success)
            return BadRequest(result);
        return Ok(new { success = true, imagePath = path });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder([FromBody] List<int> categoryIds)
    {
        var result = await _categoryService.ReorderCategoriesAsync(categoryIds);
        return Ok(result);
    }
}
