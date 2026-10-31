using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

[Table("OrderMessages")]
public class OrderMessage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int MessageId { get; set; }

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [Required]
    [MaxLength(450)]
    public string SenderUserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string SenderRole { get; set; } = "Customer"; // Customer, Player, Admin

    [Required]
    public string MessageText { get; set; } = string.Empty;

    public bool IsAdminOnlyNote { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(OrderId))]
    public virtual Order? Order { get; set; }

    [ForeignKey(nameof(SenderUserId))]
    public virtual User? SenderUser { get; set; }
}
