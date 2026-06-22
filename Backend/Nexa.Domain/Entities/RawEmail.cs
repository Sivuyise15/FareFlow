
namespace Nexa.Domain.Entities;

public class RawEmail
{
    public string messageId { get; set; }
    public string senderEmail { get; set; }
    public string? subject { get; set; }
    public string body { get; set; }
    public DateTime receivedAt { get; set; }
}