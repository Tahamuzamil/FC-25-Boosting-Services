using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderAuditLog
{
    [Key]
    public int AuditId { get; set; }

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [MaxLength(450)]
    public string? ActorUserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string ActorRole { get; set; } = "System";

    [Required]
    [MaxLength(100)]
    public string ActionType { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? OldStatus { get; set; }

    [MaxLength(50)]
    public string? NewStatus { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}