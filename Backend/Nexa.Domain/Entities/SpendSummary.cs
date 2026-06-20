namespace Nexa.Domain.Entities;

internal class SpendSummary
{
    public int id { get; set; }
    public User user { get; set; }
    public Platform platform { get; set; }
    public decimal totalSpend { get; set; }
}