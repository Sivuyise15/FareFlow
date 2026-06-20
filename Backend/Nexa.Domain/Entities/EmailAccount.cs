namespace Nexa.Domain.Entities;

internal class EmailAccount
{
    public int id { get; set; }
    public User user { get; set; }
    public string emailAddress { get; set; }
}