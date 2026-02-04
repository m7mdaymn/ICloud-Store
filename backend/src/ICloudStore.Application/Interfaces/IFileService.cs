using Microsoft.AspNetCore.Http;

namespace ICloudStore.Application.Interfaces;

public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folder, string? customFileName = null);
    Task<List<string>> SaveFilesAsync(List<IFormFile> files, string folder);
    bool DeleteFile(string filePath);
    bool FileExists(string filePath);
    string GetFileUrl(string filePath);
    bool ValidateImageFile(IFormFile file, out string error);
    bool ValidateFileSize(IFormFile file, long maxSizeInMB, out string error);
}

public interface ISlugService
{
    string GenerateSlug(string text);
    string GenerateArabicSlug(string text);
    Task<string> GenerateUniqueSlugAsync<T>(string text, string language) where T : class;
}
