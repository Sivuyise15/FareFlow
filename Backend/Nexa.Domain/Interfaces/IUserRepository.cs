using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> FindOrCreateGoogleUserAsync(string googleSubject, string email, string? name, string? surname);
    Task<User?> GetUserByIdAsync(int userId);
}