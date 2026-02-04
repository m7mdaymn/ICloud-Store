using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ICloudStore.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
        _configuration = configuration;
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !user.IsActive)
            return ApiResponse<AuthResponseDto>.FailResult("البريد الإلكتروني أو كلمة المرور غير صحيحة");

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            return ApiResponse<AuthResponseDto>.FailResult("البريد الإلكتروني أو كلمة المرور غير صحيحة");

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Customer";

        var (accessToken, accessTokenExpires) = GenerateAccessToken(user, role);
        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return ApiResponse<AuthResponseDto>.SuccessResult(new AuthResponseDto(
            user.Id,
            user.Email!,
            user.FullName,
            role,
            accessToken,
            refreshToken,
            accessTokenExpires
        ));
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            return ApiResponse<AuthResponseDto>.FailResult("البريد الإلكتروني مستخدم بالفعل");

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return ApiResponse<AuthResponseDto>.FailResult("فشل في إنشاء الحساب", result.Errors.Select(e => e.Description).ToList());

        await _userManager.AddToRoleAsync(user, "Customer");

        var (accessToken, accessTokenExpires) = GenerateAccessToken(user, "Customer");
        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return ApiResponse<AuthResponseDto>.SuccessResult(new AuthResponseDto(
            user.Id,
            user.Email!,
            user.FullName,
            "Customer",
            accessToken,
            refreshToken,
            accessTokenExpires
        ));
    }

    public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken == null || !storedToken.IsActive)
            return ApiResponse<AuthResponseDto>.FailResult("رمز التحديث غير صالح أو منتهي الصلاحية");

        // Revoke old token
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.ReasonRevoked = "Replaced by new token";

        var user = storedToken.User;
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Customer";

        var (accessToken, accessTokenExpires) = GenerateAccessToken(user, role);
        var newRefreshToken = await GenerateRefreshTokenAsync(user.Id);

        storedToken.ReplacedByToken = newRefreshToken;
        await _context.SaveChangesAsync();

        return ApiResponse<AuthResponseDto>.SuccessResult(new AuthResponseDto(
            user.Id,
            user.Email!,
            user.FullName,
            role,
            accessToken,
            newRefreshToken,
            accessTokenExpires
        ));
    }

    public async Task<ApiResponse<bool>> RevokeTokenAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken == null)
            return ApiResponse<bool>.FailResult("الرمز غير موجود");

        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.ReasonRevoked = "Revoked by user";
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return ApiResponse<bool>.FailResult("المستخدم غير موجود");

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
            return ApiResponse<bool>.FailResult("فشل تغيير كلمة المرور", result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<bool>.SuccessResult(true, "تم تغيير كلمة المرور بنجاح");
    }

    public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return ApiResponse<UserDto>.FailResult("المستخدم غير موجود");

        var roles = await _userManager.GetRolesAsync(user);

        return ApiResponse<UserDto>.SuccessResult(new UserDto(
            user.Id,
            user.FullName,
            user.Email!,
            user.PhoneNumber,
            user.ProfileImagePath,
            roles.FirstOrDefault() ?? "Customer",
            user.IsActive,
            user.CreatedAt
        ));
    }

    private (string token, DateTime expires) GenerateAccessToken(ApplicationUser user, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? "60"));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }

    private async Task<string> GenerateRefreshTokenAsync(int userId)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var token = Convert.ToBase64String(randomBytes);

        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpirationDays"] ?? "7")),
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return token;
    }
}
