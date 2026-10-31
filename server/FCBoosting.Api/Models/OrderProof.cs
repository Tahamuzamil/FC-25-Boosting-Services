using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderProof
{
    [Key]
    public int ProofId { get; set; }

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(450)]
    public string UploadedByUserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UploadedByUserId))]
    public User? UploadedBy { get; set; }

    [MaxLength(50)]
    public string ProofType { get; set; } = "Screenshot";

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string FileUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public bool AdminApproved { get; set; } = false;

    [MaxLength(450)]
    public string? AdminApprovedBy { get; set; }

    public DateTime? AdminApprovedAt { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}