using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IEmailAccountRepository
{
    Task<EmailAccount> GetByUserIdAsync(int userId);
}