using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Domain.Enums;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICloudStore.Infrastructure.Services;

public class WishlistService : IWishlistService
{
    private readonly ApplicationDbContext _context;

    public WishlistService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<WishlistDto>>> GetUserWishlistAsync(int userId)
    {
        var items = await _context.Wishlists
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        var result = new List<WishlistDto>();

        foreach (var item in items)
        {
            string? nameAr = null, nameEn = null, imagePath = null;
            decimal? price = null;

            if (item.TargetType == TargetType.Unit)
            {
                var unit = await _context.Units
                    .Include(u => u.Product)
                    .Include(u => u.Media)
                    .FirstOrDefaultAsync(u => u.Id == item.TargetId);
                if (unit != null)
                {
                    nameAr = unit.Product.NameAr;
                    nameEn = unit.Product.NameEn;
                    imagePath = unit.Media.FirstOrDefault(m => m.IsCover)?.FilePath;
                    price = unit.PriceEGP;
                }
            }
            else
            {
                var product = await _context.Products
                    .Include(p => p.ProductMedia)
                    .Include(p => p.ProductStock)
                    .FirstOrDefaultAsync(p => p.Id == item.TargetId);
                if (product != null)
                {
                    nameAr = product.NameAr;
                    nameEn = product.NameEn;
                    imagePath = product.ProductMedia.FirstOrDefault(m => m.IsCover)?.FilePath;
                    price = product.ProductStock?.PriceEGP;
                }
            }

            result.Add(new WishlistDto(
                item.Id, item.TargetType, item.TargetId,
                nameAr, nameEn, imagePath, price, item.CreatedAt));
        }

        return ApiResponse<List<WishlistDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<WishlistDto>> AddToWishlistAsync(int userId, AddToWishlistDto dto)
    {
        var existing = await _context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.TargetType == dto.TargetType && w.TargetId == dto.TargetId);

        if (existing != null)
            return ApiResponse<WishlistDto>.FailResult("العنصر موجود بالفعل في المفضلة");

        var wishlist = new Wishlist
        {
            UserId = userId,
            TargetType = dto.TargetType,
            TargetId = dto.TargetId
        };

        _context.Wishlists.Add(wishlist);
        await _context.SaveChangesAsync();

        return ApiResponse<WishlistDto>.SuccessResult(
            new WishlistDto(wishlist.Id, wishlist.TargetType, wishlist.TargetId, null, null, null, null, wishlist.CreatedAt),
            "تمت الإضافة إلى المفضلة");
    }

    public async Task<ApiResponse<bool>> RemoveFromWishlistAsync(int userId, int id)
    {
        var item = await _context.Wishlists.FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);
        if (item == null)
            return ApiResponse<bool>.FailResult("العنصر غير موجود");

        _context.Wishlists.Remove(item);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تمت الإزالة من المفضلة");
    }

    public async Task<ApiResponse<bool>> IsInWishlistAsync(int userId, TargetType targetType, int targetId)
    {
        var exists = await _context.Wishlists
            .AnyAsync(w => w.UserId == userId && w.TargetType == targetType && w.TargetId == targetId);

        return ApiResponse<bool>.SuccessResult(exists);
    }
}

public class RecentlyViewedService : IRecentlyViewedService
{
    private readonly ApplicationDbContext _context;

    public RecentlyViewedService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<RecentlyViewedDto>>> GetUserRecentlyViewedAsync(int userId, int count = 10)
    {
        var items = await _context.RecentlyViewedItems
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.ViewedAt)
            .Take(count)
            .ToListAsync();

        var result = new List<RecentlyViewedDto>();

