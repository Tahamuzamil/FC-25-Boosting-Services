using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class PlayerProfile
{
    [Key]
    public int ProfileId { get; set; }

    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProNickname { get; set; } = string.Empty;

    [MaxLength(50)]
    public string PlatformSpecialty { get; set; } = "PS5";

    [MaxLength(100)]
    public string CompetitiveRankTier { get; set; } = "Top 200 Global";

    public int WeekendLeagueAverageWins { get; set; } = 15;

    [Column(TypeName = "decimal(5,2)")]
    public decimal WinRatePercentage { get; set; } = 98.5m;

    public int TotalCompletedOrders { get; set; } = 0;

    [NotMapped]
    public int TotalOrdersCompleted { get => TotalCompletedOrders; set => TotalCompletedOrders = value; }

    public int ActiveOrdersCount { get; set; } = 0;

    public int MaxConcurrentOrders { get; set; } = 2;

    public bool IsAvailable { get; set; } = true;

    [NotMapped]
    public bool IsAvailableNow { get => IsAvailable; set => IsAvailable = value; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal CommissionRate { get; set; } = 70.0m;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalEarned { get; set; } = 0.0m;

    [MaxLength(100)]
    public string VpnResidentialCountry { get; set; } = "United Kingdom";

    [MaxLength(100)]
    public string? DiscordHandle { get; set; }

    [MaxLength(50)]
    public string ApplicationStatus { get; set; } = "Approved";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}