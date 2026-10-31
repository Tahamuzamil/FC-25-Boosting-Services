using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class PlayerEarning
{
    [Key]
    public int EarningId { get; set; }

    [Required]
    [MaxLength(450)]
    public string PlayerId { get; set; } = string.Empty;

    [ForeignKey(nameof(PlayerId))]
    public User? Player { get; set; }

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal OrderPriceSnapshot { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal CommissionRate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PlayerPayoutAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PlatformFeeAmount { get; set; }

    [MaxLength(50)]
    public string PayoutStatus { get; set; } = "Pending";

    [MaxLength(50)]
    public string? PayoutMethod { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}