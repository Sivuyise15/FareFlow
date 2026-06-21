using Nexa.Domain.Entities;
public interface IEmailAccountRepository
{
    Task<EmailAccount> GetByUserIdAsync(Guid userId);
}