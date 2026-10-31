using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderMatchLog
{
    [Key]
    public int LogId { get; set; }

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(450)]
    public string PlayerId { get; set; } = string.Empty;

    [ForeignKey(nameof(PlayerId))]
    public User? Player { get; set; }

    public int MatchNumber { get; set; }

    [MaxLength(20)]
    public string Result { get; set; } = "Win";

    [MaxLength(100)]
    public string MatchScoreLabel { get; set; } = string.Empty;

    public int CurrentTotalWins { get; set; }

    public int CurrentTotalLosses { get; set; }

    public int ProgressPercentage { get; set; }

    [MaxLength(500)]
    public string? BoosterComment { get; set; }

    [MaxLength(50)]
    public string? VpnIpAddress { get; set; }

    [MaxLength(100)]
    public string? VpnCity { get; set; }

    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}