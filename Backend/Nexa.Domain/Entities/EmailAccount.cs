namespace Nexa.Domain.Entities;

public class EmailAccount
{
    public int id { get; set; }
    public User user { get; set; }
    public string emailAddress { get; set; }
}