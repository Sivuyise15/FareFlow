namespace Nexa.Domain.Entities;

public class MonthlyBudget
{
    public int id { get; set; }
    public User user { get; set; }
    public decimal amount { get; set; }
}