        foreach (var item in items)
        {
            string? nameAr = null, nameEn = null, imagePath = null;
            decimal? price = null;

            if (item.TargetType == TargetType.Unit)
            {
                var unit = await _context.Units
                    .Include(u => u.Product)
                    .Include(u => u.Media)
                    .FirstOrDefaultAsync(u => u.Id == item.TargetId);
                if (unit != null)
                {
                    nameAr = unit.Product.NameAr;
                    nameEn = unit.Product.NameEn;
                    imagePath = unit.Media.FirstOrDefault(m => m.IsCover)?.FilePath;
                    price = unit.PriceEGP;
                }
            }
            else
            {
                var product = await _context.Products
                    .Include(p => p.ProductMedia)
                    .Include(p => p.ProductStock)
                    .FirstOrDefaultAsync(p => p.Id == item.TargetId);
                if (product != null)
                {
                    nameAr = product.NameAr;
                    nameEn = product.NameEn;
                    imagePath = product.ProductMedia.FirstOrDefault(m => m.IsCover)?.FilePath;
                    price = product.ProductStock?.PriceEGP;
                }
            }

            result.Add(new RecentlyViewedDto(
                item.Id, item.TargetType, item.TargetId,
                nameAr, nameEn, imagePath, price, item.ViewedAt));
        }

        return ApiResponse<List<RecentlyViewedDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<bool>> AddToRecentlyViewedAsync(int userId, AddRecentlyViewedDto dto)
    {
        // Remove old entry if exists
        var existing = await _context.RecentlyViewedItems
            .FirstOrDefaultAsync(r => r.UserId == userId && r.TargetType == dto.TargetType && r.TargetId == dto.TargetId);

        if (existing != null)
        {
            existing.ViewedAt = DateTime.UtcNow;
        }
        else
        {
            _context.RecentlyViewedItems.Add(new RecentlyViewed
            {
                UserId = userId,
                TargetType = dto.TargetType,
                TargetId = dto.TargetId,
                ViewedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        // Keep only last 50 items
        var oldItems = await _context.RecentlyViewedItems
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.ViewedAt)
            .Skip(50)
            .ToListAsync();

        if (oldItems.Any())
        {
            _context.RecentlyViewedItems.RemoveRange(oldItems);
            await _context.SaveChangesAsync();
        }

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ClearRecentlyViewedAsync(int userId)
    {
        var items = await _context.RecentlyViewedItems.Where(r => r.UserId == userId).ToListAsync();
        _context.RecentlyViewedItems.RemoveRange(items);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }
}

public class LeadLogService : ILeadLogService
{
    private readonly ApplicationDbContext _context;

    public LeadLogService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PagedResult<LeadLogDto>>> GetLeadLogsAsync(
        PaginationParams pagination,
        TargetType? targetType = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = _context.LeadLogs.Include(l => l.User).AsQueryable();

        if (targetType.HasValue)
            query = query.Where(l => l.TargetType == targetType);
        if (fromDate.HasValue)
            query = query.Where(l => l.Timestamp >= fromDate);
        if (toDate.HasValue)
            query = query.Where(l => l.Timestamp <= toDate);

        var totalCount = await query.CountAsync();

        var logs = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var result = new PagedResult<LeadLogDto>
        {
            Items = logs.Select(l => new LeadLogDto(
                l.Id, l.UserId, l.User?.FullName, l.TargetType, l.TargetId,
                l.ItemName, l.Language, l.UserAgent, l.IpAddress, l.Timestamp)).ToList(),
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };

        return ApiResponse<PagedResult<LeadLogDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<LeadLogDto>> CreateLeadLogAsync(CreateLeadLogDto dto, int? userId, string? userAgent, string? ipAddress)
    {
        var log = new LeadLog
        {
            UserId = userId,
            TargetType = dto.TargetType,
            TargetId = dto.TargetId,
            ItemName = dto.ItemName,
            WhatsAppUrl = dto.WhatsAppUrl,
            Language = dto.Language,
            UserAgent = userAgent,
            IpAddress = ipAddress,
            Timestamp = DateTime.UtcNow
        };

        _context.LeadLogs.Add(log);
        await _context.SaveChangesAsync();

        return ApiResponse<LeadLogDto>.SuccessResult(
            new LeadLogDto(log.Id, log.UserId, null, log.TargetType, log.TargetId,
                log.ItemName, log.Language, log.UserAgent, log.IpAddress, log.Timestamp));
    }

    public async Task<ApiResponse<int>> GetTodayLeadCountAsync()
    {
        var today = DateTime.UtcNow.Date;
        var count = await _context.LeadLogs.CountAsync(l => l.Timestamp >= today);
        return ApiResponse<int>.SuccessResult(count);
    }
}
