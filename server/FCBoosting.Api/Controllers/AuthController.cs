using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("AuthRateLimit")]
public class AuthController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly ILogger<AuthController> _logger;

    public AuthController(FCBoostingDbContext db, ILogger<AuthController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin([FromQuery] string returnUrl = "/")
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback), new { returnUrl })
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string returnUrl = "/")
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Google authentication failed.");
        }

        var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Google User";

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
        {
            return BadRequest("Required claims not provided by Google.");
        }

        // Link or create user in SQL Server
        var user = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.GoogleSubjectId == googleId || u.Email == email);

        if (user == null)
        {
            user = new User
            {
                DisplayName = name,
                Email = email,
                GoogleSubjectId = googleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            user.ExternalAccounts.Add(new ExternalAccount
            {
                Provider = "Google",
                ProviderSubjectId = googleId,
                LinkedAt = DateTime.UtcNow,
            });
            await _db.Users.AddAsync(user);
        }
        else
        {
            user.GoogleSubjectId = googleId;
            user.UpdatedAt = DateTime.UtcNow;

            if (!user.ExternalAccounts.Any(ea => ea.Provider == "Google" && ea.ProviderSubjectId == googleId))
            {
                user.ExternalAccounts.Add(new ExternalAccount
                {
                    Provider = "Google",
                    ProviderSubjectId = googleId,
                    LinkedAt = DateTime.UtcNow,
                });
            }
        }

        await _db.SaveChangesAsync();

        _logger.LogInformation("User {Email} logged in with Google (Subject ID: {GoogleId}).", email, googleId);
        return Redirect(returnUrl);
    }

    [HttpGet("discord-login")]
    public IActionResult DiscordLogin([FromQuery] string returnUrl = "/")
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(DiscordCallback), new { returnUrl })
        };
        return Challenge(properties, "Discord");
    }

    [HttpGet("discord-callback")]
    public async Task<IActionResult> DiscordCallback([FromQuery] string returnUrl = "/")
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Discord authentication failed.");
        }

        var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
        var discordId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Discord User";

        if (string.IsNullOrEmpty(discordId))
        {
            return BadRequest("Required Discord User ID claim was not returned.");
        }

        // Find existing by Discord ID, then by email
        var user = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.DiscordUserId == discordId || (email != null && u.Email == email));

        if (user == null)
        {
            user = new User
            {
                DisplayName = name,
                Email = email ?? $"{discordId}@discord.boostinghaven.internal",
                DiscordUserId = discordId,
                DiscordTag = name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            user.ExternalAccounts.Add(new ExternalAccount
            {
                Provider = "Discord",
                ProviderSubjectId = discordId,
                LinkedAt = DateTime.UtcNow,
            });
            await _db.Users.AddAsync(user);
        }
        else
        {
            user.DiscordUserId = discordId;
            user.DiscordTag = name;
            user.UpdatedAt = DateTime.UtcNow;

            if (!user.ExternalAccounts.Any(ea => ea.Provider == "Discord" && ea.ProviderSubjectId == discordId))
            {
                user.ExternalAccounts.Add(new ExternalAccount
                {
                    Provider = "Discord",
                    ProviderSubjectId = discordId,
                    LinkedAt = DateTime.UtcNow,
                });
            }
        }

        await _db.SaveChangesAsync();

        _logger.LogInformation("User {Name} logged in with Discord (ID: {DiscordId}).", name, discordId);
        return Redirect(returnUrl);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Ok(new { isAuthenticated = false });
        }

        var email = User.FindFirstValue(ClaimTypes.Email);
        var subId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var dbUser = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.Email == email || u.GoogleSubjectId == subId || u.DiscordUserId == subId);

        if (dbUser == null)
        {
            return Ok(new { isAuthenticated = false });
        }

        return Ok(new
        {
            isAuthenticated = true,
            userId = dbUser.UserId,
            displayName = dbUser.DisplayName,
            email = dbUser.Email,
            role = dbUser.Role,
            category = dbUser.Category ?? dbUser.Role ?? "Customer",
            discordUserId = dbUser.DiscordUserId,
            discordTag = dbUser.DiscordTag,
            linkedProviders = dbUser.ExternalAccounts.Select(ea => ea.Provider).ToList()
        });
    }

    public record LoginDto(string Email, string? Password);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new { message = "Email is required." });
        }

        var cleanEmail = dto.Email.Trim().ToLower();

        // Find user by email or display name
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail 
                                   || u.DisplayName.ToLower() == cleanEmail);

        if (user == null)
        {
            // Auto-assign category for convenience if new user
            string cat = "Customer";
            if (cleanEmail.Contains("admin") || cleanEmail == "a") cat = "Admin";
            else if (cleanEmail.Contains("player") || cleanEmail.Contains("booster") || cleanEmail == "p") cat = "Player";

            user = new User
            {
                UserId = Guid.NewGuid().ToString(),
                DisplayName = dto.Email.Split('@')[0],
                Email = dto.Email.Trim(),
                Role = cat,
                Category = cat,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        string userCat = user.Category ?? user.Role ?? "Customer";

        return Ok(new
        {
            success = true,
            user = new
            {
                id = user.UserId,
                name = user.DisplayName,
                email = user.Email,
                category = userCat,
                role = user.Role ?? userCat,
                discordTag = user.DiscordTag ?? $"{user.DisplayName}#BH"
            }
        });
    }

    public record RegisterDto(string Name, string Email, string? Password, string? Category);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new { message = "Email is required." });
        }

        var cleanEmail = dto.Email.Trim().ToLower();
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail);
        if (existing != null)
        {
            return Ok(new
            {
                success = true,
                user = new
                {
                    id = existing.UserId,
                    name = existing.DisplayName,
                    email = existing.Email,
                    category = existing.Category ?? existing.Role ?? "Customer",
                    role = existing.Role ?? "Customer",
                    discordTag = existing.DiscordTag ?? $"{existing.DisplayName}#BH"
                }
            });
        }

        string cat = string.IsNullOrWhiteSpace(dto.Category) ? "Customer" : dto.Category;
        if (cat.Equals("A", StringComparison.OrdinalIgnoreCase)) cat = "Admin";
        if (cat.Equals("P", StringComparison.OrdinalIgnoreCase)) cat = "Player";

        var newUser = new User
        {
            UserId = Guid.NewGuid().ToString(),
            DisplayName = !string.IsNullOrWhiteSpace(dto.Name) ? dto.Name : dto.Email.Split('@')[0],
            Email = dto.Email.Trim(),
            Role = cat,
            Category = cat,
            Status = "Active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _db.Users.AddAsync(newUser);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            user = new
            {
                id = newUser.UserId,
                name = newUser.DisplayName,
                email = newUser.Email,
                category = newUser.Category,
                role = newUser.Role,
                discordTag = $"{newUser.DisplayName}#BH"
            }
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logged out successfully" });
    }
}
