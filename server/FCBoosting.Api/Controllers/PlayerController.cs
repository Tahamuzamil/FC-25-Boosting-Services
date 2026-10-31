using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly ILogger<PlayerController> _logger;

    public PlayerController(FCBoostingDbContext db, ILogger<PlayerController> logger)
    {
        _db = db;
        _logger = logger;
    }

    // 1. Available Open Orders that any approved Booster can claim
    [HttpGet("available-orders")]
    public async Task<IActionResult> GetAvailableOrders()
    {
        var orders = await _db.Orders
            .Where(o => (o.Status == "Pending" || o.Status == "Open") && o.AssignedPlayerId == null)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                orderId = o.OrderId,
                orderNumber = o.OrderNumber,
                serviceName = o.ServiceName,
                platform = o.Platform,
                price = o.PriceSnapshot,
                gamerTag = o.GamerTag,
                contactMethod = o.ContactMethod,
                createdAt = o.CreatedAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    // 2. Orders assigned to a specific booster
    [HttpGet("my-orders/{playerId}")]
    public async Task<IActionResult> GetMyOrders(string playerId)
    {
        var orders = await _db.Orders
            .Where(o => o.AssignedPlayerId == playerId)
            .Include(o => o.MatchLogs)
            .Include(o => o.Proofs)
            .OrderByDescending(o => o.UpdatedAt)
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
                vpnLocation = o.BoosterVpnLocation,
                gamerTag = o.GamerTag,
                assignedAt = o.AssignedAt,
                completedAt = o.CompletedAt,
                proofs = o.Proofs.Select(p => new
                {
                    proofId = p.ProofId,
                    fileName = p.FileName,
                    fileUrl = p.FileUrl,
                    approved = p.AdminApproved,
                    uploadedAt = p.UploadedAt
                }),
                matchLogs = o.MatchLogs.OrderByDescending(m => m.LoggedAt).Select(m => new
                {
                    matchNumber = m.MatchNumber,
                    result = m.Result,
                    scoreLabel = m.MatchScoreLabel,
                    comment = m.BoosterComment,
                    loggedAt = m.LoggedAt
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    public record ClaimOrderRequest(string OrderId, string PlayerId, string? VpnLocation);

    // 3. Claim Order
    [HttpPost("claim")]
    public async Task<IActionResult> ClaimOrder([FromBody] ClaimOrderRequest req)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == req.OrderId);
        if (order == null)
        {
            return NotFound("Order not found.");
        }

        if (order.AssignedPlayerId != null && order.Status != "Pending")
        {
            return BadRequest("This order has already been claimed by another booster.");
        }

        var player = await _db.Users.FirstOrDefaultAsync(u => u.UserId == req.PlayerId);
        var proProfile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == req.PlayerId);

        order.AssignedPlayerId = req.PlayerId;
        order.Status = "InProgress";
        order.AssignedAt = DateTime.UtcNow;
        order.StartedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;
        order.BoosterVpnLocation = req.VpnLocation ?? proProfile?.VpnResidentialCountry ?? "United Kingdom (Residential)";
        order.CurrentScore = $"Booster {proProfile?.ProNickname ?? player?.DisplayName ?? "Assigned"} Connected & Playing Match 1";

        if (proProfile != null)
        {
            proProfile.ActiveOrdersCount += 1;
        }

        // Add to audit log
        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = req.PlayerId,
            ActorRole = "Player",
            ActionType = "Claimed",
            OldStatus = "Pending",
            NewStatus = "InProgress",
            Description = $"Order #{order.OrderNumber} claimed by booster {proProfile?.ProNickname ?? player?.DisplayName}.",
            Timestamp = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Order #{order.OrderNumber} successfully claimed!",
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            currentScore = order.CurrentScore
        });
    }

    public record UpdateProgressRequest(
        string OrderId,
        string PlayerId,
        string MatchScoreLabel,
        int ProgressPercentage,
        int MatchesWon,
        int MatchesLost,
        string? BoosterComment,
        string? VpnCity);

    // 4. Update Match Progress
    [HttpPost("update-progress")]
    public async Task<IActionResult> UpdateProgress([FromBody] UpdateProgressRequest req)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == req.OrderId);
        if (order == null) return NotFound("Order not found.");

        if (order.AssignedPlayerId != req.PlayerId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == req.PlayerId);
            if (user?.Role != "Admin")
            {
                return Unauthorized("You are not assigned to this order.");
            }
        }

        order.CurrentScore = req.MatchScoreLabel;
        order.ProgressPercentage = Math.Clamp(req.ProgressPercentage, 0, 100);
        order.UpdatedAt = DateTime.UtcNow;

        _db.OrderMatchLogs.Add(new OrderMatchLog
        {
            OrderId = order.OrderId,
            PlayerId = req.PlayerId,
            MatchNumber = req.MatchesWon + req.MatchesLost,
            Result = req.MatchesWon > 0 ? "Win" : "InProgress",
            MatchScoreLabel = req.MatchScoreLabel,
            CurrentTotalWins = req.MatchesWon,
            CurrentTotalLosses = req.MatchesLost,
            ProgressPercentage = req.ProgressPercentage,
            BoosterComment = req.BoosterComment,
            VpnCity = req.VpnCity,
            LoggedAt = DateTime.UtcNow
        });

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = req.PlayerId,
            ActorRole = "Player",
            ActionType = "ProgressUpdated",
            OldStatus = order.Status,
            NewStatus = order.Status,
            Description = $"Match progress logged: {req.MatchScoreLabel} ({req.ProgressPercentage}%)",
            Timestamp = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Progress updated successfully.",
            currentScore = order.CurrentScore,
            progress = order.ProgressPercentage
        });
    }

    public record CompleteOrderRequest(
        string OrderId,
        string PlayerId,
        string ProofFileName,
        string ProofFileUrl,
        string? ProofNotes);

    // 5. Complete Order & Attach Proof
    [HttpPost("complete")]
    public async Task<IActionResult> CompleteOrder([FromBody] CompleteOrderRequest req)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == req.OrderId);
        if (order == null) return NotFound("Order not found.");

        order.Status = "UnderReview";
        order.ProgressPercentage = 100;
        order.CurrentScore = "Service 100% Completed • Proof Attached • Pending Admin Verification";
        order.UpdatedAt = DateTime.UtcNow;

        _db.OrderProofs.Add(new OrderProof
        {
            OrderId = order.OrderId,
            UploadedByUserId = req.PlayerId,
            ProofType = "Screenshot",
            FileName = req.ProofFileName,
            FileUrl = req.ProofFileUrl,
            Notes = req.ProofNotes ?? "Final match result screenshot proof",
            AdminApproved = false,
            UploadedAt = DateTime.UtcNow
        });

        // Queue Player Commission Earning
        var existingEarning = await _db.PlayerEarnings.FirstOrDefaultAsync(e => e.OrderId == order.OrderId);
        if (existingEarning == null)
        {
            var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == req.PlayerId);
            var commissionRate = profile?.CommissionRate ?? 70.0m;
            var payout = Math.Round(order.PriceSnapshot * (commissionRate / 100m), 2);

            _db.PlayerEarnings.Add(new PlayerEarning
            {
                PlayerId = req.PlayerId,
                OrderId = order.OrderId,
                OrderPriceSnapshot = order.PriceSnapshot,
                CommissionRate = commissionRate,
                PlayerPayoutAmount = payout,
                PlatformFeeAmount = order.PriceSnapshot - payout,
                PayoutStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            });
        }

        _db.OrderAuditLogs.Add(new OrderAuditLog
        {
            OrderId = order.OrderId,
            ActorUserId = req.PlayerId,
            ActorRole = "Player",
            ActionType = "ProofUploaded",
            OldStatus = "InProgress",
            NewStatus = "UnderReview",
            Description = $"Order completed by booster. Proof attached: {req.ProofFileName}.",
            Timestamp = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Order marked complete and submitted for admin review.",
            orderId = order.OrderId,
            status = order.Status
        });
    }

    // 6. Booster Profile & Earnings Summary
    [HttpGet("earnings/{playerId}")]
    public async Task<IActionResult> GetPlayerEarnings(string playerId)
    {
        var profile = await _db.PlayerProfiles.FirstOrDefaultAsync(p => p.UserId == playerId);
        var earnings = await _db.PlayerEarnings
            .Where(e => e.PlayerId == playerId)
            .Include(e => e.Order)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        var totalEarned = earnings.Where(e => e.PayoutStatus == "Paid" || e.PayoutStatus == "Approved").Sum(e => e.PlayerPayoutAmount);
        var pendingPayout = earnings.Where(e => e.PayoutStatus == "Pending").Sum(e => e.PlayerPayoutAmount);

        return Ok(new
        {
            proNickname = profile?.ProNickname ?? "Verified Pro",
            tier = profile?.CompetitiveRankTier ?? "Top 200 Global",
            winRate = profile?.WinRatePercentage ?? 98.5m,
            totalEarned,
            pendingPayout,
            commissionRate = profile?.CommissionRate ?? 70.0m,
            earningsList = earnings.Select(e => new
            {
                orderNumber = e.Order?.OrderNumber,
                service = e.Order?.ServiceName,
                orderAmount = e.OrderPriceSnapshot,
                payout = e.PlayerPayoutAmount,
                status = e.PayoutStatus,
                createdAt = e.CreatedAt
            })
        });
    }
}