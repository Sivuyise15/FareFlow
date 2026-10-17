using Dapper;
using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using Npgsql;
using Microsoft.Extensions.Configuration;

namespace Nexa.Infrastructure.Persistence
{
    public class EmailAccountRepository: IEmailAccountRepository
    {
        private readonly string _connectionString;
        public EmailAccountRepository(IConfiguration configuration)
        {
            _connectionString = configuration["ConnectionStrings:DefaultConnection"];
        }

        public async Task UpsertAsync(EmailAccount emailAccount)
        {
            const string query = @"
                INSERT INTO ""EmailAccounts"" (userid, email_address, access_token, refresh_token, token_expiry, provider)
                VALUES (@UserId, @EmailAddress, @AccessToken, @RefreshToken, @TokenExpiry, @Provider)
                ON CONFLICT (userid) DO UPDATE SET
                    email_address = EXCLUDED.email_address,
                    access_token = EXCLUDED.access_token,
                    refresh_token = COALESCE(EXCLUDED.refresh_token, ""EmailAccounts"".refresh_token),
                    token_expiry = EXCLUDED.token_expiry,
                    provider = EXCLUDED.provider;";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(query, new
            {
                UserId = emailAccount.user!.id,
                EmailAddress = emailAccount.email_address,
                AccessToken = emailAccount.access_token,
                RefreshToken = emailAccount.refresh_token,
                TokenExpiry = emailAccount.token_expiry,
                Provider = emailAccount.provider.ToString()
            });
        }

        public async Task<EmailAccount?> GetByUserIdAsync(int userId)
        {
            const string query = @"
                SELECT id, email_address, access_token, refresh_token, token_expiry, provider
                FROM ""EmailAccounts""
                WHERE userid = @UserId;";

            await using var connection = new NpgsqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<EmailAccount>(query, new { UserId = userId });
        }

        public async Task DeleteByUserIdAsync(int userId)
        {
            const string query = "DELETE FROM \"EmailAccounts\" WHERE userid = @UserId;";

            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.ExecuteAsync(query, new { UserId = userId });
        }
    }
}
