namespace Nexa.Domain.Entities;

public class Trip
{
    public int id { get; set; }
    public User user { get; set; }
    public Platform platform { get; set; }
    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }
}