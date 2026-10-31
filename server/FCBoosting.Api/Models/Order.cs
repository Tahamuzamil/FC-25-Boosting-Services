using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class Order
{
    [Key]
    [MaxLength(450)]
    public string OrderId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(50)]
    public string OrderNumber { get; set; } = string.Empty; // e.g. "FC-ORD-12345"

    [MaxLength(450)]
    public string? UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    [MaxLength(100)]
    public string ServiceId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ServiceName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string ContactMethod { get; set; } = "WhatsApp"; // "WhatsApp", "Discord", "Web"

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // "Pending", "Accepted", "InProgress", "AwaitingCustomer", "Completed", "Cancelled"

    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceSnapshot { get; set; }

    [MaxLength(50)]
    public string Platform { get; set; } = "PS5";

    [MaxLength(100)]
    public string? CustomerName { get; set; }

    [MaxLength(256)]
    public string? CustomerEmail { get; set; }

    [MaxLength(100)]
    public string? GamerTag { get; set; }

    [MaxLength(50)]
    public string? DiscordUserId { get; set; }

    [MaxLength(50)]
    public string? DiscordGuildId { get; set; }

    [MaxLength(50)]
    public string? DiscordChannelId { get; set; }

    [MaxLength(50)]
    public string? DiscordMessageId { get; set; }

    [MaxLength(100)]
    public string? WhatsAppReference { get; set; }

    [MaxLength(450)]
    public string? AssignedPlayerId { get; set; }

    [ForeignKey(nameof(AssignedPlayerId))]
    public User? AssignedPlayer { get; set; }

    public DateTime? AssignedAt { get; set; }

    public DateTime? StartedAt { get; set; }

    [MaxLength(200)]
    public string CurrentScore { get; set; } = "Awaiting Booster Assignment";

    public int ProgressPercentage { get; set; } = 0;

    [MaxLength(150)]
    public string? BoosterVpnLocation { get; set; }

    public string? CustomerCredentialsEncrypted { get; set; }

    public string? AdminRemarks { get; set; }

    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "WhatsApp / Card";

    [MaxLength(50)]
    public string PaymentStatus { get; set; } = "Paid";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation collections
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
    public ICollection<OrderAttachment> Attachments { get; set; } = new List<OrderAttachment>();
    public ICollection<OrderMatchLog> MatchLogs { get; set; } = new List<OrderMatchLog>();
    public ICollection<OrderProof> Proofs { get; set; } = new List<OrderProof>();
    public ICollection<OrderAuditLog> AuditLogs { get; set; } = new List<OrderAuditLog>();
    public ICollection<OrderMessage> Messages { get; set; } = new List<OrderMessage>();
}
