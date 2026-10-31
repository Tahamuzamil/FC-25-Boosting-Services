using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;
using FCBoosting.Api.Services;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly IOrderLifecycleService _lifecycle;
    private readonly IStorageService _storage;
    private readonly IDiscordBotService _discordBot;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        FCBoostingDbContext db,
        IOrderLifecycleService lifecycle,
        IStorageService storage,
        IDiscordBotService discordBot,
        ILogger<AdminController> logger)
    {
        _db = db;
        _lifecycle = lifecycle;
        _storage = storage;
        _discordBot = discordBot;
        _logger = logger;
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? status = null,
        [FromQuery] string? contactMethod = null,
        [FromQuery] string? search = null)
    {
        var query = _db.Orders
            .Include(o => o.OrderDetails)
            .Include(o => o.Attachments)
            .Include(o => o.StatusHistory)
            .Include(o => o.MatchLogs)
            .Include(o => o.Proofs)
            .Include(o => o.AssignedPlayer)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
        {
            query = query.Where(o => o.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(contactMethod) && contactMethod != "All")
        {
            query = query.Where(o => o.ContactMethod == contactMethod);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(o =>
                o.OrderNumber.Contains(s) ||
                (o.CustomerName != null && o.CustomerName.Contains(s)) ||
                (o.CustomerEmail != null && o.CustomerEmail.Contains(s)) ||
                o.ServiceName.Contains(s));
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o => new
        {
            id = o.OrderId,
            orderNumber = o.OrderNumber,
            serviceName = o.ServiceName,
            status = o.Status,
            price = o.PriceSnapshot,
            platform = o.Platform,
            contactMethod = o.ContactMethod,
            paymentMethod = o.PaymentMethod,
            paymentStatus = o.PaymentStatus,
            customerName = o.CustomerName,
            customerEmail = o.CustomerEmail,
            gamerTag = o.GamerTag,
            discordUserId = o.DiscordUserId,
            whatsAppReference = o.WhatsAppReference,
            currentScore = o.CurrentScore,
            progressPercentage = o.ProgressPercentage,
            assignedPlayerId = o.AssignedPlayerId,
            assignedPlayerName = o.AssignedPlayer?.DisplayName,
            vpnLocation = o.BoosterVpnLocation,
            customerCredentials = o.CustomerCredentialsEncrypted,
            adminRemarks = o.AdminRemarks,
            createdAt = o.CreatedAt,
            startedAt = o.StartedAt,
            updatedAt = o.UpdatedAt,
            completedAt = o.CompletedAt,
            attachmentsCount = o.Attachments.Count + o.Proofs.Count,
            proofs = o.Proofs.Select(p => new
            {
                p.ProofId,
                p.FileName,
                p.FileUrl,
                p.Notes,
                p.AdminApproved,
                p.UploadedAt
            }),
            matchLogs = o.MatchLogs.OrderByDescending(m => m.LoggedAt).Select(m => new
            {
                m.MatchNumber,
                m.Result,
                m.MatchScoreLabel,
                m.BoosterComment,
                m.LoggedAt
            }),
            history = o.StatusHistory.OrderByDescending(h => h.ChangedAt).Select(h => new
            {
                previousStatus = h.PreviousStatus,
                newStatus = h.NewStatus,
                changedBy = h.ChangedByUserId,
                date = h.ChangedAt,
                notes = h.Notes
            }).ToList()
        }));
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var orders = await _db.Orders.AsNoTracking().ToListAsync();
        var earnings = await _db.PlayerEarnings.AsNoTracking().ToListAsync();
        var boosters = await _db.PlayerProfiles.AsNoTracking().Include(p => p.User).ToListAsync();
        var recentAudits = await _db.OrderAuditLogs
            .OrderByDescending(a => a.Timestamp)
            .Take(15)
            .AsNoTracking()
            .ToListAsync();

        var totalOrders = orders.Count;
        var pendingOrders = orders.Count(o => o.Status == "Pending" || o.Status == "Open");
        var activeOrders = orders.Count(o => o.Status == "InProgress" || o.Status == "Accepted" || o.Status == "UnderReview");
        var completedOrders = orders.Count(o => o.Status == "Completed");
        var cancelledOrders = orders.Count(o => o.Status == "Cancelled");

        var totalRevenue = orders.Where(o => o.Status != "Cancelled").Sum(o => o.PriceSnapshot);
        var completedRevenue = orders.Where(o => o.Status == "Completed").Sum(o => o.PriceSnapshot);
        var totalBoosterPayouts = earnings.Where(e => e.PayoutStatus == "Paid" || e.PayoutStatus == "Approved").Sum(e => e.PlayerPayoutAmount);

        // Platform breakdown
        var byPlatform = orders.GroupBy(o => o.Platform ?? "Unknown")
            .Select(g => new { platform = g.Key, count = g.Count(), total = g.Sum(x => x.PriceSnapshot) })
            .ToList();

        // Top services
        var topServices = orders.GroupBy(o => o.ServiceName)
            .Select(g => new { serviceName = g.Key, count = g.Count(), revenue = g.Sum(x => x.PriceSnapshot) })
            .OrderByDescending(g => g.revenue)
            .Take(5)
            .ToList();

        return Ok(new
        {
            summary = new
            {
                totalOrders,
                pendingOrders,
                activeOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                completedRevenue,
                totalBoosterPayouts,
                netPlatformProfit = completedRevenue - totalBoosterPayouts
            },
            platforms = byPlatform,
            topServices,
            activeBoostersCount = boosters.Count(b => b.ApplicationStatus == "Approved"),
            boosters = boosters.Select(b => new
            {
                userId = b.UserId,
                nickname = b.ProNickname,
                tier = b.CompetitiveRankTier,
                winRate = b.WinRatePercentage,
                totalOrders = b.TotalOrdersCompleted,
                activeOrders = b.ActiveOrdersCount,
                commissionRate = b.CommissionRate,
                status = b.ApplicationStatus
            }),
            recentAudits = recentAudits.Select(a => new
            {
                id = a.AuditId,
                orderId = a.OrderId,
                actor = a.ActorRole,
                action = a.ActionType,
                oldStatus = a.OldStatus,
                newStatus = a.NewStatus,
                description = a.Description,
                timestamp = a.Timestamp
            })
        });
    }

    public record AssignBoosterRequest(string PlayerId, string? Notes);

    [HttpPost("orders/{orderId}/assign")]
    public async Task<IActionResult> AssignBooster(string orderId, [FromBody] AssignBoosterRequest req)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        var player = await _db.Users.FirstOrDefaultAsync(u => u.UserId == req.PlayerId);
        var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == req.PlayerId);

        var prevPlayer = order.AssignedPlayerId;
        order.AssignedPlayerId = req.PlayerId;
        order.AssignedAt = DateTime.UtcNow;
        if (order.Status == "Pending" || order.Status == "Open")
        {
            order.Status = "InProgress";
            order.StartedAt = DateTime.UtcNow;
        }
        order.BoosterVpnLocation = profile?.VpnResidentialCountry ?? "United Kingdom (Residential)";
        order.CurrentScore = $"Booster {profile?.ProNickname ?? player?.DisplayName ?? "Assigned"} Connected & Preparing Match.";
        order.UpdatedAt = DateTime.UtcNow;

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = "Admin",
            ActorRole = "Admin",
            ActionType = "Assigned",
            OldStatus = prevPlayer == null ? "Unassigned" : $"Reassigned from {prevPlayer}",
            NewStatus = order.Status,
            Description = $"Admin assigned order #{order.OrderNumber} to pro player {profile?.ProNickname ?? player?.DisplayName}. {req.Notes}",
            Timestamp = DateTime.UtcNow
        });

        _db.OrderStatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.OrderId,
            PreviousStatus = "Pending",
            NewStatus = order.Status,
            ChangedByUserId = "Admin",
            ChangedAt = DateTime.UtcNow,
            Notes = $"Booster {profile?.ProNickname ?? player?.DisplayName} assigned by Admin."
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Order #{order.OrderNumber} assigned successfully.",
            orderId = order.OrderId,
            assignedPlayerId = order.AssignedPlayerId,
            status = order.Status
        });
    }

    public record UpdateStatusRequest(string NewStatus, string? Notes);

    [HttpPost("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] UpdateStatusRequest request)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        var oldStatus = order.Status;
        order.Status = request.NewStatus;
        order.UpdatedAt = DateTime.UtcNow;
        if (request.NewStatus == "Completed")
        {
            order.CompletedAt = DateTime.UtcNow;
            order.ProgressPercentage = 100;
        }

        _db.OrderStatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.OrderId,
            PreviousStatus = oldStatus,
            NewStatus = request.NewStatus,
            ChangedByUserId = "Admin",
            ChangedAt = DateTime.UtcNow,
            Notes = request.Notes ?? $"Status updated by Admin to {request.NewStatus}."
        });

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = "Admin",
            ActorRole = "Admin",
            ActionType = "StatusChanged",
            OldStatus = oldStatus,
            NewStatus = request.NewStatus,
            Description = $"Status changed from {oldStatus} to {request.NewStatus}. {request.Notes}",
            Timestamp = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();

        // Discord notification
        if (!string.IsNullOrEmpty(order.DiscordUserId))
        {
            _ = Task.Run(() => _discordBot.SendOrderStatusUpdateNotificationAsync(order.OrderNumber, request.NewStatus, request.Notes));
        }

        return Ok(new
        {
            message = $"Order status updated to {request.NewStatus}.",
            orderNumber = order.OrderNumber,
            newStatus = order.Status,
            updatedAt = order.UpdatedAt
        });
    }

    public record ApproveOrderRequest(string? Remarks);

    [HttpPost("orders/{orderId}/approve")]
    public async Task<IActionResult> ApproveAndFinalizeOrder(string orderId, [FromBody] ApproveOrderRequest req)
    {
        var order = await _db.Orders
            .Include(o => o.Proofs)
            .FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);

        if (order == null) return NotFound("Order not found.");

        order.Status = "Completed";
        order.CompletedAt = DateTime.UtcNow;
        order.ProgressPercentage = 100;
        order.CurrentScore = "Verified 100% Completed by Admin • Proof Approved";
        order.AdminRemarks = req.Remarks ?? "Approved by Admin. All targets met ban-free.";
        order.UpdatedAt = DateTime.UtcNow;

        // Approve all attached proofs
        foreach (var proof in order.Proofs)
        {
            proof.AdminApproved = true;
            proof.AdminApprovedAt = DateTime.UtcNow;
        }

        // Approve booster earning payout
        var earning = await _db.PlayerEarnings.FirstOrDefaultAsync(e => e.OrderId == order.OrderId);
        if (earning != null)
        {
            earning.PayoutStatus = "Approved";
        }

        // Increment booster completed count
        if (!string.IsNullOrEmpty(order.AssignedPlayerId))
        {
            var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == order.AssignedPlayerId);
            if (profile != null)
            {
                profile.TotalOrdersCompleted += 1;
                if (profile.ActiveOrdersCount > 0) profile.ActiveOrdersCount -= 1;
            }
        }

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = "Admin",
            ActorRole = "Admin",
            ActionType = "Approved",
            OldStatus = "UnderReview",
            NewStatus = "Completed",
            Description = $"Order #{order.OrderNumber} approved and finalized by admin. Payout queued.",
            Timestamp = DateTime.UtcNow
        });

        _db.OrderStatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.OrderId,
            PreviousStatus = "UnderReview",
            NewStatus = "Completed",
            ChangedByUserId = "Admin",
            ChangedAt = DateTime.UtcNow,
            Notes = "Admin verified match proofs and finalized order."
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Order #{order.OrderNumber} approved and finalized successfully.",
            orderId = order.OrderId,
            status = order.Status,
            completedAt = order.CompletedAt
        });
    }

    public record AdminRemarkRequest(string Remark);

    [HttpPost("orders/{orderId}/remark")]
    public async Task<IActionResult> AddRemark(string orderId, [FromBody] AdminRemarkRequest req)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        order.AdminRemarks = req.Remark;
        order.UpdatedAt = DateTime.UtcNow;

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = "Admin",
            ActorRole = "Admin",
            ActionType = "RemarkAdded",
            OldStatus = order.Status,
            NewStatus = order.Status,
            Description = $"Admin remark updated: {req.Remark}",
            Timestamp = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        return Ok(new { message = "Remark saved.", remark = order.AdminRemarks });
    }

    [HttpGet("orders/{orderId}/audit")]
    public async Task<IActionResult> GetOrderAuditLog(string orderId)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null) return NotFound("Order not found.");

        var logs = await _db.OrderAuditLogs
            .Where(a => a.OrderId == order.OrderId)
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new
            {
                auditId = a.AuditId,
                orderId = a.OrderId,
                actorUserId = a.ActorUserId,
                actorRole = a.ActorRole,
                actionType = a.ActionType,
                oldStatus = a.OldStatus,
                newStatus = a.NewStatus,
                description = a.Description,
                ipAddress = a.IpAddress,
                timestamp = a.Timestamp
            })
            .ToListAsync();

        return Ok(logs);
    }

    [HttpGet("boosters")]
    public async Task<IActionResult> GetBoosters()
    {
        var boosters = await _db.PlayerProfiles
            .Include(p => p.User)
            .AsNoTracking()
            .ToListAsync();

        return Ok(boosters.Select(b => new
        {
            userId = b.UserId,
            name = b.User?.DisplayName ?? "Pro Player",
            email = b.User?.Email,
            nickname = b.ProNickname,
            tier = b.CompetitiveRankTier,
            winRate = b.WinRatePercentage,
            totalOrders = b.TotalOrdersCompleted,
            activeOrders = b.ActiveOrdersCount,
            commissionRate = b.CommissionRate,
            vpnCountry = b.VpnResidentialCountry,
            status = b.ApplicationStatus,
            available = b.IsAvailableNow
        }));
    }

    public record UpdateBoosterStatusRequest(string Status, decimal? CommissionRate, bool? IsAvailable);

    [HttpPost("boosters/{userId}/status")]
    public async Task<IActionResult> UpdateBoosterStatus(string userId, [FromBody] UpdateBoosterStatusRequest req)
    {
        var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return NotFound("Booster profile not found.");

        if (!string.IsNullOrWhiteSpace(req.Status)) profile.ApplicationStatus = req.Status;
        if (req.CommissionRate.HasValue) profile.CommissionRate = req.CommissionRate.Value;
        if (req.IsAvailable.HasValue) profile.IsAvailableNow = req.IsAvailable.Value;
        profile.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Booster updated successfully.",
            userId = profile.UserId,
            status = profile.ApplicationStatus,
            commissionRate = profile.CommissionRate,
            available = profile.IsAvailableNow
        });
    }

    [HttpPost("orders/{orderId}/proof")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB max
    public async Task<IActionResult> UploadProofAttachment(string orderId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded or file is empty.");
        }

        var adminUserId = User.Identity?.Name ?? "AdminOperator";

        await using var stream = file.OpenReadStream();
        var (success, message, attachment) = await _storage.SaveProofAttachmentAsync(
            orderId: orderId,
            fileName: file.FileName,
            contentType: file.ContentType,
            fileSize: file.Length,
            fileStream: stream,
            uploaderUserId: adminUserId);

        if (!success)
        {
            return BadRequest(new { message });
        }

        return Ok(new
        {
            message,
            attachmentId = attachment?.AttachmentId,
            fileName = attachment?.FileName,
            uploadedAt = attachment?.UploadedAt
        });
    }

    [HttpGet("orders/{orderId}/proof/{attachmentId}")]
    public async Task<IActionResult> GetProofAttachment(string orderId, string attachmentId)
    {
        var (stream, contentType, fileName) = await _storage.GetAttachmentStreamAsync(attachmentId);
        if (stream == null)
        {
            return NotFound("Proof attachment not found on secure disk storage.");
        }

        return File(stream, contentType, fileName);
    }
}
