using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int userId);
}