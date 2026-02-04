using ICloudStore.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ICloudStore.Infrastructure.Services;

public class FileService : IFileService
{
    private readonly string _basePath;
    private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private const long MaxFileSizeInBytes = 5 * 1024 * 1024; // 5MB

    public FileService(string basePath)
    {
        _basePath = basePath;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder, string? customFileName = null)
    {
        var fileName = customFileName ?? GenerateSafeFileName(file.FileName);
        var folderPath = Path.Combine(_basePath, "uploads", folder);
        
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var filePath = Path.Combine(folderPath, fileName);
        
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/{folder}/{fileName}";
    }

    public async Task<List<string>> SaveFilesAsync(List<IFormFile> files, string folder)
    {
        var paths = new List<string>();
        foreach (var file in files)
        {
            var path = await SaveFileAsync(file, folder);
            paths.Add(path);
        }
        return paths;
    }

    public bool DeleteFile(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return false;

        var fullPath = Path.Combine(_basePath, filePath.TrimStart('/'));
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }
        return false;
    }

    public bool FileExists(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return false;

        var fullPath = Path.Combine(_basePath, filePath.TrimStart('/'));
        return File.Exists(fullPath);
    }

    public string GetFileUrl(string filePath)
    {
        return filePath;
    }

    public bool ValidateImageFile(IFormFile file, out string error)
    {
        error = string.Empty;

        if (file == null || file.Length == 0)
        {
            error = "الملف فارغ";
            return false;
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedImageExtensions.Contains(extension))
        {
            error = "نوع الملف غير مسموح. الأنواع المسموحة: JPG, JPEG, PNG, GIF, WEBP";
            return false;
        }

        if (file.Length > MaxFileSizeInBytes)
        {
            error = "حجم الملف يتجاوز الحد المسموح (5 ميجابايت)";
            return false;
        }

        return true;
    }

    public bool ValidateFileSize(IFormFile file, long maxSizeInMB, out string error)
    {
        error = string.Empty;
        var maxBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.Length > maxBytes)
        {
            error = $"حجم الملف يتجاوز الحد المسموح ({maxSizeInMB} ميجابايت)";
            return false;
        }

        return true;
    }

    private static string GenerateSafeFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = Guid.NewGuid().ToString("N")[..8];
        return $"{timestamp}_{random}{extension}";
    }
}
