using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Anti-DDoS & Resource Exhaustion Defense: Harden Kestrel Server Limits
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false; // Strip server banner ("Kestrel")
    serverOptions.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // 10MB max body against memory exhaustion
    serverOptions.Limits.MaxRequestHeaderCount = 64;
    serverOptions.Limits.MaxRequestHeadersTotalSize = 32 * 1024; // 32KB max headers
    serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
    serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(30);
});

// 1. Database Context (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\MSSQLLocalDB;Database=FCBoostingDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<FCBoostingDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Core Business Services
builder.Services.AddScoped<IOrderLifecycleService, OrderLifecycleService>();
builder.Services.AddScoped<IStorageService, LocalStorageService>();

// 3. Discord Bot Service (Singleton & Hosted Service)
builder.Services.AddSingleton<DiscordBotService>();
builder.Services.AddSingleton<IDiscordBotService>(sp => sp.GetRequiredService<DiscordBotService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<DiscordBotService>());

// 4. Authentication (Cookies + Google OAuth + Discord OAuth)
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.Name = ".BoostingHaven.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? "MOCK_GOOGLE_CLIENT_ID";
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? "MOCK_GOOGLE_SECRET";
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddDiscord(options =>
{
    options.ClientId = builder.Configuration["Authentication:Discord:ClientId"] ?? "MOCK_DISCORD_CLIENT_ID";
    options.ClientSecret = builder.Configuration["Authentication:Discord:ClientSecret"] ?? "MOCK_DISCORD_SECRET";
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.Scope.Add("identify");
    options.Scope.Add("email");
    options.Scope.Add("guilds");
});

// 5. Anti-DDoS & Brute Force Rate Limiter Policies (.NET 10 Native)
builder.Services.AddRateLimiter(options =>
{
    // Global rate limiter partition by Client IP (supports Cloudflare CF-Connecting-IP & X-Forwarded-For)
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var clientIp = httpContext.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
            ?? httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
            ?? httpContext.Connection.RemoteIpAddress?.ToString()
            ?? "client_unknown";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 150, // 150 requests per minute per IP
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 10,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            });
    });

    // Stricter limiter for Auth endpoints (prevents brute force, credential stuffing, password spraying)
    options.AddPolicy("AuthRateLimit", httpContext =>
    {
        var clientIp = httpContext.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
            ?? httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
            ?? httpContext.Connection.RemoteIpAddress?.ToString()
            ?? "client_unknown";

        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 12, // Max 12 authentication requests per minute per IP
                Window = TimeSpan.FromMinutes(1),
                SegmentsPerWindow = 6,
                QueueLimit = 0,
            });
    });

    // Stricter limiter for Orders endpoints (prevents automated fake-order spam and checkout flood)
    options.AddPolicy("OrdersRateLimit", httpContext =>
    {
        var clientIp = httpContext.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
            ?? httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
            ?? httpContext.Connection.RemoteIpAddress?.ToString()
            ?? "client_unknown";

        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 25, // Max 25 order requests per minute per IP
                Window = TimeSpan.FromMinutes(1),
                SegmentsPerWindow = 4,
                QueueLimit = 2,
            });
    });

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        context.HttpContext.Response.Headers.Append("Retry-After", "60");

        await context.HttpContext.Response.WriteAsync(
            System.Text.Json.JsonSerializer.Serialize(new
            {
                error = "Too Many Requests",
                message = "Anti-DDoS Shield: Rate limit exceeded. Please wait 60 seconds before trying again.",
                statusCode = 429
            }), cancellationToken);
    };
});

// 6. CORS Configuration (Allows frontend React app)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// Auto-migrate or ensure database exists on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();
    try
    {
        db.Database.EnsureCreated();
        app.Logger.LogInformation("Boosting Haven SQL Server database connection verified and schema ensured.");
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Could not automatically initialize SQL Server. Database will be connected when available.");
    }
}

// 7. OWASP Recommended Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");

    // Strip server banner disclosure headers
    context.Response.Headers.Remove("Server");
    context.Response.Headers.Remove("X-Powered-By");

    await next();
});

app.UseCors("FrontendCorsPolicy");

// Enable Anti-DDoS Rate Limiting
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapOpenApi();
app.MapScalarApiReference();

// Swagger and docs alias redirect to interactive API UI
app.MapGet("/swagger", () => Results.Redirect("/scalar/v1"));
app.MapGet("/swagger/index.html", () => Results.Redirect("/scalar/v1"));
app.MapGet("/docs", () => Results.Redirect("/scalar/v1"));

// Root landing page: provides clean status & quick links to frontend and API docs
app.MapGet("/", () => Results.Content("""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boosting Haven API Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0B0D13;
      color: #F3F4F6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #131722;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 40px;
      max-width: 680px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10B981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.9); }
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #FFF 0%, #A5B4FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.desc {
      color: #9CA3AF;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
    }
    @media (max-width: 580px) {
      .grid { grid-template-columns: 1fr; }
    }
    .action-box {
      background: #1A1F2C;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .action-box:hover {
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }
    .action-box h3 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #FFF;
    }
    .action-box p {
      font-size: 13px;
      color: #9CA3AF;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      color: #FFF;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #252B3B;
      color: #E0E7FF;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .btn-secondary:hover {
      background: #2F3649;
    }
    .endpoints {
      background: #161A26;
      border-radius: 12px;
      padding: 18px;
      border: 1px solid rgba(255,255,255,0.04);
    }
    .endpoints-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6B7280;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .endpoint-item:last-child { border-bottom: none; }
    .method {
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 11px;
      font-family: monospace;
    }
    .method-get { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
    .method-post { background: rgba(16, 185, 129, 0.2); color: #34D399; }
    .path { font-family: monospace; color: #E5E7EB; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span>
      Backend API & SQL Server Online (Port 5268)
    </div>
    <h1>Boosting Haven Engine</h1>
    <p class="desc">
      You are viewing the <strong>ASP.NET Core Web API server</strong>. If you are looking for the customer & player web application, click the button below to launch the website!
    </p>

    <div class="grid">
      <div class="action-box">
        <div>
          <h3>🌐 Boosting Haven Website</h3>
          <p>Main store, live chat, catalog, and automated category login portal.</p>
        </div>
        <a href="http://localhost:5173" class="btn btn-primary">Open Website (Port 5173) &rarr;</a>
      </div>

      <div class="action-box">
        <div>
          <h3>📘 Interactive API Docs</h3>
          <p>Swagger / OpenAPI Scalar reference to test all REST endpoints.</p>
        </div>
        <a href="/scalar/v1" class="btn btn-secondary">Open Scalar / Swagger &rarr;</a>
      </div>
    </div>

    <div class="endpoints">
      <div class="endpoints-title">Verified Core Endpoints</div>
      <div class="endpoint-item">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="method method-get">GET</span>
          <span class="path">/api/services</span>
        </div>
        <a href="/api/services" target="_blank" style="color:#818CF8;text-decoration:none;font-size:12px;">Test JSON &rarr;</a>
      </div>
      <div class="endpoint-item">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="method method-get">GET</span>
          <span class="path">/api/orders</span>
        </div>
        <a href="/api/orders" target="_blank" style="color:#818CF8;text-decoration:none;font-size:12px;">Test JSON &rarr;</a>
      </div>
      <div class="endpoint-item">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="method method-post">POST</span>
          <span class="path">/api/users/login</span>
        </div>
        <span style="color:#9CA3AF;font-size:12px;">Category routing</span>
      </div>
    </div>
  </div>
</body>
</html>
""", "text/html"));

app.Run();
