using Nexa.Domain.Shared;

namespace Nexa.Domain.Entities;

public class Trip
{
    public int id { get; set; }
    public User user { get; set; }
    public PlatformType platform { get; set; }
    public DateTime? startTime { get; set; }
    public DateTime? endTime { get; set; }
    public decimal totalPaid { get; set; }
    public PaymentMethod? paymentMethod { get; set; }
    public string emailMessageId { get; set; }
    public string? startLocation { get; set; }
    public string? endLocation { get; set; }
    public EmailAccount emailAccount { get; set; }
    public DateTime parsedAt { get; set; }

}