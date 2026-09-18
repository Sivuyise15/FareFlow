using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using Npgsql;

namespace Nexa.Infrastructure.Persistence
{
    public class EmailAccountRepository: IEmailAccountRepository
    {
        private readonly string _connectionString;
        public EmailAccountRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task SaveAsync(EmailAccount emailAccount)
        {
            using (var connection = new Npgsql.NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    INSERT INTO EmailAccounts (userid, emailAddress, accessToken, refreshToken, tokenExpiry, provider)
                    VALUES (@UserId, @EmailAddress, @AccessToken, @RefreshToken, @TokenExpiry, @Provider)
                    ON CONFLICT (userid) DO UPDATE
                    SET EmailAddress = EXCLUDED.emailAddress,
                        AccessToken = EXCLUDED.accessToken,
                        RefreshToken = EXCLUDED.refreshToken,
                        TokenExpiry = EXCLUDED.tokenExpiry,
                        Provider = EXCLUDED.provider;";
                using (var command = new Npgsql.NpgsqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserId", emailAccount.user.id);
                    command.Parameters.AddWithValue("@EmailAddress", emailAccount.emailAddress);
                    command.Parameters.AddWithValue("@AccessToken", emailAccount.accessToken);
                    command.Parameters.AddWithValue("@RefreshToken", emailAccount.refreshToken);
                    command.Parameters.AddWithValue("@TokenExpiry", emailAccount.tokenExpiry);
                    command.Parameters.AddWithValue("@Provider", emailAccount.provider.ToString());
                    await command.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
