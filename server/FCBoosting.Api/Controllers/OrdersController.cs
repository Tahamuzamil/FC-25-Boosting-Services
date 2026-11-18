using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;
using FCBoosting.Api.Services;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("OrdersRateLimit")]
public class OrdersController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly IOrderLifecycleService _lifecycle;
    private readonly IDiscordBotService _discordBot;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        FCBoostingDbContext db,
        IOrderLifecycleService lifecycle,
        IDiscordBotService discordBot,
        ILogger<OrdersController> logger)
    {
        _db = db;
        _lifecycle = lifecycle;
        _discordBot = discordBot;
        _logger = logger;
    }

    public record CreateSessionRequest(
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string TargetChannel);

    [HttpPost("session")]
    public async Task<IActionResult> CreateOrderSession([FromBody] CreateSessionRequest request)
    {
        if (request.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var orderRef = $"BH-ORD-{Random.Shared.Next(10000, 99999)}";
        var session = new OrderSessionToken
        {
            OrderReference = orderRef,
            ServiceId = request.ServiceId,
            ServiceName = request.ServiceName,
            PriceSnapshot = request.Price,
            Platform = request.Platform,
            TargetChannel = request.TargetChannel,
            ExpiresAt = DateTime.UtcNow.AddHours(2),
            IsUsed = false,
        };

        await _db.OrderSessionTokens.AddAsync(session);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            sessionToken = session.Token,
            orderReference = orderRef,
            serviceName = request.ServiceName,
            price = request.Price,
            platform = request.Platform,
            expiresAt = session.ExpiresAt
        });
    }

    public record CreateFullOrderDto(
        string? OrderNumber,
        string? UserId,
        string ServiceId,
        string ServiceName,
        decimal Price,
        string? Platform,
        string? ContactMethod,
        string? PaymentMethod,
        string? CustomerName,
        string? CustomerEmail,
        string? GamerTag,
        string? Credentials,
        string? DiscordUserId,
        string? WhatsAppReference,
        Dictionary<string, string>? Requirements);

    // Primary endpoint for creating orders from frontend cart/checkout
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateFullOrderDto dto)
    {
        if (dto.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var orderNumber = !string.IsNullOrWhiteSpace(dto.OrderNumber) 
            ? dto.OrderNumber 
            : $"BH-ORD-{Random.Shared.Next(10000, 99999)}";

        // Idempotency check
        var existing = await _db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
        if (existing != null)
        {
            return Ok(new
            {
                orderId = existing.OrderId,
                orderNumber = existing.OrderNumber,
                status = existing.Status,
                createdAt = existing.CreatedAt,
                message = "Order already exists."
            });
        }

        // Ensure user exists or create customer record
        string? customerUserId = dto.UserId;
        if (string.IsNullOrWhiteSpace(customerUserId))
        {
            var email = dto.CustomerEmail ?? $"{orderNumber.ToLower()}@customer.boostinghaven.com";
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                customerUserId = existingUser.UserId;
            }
            else
            {
                var newUser = new User
                {
                    UserId = Guid.NewGuid().ToString(),
                    DisplayName = dto.CustomerName ?? "Customer",
                    Email = email,
                    Role = "Customer",
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _db.Users.AddAsync(newUser);
                customerUserId = newUser.UserId;
            }
        }

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = customerUserId,
            ServiceId = dto.ServiceId ?? "bh-custom",
            ServiceName = dto.ServiceName ?? "Boosting Haven Package",
            PriceSnapshot = dto.Price,
            Platform = dto.Platform ?? "PS5",
            ContactMethod = dto.ContactMethod ?? "WhatsApp",
            PaymentMethod = dto.PaymentMethod ?? "Card",
            PaymentStatus = "Paid",
            CustomerName = dto.CustomerName ?? "Valued Customer",
            CustomerEmail = dto.CustomerEmail ?? "customer@boostinghaven.com",
            GamerTag = dto.GamerTag ?? "Pending Setup",
            CustomerCredentialsEncrypted = dto.Credentials,
            DiscordUserId = dto.DiscordUserId,
            WhatsAppReference = dto.WhatsAppReference ?? (dto.ContactMethod == "WhatsApp" ? orderNumber : null),
            Status = "Pending",
            CurrentScore = "Awaiting Booster Assignment",
            ProgressPercentage = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (dto.Requirements != null)
        {
            foreach (var (k, v) in dto.Requirements)
            {
                order.OrderDetails.Add(new OrderDetail
                {
                    FieldName = k,
                    FieldValue = v
                });
            }
        }

        order.StatusHistory.Add(new OrderStatusHistory
        {
            PreviousStatus = "None",
            NewStatus = "Pending",
            ChangedByUserId = customerUserId,
            ChangedAt = DateTime.UtcNow,
            Notes = $"Order created via {order.ContactMethod} ({order.PaymentMethod})."
        });

        order.AuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = customerUserId,
            ActorRole = "Customer",
            ActionType = "Created",
            OldStatus = null,
            NewStatus = "Pending",
            Description = $"Order #{order.OrderNumber} created for {order.ServiceName} (${order.PriceSnapshot}) on {order.Platform}.",
            Timestamp = DateTime.UtcNow
        });

        await _db.Orders.AddAsync(order);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Order #{OrderNumber} successfully persisted into SQL Server.", order.OrderNumber);

        // Dispatch background Discord notification (Webhook or Bot Gateway)
        _ = Task.Run(async () =>
        {
            try
            {
                await _discordBot.NotifyNewOrderAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch Discord order notification for #{OrderNumber}.", order.OrderNumber);
            }
        });

        return Ok(new
        {
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            price = order.PriceSnapshot,
            serviceName = order.ServiceName,
            platform = order.Platform,
            createdAt = order.CreatedAt,
            trackingUrl = $"/track?ref={order.OrderNumber}"
        });
    }

    public record CreateWhatsAppOrderDto(
        string OrderReference,
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string? CustomerName,
        string? CustomerEmail);

    [HttpPost("whatsapp")]
    public async Task<IActionResult> CreateWhatsAppOrder([FromBody] CreateWhatsAppOrderDto dto)
    {
        if (dto.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var order = await _lifecycle.CreateOrderAsync(
            serviceId: dto.ServiceId,
            serviceName: dto.ServiceName,
            price: dto.Price,
            platform: dto.Platform,
            contactMethod: "WhatsApp",
            customerName: dto.CustomerName ?? "WhatsApp Customer",
            customerEmail: dto.CustomerEmail ?? "pending_whatsapp@customer.com",
            customOrderRef: dto.OrderReference);

        _ = Task.Run(async () =>
        {
            try
            {
                await _discordBot.NotifyNewOrderAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch Discord notification for WhatsApp order #{OrderNumber}.", order.OrderNumber);
            }
        });

        return Ok(new
        {
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            whatsappReference = order.WhatsAppReference,
            createdAt = order.CreatedAt
        });
    }

    public record CreateDiscordOrderDto(
        string OrderReference,
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string? GamerTag,
        string? DiscordUserId);

    [HttpPost("discord")]
    public async Task<IActionResult> CreateDiscordOrder([FromBody] CreateDiscordOrderDto dto)
    {
        if (dto.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var order = await _lifecycle.CreateOrderAsync(
            serviceId: dto.ServiceId,
            serviceName: dto.ServiceName,
            price: dto.Price,
            platform: dto.Platform,
            contactMethod: "Discord",
            gamerTag: dto.GamerTag ?? "Pending Discord Ticket",
            customOrderRef: dto.OrderReference);

        if (!string.IsNullOrEmpty(dto.DiscordUserId))
        {
            order.DiscordUserId = dto.DiscordUserId;
            await _db.SaveChangesAsync();
        }

        _ = Task.Run(async () =>
        {
            try
            {
                await _discordBot.NotifyNewOrderAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch Discord notification for order #{OrderNumber}.", order.OrderNumber);
            }
        });

        return Ok(new
        {
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            discordUserId = order.DiscordUserId,
            createdAt = order.CreatedAt
        });
    }

    [HttpPost("discord/test")]
    public async Task<IActionResult> TestDiscordNotification([FromQuery] string? message)
    {
        var testOrder = new Order
        {
            OrderNumber = $"TEST-ORD-{Random.Shared.Next(1000, 9999)}",
            ServiceName = "Champions Finals 15 Wins (Test Boost)",
            Platform = "PS5",
            PriceSnapshot = 49.99m,
            CustomerName = "Test Gamer",
            GamerTag = "ProTester_99",
            ContactMethod = "Discord",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        var success = await _discordBot.NotifyNewOrderAsync(testOrder);
        return Ok(new
        {
            sent = success,
            message = success ? "Test notification successfully sent to Discord!" : "Discord Webhook or Bot not yet configured with valid credentials in appsettings.json.",
            order = testOrder.OrderNumber
        });
    }

    [HttpGet("track/{reference}")]
    public async Task<IActionResult> TrackOrder(string reference, [FromQuery] string? role = null)
    {
        if (string.IsNullOrWhiteSpace(reference))
        {
            return BadRequest("Reference is required.");
        }

        // Scenario Enforcement: Only Admin can track orders; customers cannot track orders.
        bool isAdmin = false;
        if (!string.IsNullOrWhiteSpace(role) && (role.Equals("Admin", StringComparison.OrdinalIgnoreCase) || role.Equals("A", StringComparison.OrdinalIgnoreCase)))
        {
            isAdmin = true;
        }
        else if (User.Identity?.IsAuthenticated == true && (User.IsInRole("Admin") || User.Claims.Any(c => c.Value.Equals("Admin", StringComparison.OrdinalIgnoreCase))))
        {
            isAdmin = true;
        }

        if (!isAdmin)
        {
            return StatusCode(403, new
            {
                restricted = true,
                message = "Access Denied: Only Admin operators can track orders. Customers cannot track orders directly."
            });
        }

        var refClean = reference.Trim();
        var order = await _db.Orders
            .Include(o => o.StatusHistory)
            .Include(o => o.MatchLogs)
            .Include(o => o.Proofs)
            .Include(o => o.AssignedPlayer)
            .FirstOrDefaultAsync(o =>
                o.OrderNumber == refClean ||
                o.OrderId == refClean ||
                o.WhatsAppReference == refClean);

        if (order == null)
        {
            return NotFound(new { message = $"No order found for reference '{reference}'." });
        }

        // Get booster nickname safely if assigned
        string? boosterNickname = null;
        if (!string.IsNullOrEmpty(order.AssignedPlayerId))
        {
            var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == order.AssignedPlayerId);
            boosterNickname = profile?.ProNickname ?? order.AssignedPlayer?.DisplayName ?? "Assigned Verified Pro";
        }

        // Return sanitized public tracking info (zero passwords or credentials exposed)
        return Ok(new
        {
            orderNumber = order.OrderNumber,
            serviceName = order.ServiceName,
            platform = order.Platform,
            status = order.Status,
            price = order.PriceSnapshot,
            contactMethod = order.ContactMethod,
            paymentStatus = order.PaymentStatus,
            currentScore = order.CurrentScore,
            progressPercentage = order.ProgressPercentage,
            boosterAssigned = order.AssignedPlayerId != null,
            boosterNickname = boosterNickname,
            boosterVpnLocation = order.BoosterVpnLocation,
            createdAt = order.CreatedAt,
            startedAt = order.StartedAt,
            completedAt = order.CompletedAt,
            matchLogs = order.MatchLogs.OrderByDescending(m => m.LoggedAt).Select(m => new
            {
                matchNumber = m.MatchNumber,
                result = m.Result,
                scoreLabel = m.MatchScoreLabel,
                comment = m.BoosterComment,
                loggedAt = m.LoggedAt
            }).ToList(),
            proofs = order.Proofs.Select(p => new
            {
                proofId = p.ProofId,
                fileName = p.FileName,
                fileUrl = p.FileUrl,
                uploadedAt = p.UploadedAt
            }).ToList(),
            statusHistory = order.StatusHistory.Select(h => new
            {
                status = h.NewStatus,
                date = h.ChangedAt,
                note = h.Notes
            }).OrderByDescending(h => h.date).ToList()
        });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserOrders(string userId)
    {
        var orders = await _db.Orders
            .Where(o => o.UserId == userId || o.CustomerEmail == userId)
            .Include(o => o.MatchLogs)
            .Include(o => o.Proofs)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                orderId = o.OrderId,
                orderNumber = o.OrderNumber,
                serviceName = o.ServiceName,
                platform = o.Platform,
                price = o.PriceSnapshot,
                status = o.Status,
                currentScore = o.CurrentScore,
                progress = o.ProgressPercentage,
                createdAt = o.CreatedAt,
                completedAt = o.CompletedAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    public record SendMessageDto(string SenderUserId, string SenderRole, string MessageText, bool IsAdminOnly = false);

    [HttpPost("{orderId}/messages")]
    public async Task<IActionResult> SendMessage(string orderId, [FromBody] SendMessageDto dto)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        string senderId = dto.SenderUserId;
        var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.UserId == senderId);
        if (existingUser == null)
        {
            if (dto.SenderRole == "Customer" && !string.IsNullOrEmpty(order.UserId))
            {
                senderId = order.UserId;
            }
            else
            {
                var autoUser = new User
                {
                    UserId = senderId,
                    DisplayName = dto.SenderRole == "Admin" ? "Admin Operator" : "Customer",
                    Email = $"{senderId.ToLower().Replace(" ", "_")}@boostinghaven.com",
                    Role = dto.SenderRole,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _db.Users.AddAsync(autoUser);
                await _db.SaveChangesAsync();
            }
        }

        var message = new OrderMessage
        {
            OrderId = order.OrderId,
            SenderUserId = senderId,
            SenderRole = dto.SenderRole,
            MessageText = dto.MessageText,
            IsAdminOnlyNote = dto.IsAdminOnly,
            CreatedAt = DateTime.UtcNow
        };

        await _db.OrderMessages.AddAsync(message);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            messageId = message.MessageId,
            orderId = message.OrderId,
            senderUserId = message.SenderUserId,
            senderRole = message.SenderRole,
            messageText = message.MessageText,
            createdAt = message.CreatedAt
        });
    }

    [HttpGet("{orderId}/messages")]
    public async Task<IActionResult> GetMessages(string orderId, [FromQuery] bool isAdmin = false)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        var query = _db.OrderMessages.Where(m => m.OrderId == order.OrderId);
        if (!isAdmin)
        {
            query = query.Where(m => !m.IsAdminOnlyNote);
        }

        var messages = await query
            .OrderBy(m => m.CreatedAt)
            .Select(m => new
            {
                messageId = m.MessageId,
                senderUserId = m.SenderUserId,
                senderRole = m.SenderRole,
                messageText = m.MessageText,
                isAdminOnly = m.IsAdminOnlyNote,
                createdAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }
}
